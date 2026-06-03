import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const bodySchema = z.object({
  message: z.string().trim().min(1).max(2000),
});

const SYSTEM_PROMPT = `Du er Eir, den personlige veilederen på Rytterbakken.
Rytterbakken er et fysisk testlaboratorium for regenerativ livs- og næringsutvikling i Elverum, bygget av Dr. Aina Mumbi.
Du kjenner medlemmets reise og støtter dem mellom samlingene.

Tone: Varm, jordnær, presis. Norsk som lyder som Norge.
Du er ikke en terapeut og gir ikke medisinske råd.
Svar alltid på norsk. Hold svarene kortfattede og konkrete.`;

export const Route = createFileRoute("/api/member/eir")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const openrouterKey = process.env.OPENROUTER_API_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
          return Response.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Auth
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = authHeader.slice(7).trim();
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
        if (authErr || !user) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse body
        let message: string;
        try {
          const json = await request.json();
          message = bodySchema.parse(json).message;
        } catch {
          return Response.json({ error: "Invalid input" }, { status: 400 });
        }

        // Save user message
        await supabase.from("rb_chat_messages").insert({
          user_id: user.id,
          role: "user",
          content: message,
        });

        // If no AI key, return helpful placeholder
        if (!openrouterKey) {
          const reply = "Eir er ikke tilgjengelig ennå — AI-nøkkel mangler i konfigurasjonen.";
          await supabase.from("rb_chat_messages").insert({
            user_id: user.id,
            role: "eira",
            content: reply,
          });
          return Response.json({ reply });
        }

        // Fetch recent chat history
        const { data: history } = await supabase
          .from("rb_chat_messages")
          .select("role, content")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        const messages = (history ?? [])
          .reverse()
          .map((m) => ({
            role: m.role === "eira" ? "assistant" : "user",
            content: m.content,
          }));

        // Fetch knowledge base
        const { data: knowledge } = await supabase
          .from("rb_knowledge_base")
          .select("title, content")
          .limit(5);

        const knowledgeContext = knowledge?.length
          ? `\n\nRelevant kunnskap:\n${knowledge.map((k) => `### ${k.title}\n${k.content}`).join("\n\n")}`
          : "";

        // Call AI
        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: SYSTEM_PROMPT + knowledgeContext },
              ...messages,
            ],
          }),
        });

        const aiData = await aiRes.json();
        const reply =
          aiData.choices?.[0]?.message?.content ??
          "Jeg klarte ikke å svare akkurat nå. Prøv igjen om litt.";

        // Save Eir reply
        await supabase.from("rb_chat_messages").insert({
          user_id: user.id,
          role: "eira",
          content: reply,
        });

        return Response.json({ reply });
      },
    },
  },
});
