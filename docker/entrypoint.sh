#!/bin/bash

# Selfbase: Docker Entrypoint with Auto Environment Generation
# This script runs before the main application and generates missing secrets

set -e

# Function to generate random string
generate_random() {
    local length=${1:-32}
    openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c "$length"
}

# Function to generate JWT
generate_jwt() {
    local role=$1
    local jwt_secret=$2
    
    local header='{"alg":"HS256","typ":"JWT"}'
    local header_base64=$(echo -n "$header" | base64 -w0 | tr '+/' '-_' | tr -d '=')
    
    local payload="{\"role\":\"$role\",\"iss\":\"selfbase\",\"iat\":$(date +%s),\"exp\":$(($(date +%s) + 315360000))}"
    local payload_base64=$(echo -n "$payload" | base64 -w0 | tr '+/' '-_' | tr -d '=')
    
    local signature=$(echo -n "${header_base64}.${payload_base64}" | openssl dgst -sha256 -hmac "$jwt_secret" -binary | base64 -w0 | tr '+/' '-_' | tr -d '=')
    
    echo "${header_base64}.${payload_base64}.${signature}"
}

echo "[Selfbase] Checking environment variables..."

# Auto-generate missing secrets
if [ -z "$POSTGRES_PASSWORD" ]; then
    export POSTGRES_PASSWORD=$(generate_random 32)
    echo "[Selfbase] Generated POSTGRES_PASSWORD"
fi

if [ -z "$JWT_SECRET" ]; then
    export JWT_SECRET=$(generate_random 64)
    echo "[Selfbase] Generated JWT_SECRET"
fi

if [ -z "$ANON_KEY" ]; then
    export ANON_KEY=$(generate_jwt "anon" "$JWT_SECRET")
    echo "[Selfbase] Generated ANON_KEY"
fi

if [ -z "$SERVICE_ROLE_KEY" ]; then
    export SERVICE_ROLE_KEY=$(generate_jwt "service_role" "$JWT_SECRET")
    echo "[Selfbase] Generated SERVICE_ROLE_KEY"
fi

if [ -z "$DASHBOARD_PASSWORD" ]; then
    export DASHBOARD_PASSWORD=$(generate_random 32)
    echo "[Selfbase] Generated DASHBOARD_PASSWORD"
    echo "[Selfbase] Dashboard credentials: admin / $DASHBOARD_PASSWORD"
fi

if [ -z "$SECRET_KEY_BASE" ]; then
    export SECRET_KEY_BASE=$(generate_random 64)
    echo "[Selfbase] Generated SECRET_KEY_BASE"
fi

if [ -z "$VAULT_ENC_KEY" ]; then
    export VAULT_ENC_KEY=$(generate_random 32)
    echo "[Selfbase] Generated VAULT_ENC_KEY"
fi

if [ -z "$PG_META_CRYPTO_KEY" ]; then
    export PG_META_CRYPTO_KEY=$(generate_random 32)
    echo "[Selfbase] Generated PG_META_CRYPTO_KEY"
fi

if [ -z "$POOLER_TENANT_ID" ]; then
    export POOLER_TENANT_ID=$(generate_random 16)
    echo "[Selfbase] Generated POOLER_TENANT_ID"
fi

if [ -z "$LOGFLARE_PRIVATE_ACCESS_TOKEN" ]; then
    export LOGFLARE_PRIVATE_ACCESS_TOKEN=$(generate_random 32)
    echo "[Selfbase] Generated LOGFLARE_PRIVATE_ACCESS_TOKEN"
fi

if [ -z "$LOGFLARE_PUBLIC_ACCESS_TOKEN" ]; then
    export LOGFLARE_PUBLIC_ACCESS_TOKEN=$(generate_random 32)
    echo "[Selfbase] Generated LOGFLARE_PUBLIC_ACCESS_TOKEN"
fi

# Set defaults for non-secret variables
export POSTGRES_HOST=${POSTGRES_HOST:-db}
export POSTGRES_DB=${POSTGRES_DB:-postgres}
export POSTGRES_PORT=${POSTGRES_PORT:-5432}
export DASHBOARD_USERNAME=${DASHBOARD_USERNAME:-admin}
export KONG_HTTP_PORT=${KONG_HTTP_PORT:-8000}
export KONG_HTTPS_PORT=${KONG_HTTPS_PORT:-8443}
export SITE_URL=${SITE_URL:-http://localhost:3000}
export API_EXTERNAL_URL=${API_EXTERNAL_URL:-http://localhost:8000}
export SUPABASE_PUBLIC_URL=${SUPABASE_PUBLIC_URL:-http://localhost:8000}

echo "[Selfbase] Environment ready"

# Execute the main command
exec "$@"
