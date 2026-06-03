#!/usr/bin/env bash
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
SERVER="mindmatter-server"          # SSH alias fra ~/.ssh/config
CONTAINER="rytterbakken-landing"
IMAGE="rytterbakken-landing:latest"
DOMAIN="rytterbakken.mindmatter.no"
PORT=3000
REPO_DIR="/root/rytterbakken-landing"
GITHUB_REPO="https://github.com/janhelgeo-cmyk/rytterbakken-landing.git"

# Les variabler fra lokal .env
if [ -f ".env" ]; then
  _env() { grep -E "^$1=" .env | cut -d'"' -f2; }
  VITE_SUPABASE_URL=$(_env VITE_SUPABASE_URL)
  VITE_SUPABASE_PUBLISHABLE_KEY=$(_env VITE_SUPABASE_PUBLISHABLE_KEY)
  VITE_SUPABASE_PROJECT_ID=$(_env VITE_SUPABASE_PROJECT_ID)
  SUPABASE_URL=$(_env SUPABASE_URL)
  SUPABASE_SERVICE_ROLE_KEY=$(_env SUPABASE_SERVICE_ROLE_KEY)
  RESEND_API_KEY=$(_env RESEND_API_KEY)
  ADMIN_PASSWORD=$(_env ADMIN_PASSWORD)
  ADMIN_SESSION_SECRET=$(_env ADMIN_SESSION_SECRET)
  OPENROUTER_API_KEY=$(_env OPENROUTER_API_KEY)
else
  echo "❌  Fant ingen .env — kjør fra prosjektmappen." && exit 1
fi

echo "🚀  Deployer $CONTAINER → $DOMAIN"

# ── Push lokale endringer ──────────────────────────────────────────────────────
echo "📦  Pusher til GitHub..."
git push

# ── Bygg og start på server ───────────────────────────────────────────────────
ssh "$SERVER" bash -s -- \
  "$REPO_DIR" "$GITHUB_REPO" "$IMAGE" "$CONTAINER" "$DOMAIN" "$PORT" \
  "$VITE_SUPABASE_URL" "$VITE_SUPABASE_PUBLISHABLE_KEY" "$VITE_SUPABASE_PROJECT_ID" \
  "$SUPABASE_URL" "$SUPABASE_SERVICE_ROLE_KEY" \
  "$RESEND_API_KEY" "$ADMIN_PASSWORD" "$ADMIN_SESSION_SECRET" \
  "$OPENROUTER_API_KEY" \
<<'REMOTE'
  set -euo pipefail
  REPO_DIR="$1" GITHUB_REPO="$2" IMAGE="$3" CONTAINER="$4"
  DOMAIN="$5" PORT="$6"
  VITE_URL="$7" VITE_KEY="$8" VITE_PROJECT="$9"
  SUPABASE_URL="${10}" SUPABASE_SERVICE_ROLE_KEY="${11}"
  RESEND_API_KEY="${12}" ADMIN_PASSWORD="${13}" ADMIN_SESSION_SECRET="${14}"
  OPENROUTER_API_KEY="${15}"

  echo "⬇️   Henter kode..."
  if [ -d "$REPO_DIR/.git" ]; then
    git -C "$REPO_DIR" pull
  else
    git clone "$GITHUB_REPO" "$REPO_DIR"
  fi

  echo "🔨  Bygger Docker-image..."
  docker build -t "$IMAGE" \
    --build-arg "VITE_SUPABASE_URL=$VITE_URL" \
    --build-arg "VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_KEY" \
    --build-arg "VITE_SUPABASE_PROJECT_ID=$VITE_PROJECT" \
    "$REPO_DIR"

  echo "🔄  Bytter container..."
  docker stop "$CONTAINER" 2>/dev/null || true
  docker rm   "$CONTAINER" 2>/dev/null || true

  docker run -d \
    --name "$CONTAINER" \
    --restart unless-stopped \
    --network coolify \
    -e PORT="$PORT" \
    -e NODE_ENV=production \
    -e VITE_SITE_URL="https://$DOMAIN" \
    -e SUPABASE_URL="$SUPABASE_URL" \
    -e SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
    -e RESEND_API_KEY="$RESEND_API_KEY" \
    -e ADMIN_PASSWORD="$ADMIN_PASSWORD" \
    -e ADMIN_SESSION_SECRET="$ADMIN_SESSION_SECRET" \
    -e OPENROUTER_API_KEY="$OPENROUTER_API_KEY" \
    -l "traefik.enable=true" \
    -l "traefik.http.routers.${CONTAINER}-http.entryPoints=http" \
    -l "traefik.http.routers.${CONTAINER}-http.rule=Host(\`${DOMAIN}\`)" \
    -l "traefik.http.routers.${CONTAINER}-http.middlewares=redirect-to-https" \
    -l "traefik.http.routers.${CONTAINER}-https.entryPoints=https" \
    -l "traefik.http.routers.${CONTAINER}-https.rule=Host(\`${DOMAIN}\`)" \
    -l "traefik.http.routers.${CONTAINER}-https.tls=true" \
    -l "traefik.http.routers.${CONTAINER}-https.tls.certresolver=letsencrypt" \
    -l "traefik.http.routers.${CONTAINER}-https.middlewares=gzip" \
    -l "traefik.http.services.${CONTAINER}.loadbalancer.server.port=${PORT}" \
    "$IMAGE"

  echo "⏳  Venter på oppstart..."
  sleep 3
  docker logs "$CONTAINER" --tail 3

  STATUS=$(wget -qO- --server-response "http://$(docker inspect "$CONTAINER" \
    --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'):${PORT}/" \
    2>&1 | grep "HTTP/" | awk '{print $2}')
  echo "✅  HTTP-status: ${STATUS:-ukjent}"
REMOTE

echo ""
echo "✅  Deploy ferdig → https://$DOMAIN"
