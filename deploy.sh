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

# Les VITE_-variabler fra lokal .env (de er publiserbare nøkler, ikke hemmeligheter)
if [ -f ".env" ]; then
  VITE_SUPABASE_URL=$(grep -E "^VITE_SUPABASE_URL=" .env | cut -d'"' -f2)
  VITE_SUPABASE_PUBLISHABLE_KEY=$(grep -E "^VITE_SUPABASE_PUBLISHABLE_KEY=" .env | cut -d'"' -f2)
  VITE_SUPABASE_PROJECT_ID=$(grep -E "^VITE_SUPABASE_PROJECT_ID=" .env | cut -d'"' -f2)
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
<<'REMOTE'
  set -euo pipefail
  REPO_DIR="$1" GITHUB_REPO="$2" IMAGE="$3" CONTAINER="$4"
  DOMAIN="$5" PORT="$6"
  VITE_URL="$7" VITE_KEY="$8" VITE_PROJECT="$9"

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
