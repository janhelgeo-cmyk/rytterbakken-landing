import server from "./dist/server/server.js";
import { join } from "node:path";

const port = Number(process.env.PORT) || 3000;
const clientDir = join(import.meta.dir, "dist/client");

const MIME: Record<string, string> = {
  ".js":   "application/javascript",
  ".mjs":  "application/javascript",
  ".css":  "text/css",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".webp": "image/webp",
  ".json": "application/json",
  ".txt":  "text/plain",
  ".html": "text/html",
};

function ext(path: string) {
  const i = path.lastIndexOf(".");
  return i >= 0 ? path.slice(i) : "";
}

Bun.serve({
  port,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Serve static files from dist/client/
    if (pathname.startsWith("/assets/") || pathname === "/favicon.ico") {
      const filePath = join(clientDir, pathname);
      const file = Bun.file(filePath);
      if (await file.exists()) {
        const mime = MIME[ext(pathname)] ?? "application/octet-stream";
        return new Response(file, {
          headers: {
            "Content-Type": mime,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    // Fall through to SSR
    return server.fetch(req, {}, {} as any);
  },
});

console.log(`Rytterbakken landing running on port ${port}`);
