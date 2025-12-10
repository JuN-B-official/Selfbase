#!/usr/bin/env bash
set -Eeuo pipefail

# Selfbase: Docker Entrypoint with Auto Environment Generation
# This script runs before the main application and handles secrets

# Selfbase CLI Commands file location
SELFBASE_ENV_FILE="/tmp/.selfbase-env"
SELFBASE_LOGIN_FILE="/tmp/.selfbase-login"

# usage: file_env VAR [DEFAULT]
#    ie: file_env 'XYZ_DB_PASSWORD' 'example'
file_env() {
	local var="$1"
	local fileVar="${var}_FILE"
	local def="${2:-}"
	if [ "${!var:-}" ] && [ "${!fileVar:-}" ]; then
		echo >&2 "error: both $var and $fileVar are set (but are exclusive)"
		exit 1
	fi
	local val="$def"
	if [ "${!var:-}" ]; then
		val="${!var}"
	elif [ "${!fileVar:-}" ]; then
		val="$(<"${!fileVar}")"
	fi
	export "$var"="$val"
	unset "$fileVar"
}

# Selfbase: Generate random string
generate_random() {
    local length=${1:-32}
    cat /dev/urandom | tr -dc 'a-zA-Z0-9' | head -c "$length" 2>/dev/null || \
    head -c 100 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c "$length"
}

# Selfbase: Generate short ID (8 chars)
generate_short_id() {
    cat /dev/urandom | tr -dc 'a-z0-9' | head -c 8 2>/dev/null || \
    head -c 20 /dev/urandom | base64 | tr -dc 'a-z0-9' | head -c 8
}

# Selfbase: Generate JWT token
generate_jwt() {
    local role=$1
    local jwt_secret=$2
    
    if ! command -v openssl &> /dev/null; then
        echo ""
        return
    fi
    
    local header='{"alg":"HS256","typ":"JWT"}'
    local header_base64=$(echo -n "$header" | base64 -w0 2>/dev/null || echo -n "$header" | base64 | tr -d '\n')
    header_base64=$(echo -n "$header_base64" | tr '+/' '-_' | tr -d '=')
    
    local now=$(date +%s)
    local exp=$((now + 315360000))
    local payload="{\"role\":\"$role\",\"iss\":\"selfbase\",\"iat\":$now,\"exp\":$exp}"
    local payload_base64=$(echo -n "$payload" | base64 -w0 2>/dev/null || echo -n "$payload" | base64 | tr -d '\n')
    payload_base64=$(echo -n "$payload_base64" | tr '+/' '-_' | tr -d '=')
    
    local signature=$(echo -n "${header_base64}.${payload_base64}" | openssl dgst -sha256 -hmac "$jwt_secret" -binary 2>/dev/null | base64 -w0 2>/dev/null || echo "")
    signature=$(echo -n "$signature" | tr '+/' '-_' | tr -d '=')
    
    if [ -n "$signature" ]; then
        echo "${header_base64}.${payload_base64}.${signature}"
    else
        echo ""
    fi
}

# Selfbase: Auto-detect PaaS platform domain
detect_platform_url() {
    # EasyPanel
    if [ -n "${APP_URL:-}" ]; then echo "$APP_URL"; return; fi
    # Coolify
    if [ -n "${COOLIFY_URL:-}" ]; then echo "$COOLIFY_URL"; return; fi
    # Railway
    if [ -n "${RAILWAY_PUBLIC_DOMAIN:-}" ]; then echo "https://${RAILWAY_PUBLIC_DOMAIN}"; return; fi
    if [ -n "${RAILWAY_STATIC_URL:-}" ]; then echo "$RAILWAY_STATIC_URL"; return; fi
    # Render
    if [ -n "${RENDER_EXTERNAL_URL:-}" ]; then echo "$RENDER_EXTERNAL_URL"; return; fi
    # Fly.io
    if [ -n "${FLY_APP_NAME:-}" ]; then echo "https://${FLY_APP_NAME}.fly.dev"; return; fi
    # Heroku
    if [ -n "${HEROKU_APP_NAME:-}" ]; then echo "https://${HEROKU_APP_NAME}.herokuapp.com"; return; fi
    # Vercel
    if [ -n "${VERCEL_URL:-}" ]; then echo "https://${VERCEL_URL}"; return; fi
    # Netlify
    if [ -n "${URL:-}" ] && [ -n "${NETLIFY:-}" ]; then echo "$URL"; return; fi
    # DigitalOcean App Platform
    if [ -n "${APP_DOMAIN:-}" ]; then echo "https://${APP_DOMAIN}"; return; fi
    # Google Cloud Run
    if [ -n "${K_SERVICE:-}" ] && [ -n "${GOOGLE_CLOUD_PROJECT:-}" ]; then
        local region="${GOOGLE_CLOUD_REGION:-us-central1}"
        echo "https://${K_SERVICE}-${GOOGLE_CLOUD_PROJECT}.${region}.run.app"
        return
    fi
    # Azure Container Apps
    if [ -n "${CONTAINER_APP_NAME:-}" ] && [ -n "${CONTAINER_APP_ENV_DNS_SUFFIX:-}" ]; then
        echo "https://${CONTAINER_APP_NAME}.${CONTAINER_APP_ENV_DNS_SUFFIX}"
        return
    fi
    # Dokku
    if [ -n "${DOKKU_APP_NAME:-}" ]; then
        echo "https://${DOKKU_APP_NAME}.${DOKKU_DOMAIN:-dokku.me}"
        return
    fi
    # CapRover
    if [ -n "${CAPROVER_APP_NAME:-}" ]; then
        echo "https://${CAPROVER_APP_NAME}.${CAPROVER_ROOT_DOMAIN:-caprover.local}"
        return
    fi
    
    # Default fallback
    echo "http://localhost:8000"
}

# Create show-env command
create_show_env_command() {
    cat > /usr/local/bin/show-env << 'SHOWENV'
#!/usr/bin/env bash
# Selfbase: Show environment variables

SELFBASE_ENV_FILE="/tmp/.selfbase-env"

if [ ! -f "$SELFBASE_ENV_FILE" ]; then
    echo "Error: Environment file not found. Run this inside the Selfbase container."
    exit 1
fi

# Check for specific variable flag
if [ $# -gt 0 ]; then
    var_name="${1#--}"  # Remove -- prefix if present
    value=$(grep "^${var_name}=" "$SELFBASE_ENV_FILE" | cut -d'=' -f2-)
    if [ -n "$value" ]; then
        echo "$value"
    else
        echo "Variable '$var_name' not found"
        exit 1
    fi
else
    echo "=================================="
    echo "  Selfbase Environment Variables"
    echo "=================================="
    cat "$SELFBASE_ENV_FILE"
    echo ""
    echo "Usage: show-env --VARIABLE_NAME"
fi
SHOWENV
    chmod +x /usr/local/bin/show-env
}

# Create show-login-info command
create_show_login_info_command() {
    cat > /usr/local/bin/show-login-info << 'SHOWLOGIN'
#!/usr/bin/env bash
# Selfbase: Show login credentials

SELFBASE_LOGIN_FILE="/tmp/.selfbase-login"

if [ ! -f "$SELFBASE_LOGIN_FILE" ]; then
    echo "Error: Login file not found. Run this inside the Selfbase container."
    exit 1
fi

echo "=================================="
echo "  Selfbase Login Credentials"
echo "=================================="
cat "$SELFBASE_LOGIN_FILE"
echo "=================================="
SHOWLOGIN
    chmod +x /usr/local/bin/show-login-info
}

echo "[Selfbase] Initializing environment..."

# Load secrets from files if provided
file_env 'POSTGRES_PASSWORD'
file_env 'SUPABASE_ANON_KEY'
file_env 'SUPABASE_SERVICE_KEY'
file_env 'JWT_SECRET'
file_env 'DASHBOARD_PASSWORD'
file_env 'DASHBOARD_USERNAME'

# Selfbase: Auto-detect public URL from PaaS platform
if [ -z "${SUPABASE_PUBLIC_URL:-}" ]; then
    export SUPABASE_PUBLIC_URL=$(detect_platform_url)
    echo "[Selfbase] Auto-detected SUPABASE_PUBLIC_URL: $SUPABASE_PUBLIC_URL"
fi

# Selfbase: Auto-generate missing secrets
if [ -z "${POSTGRES_PASSWORD:-}" ]; then
    export POSTGRES_PASSWORD=$(generate_random 32)
    echo "[Selfbase] Generated POSTGRES_PASSWORD"
fi

if [ -z "${JWT_SECRET:-}" ]; then
    export JWT_SECRET=$(generate_random 64)
    echo "[Selfbase] Generated JWT_SECRET"
fi

if [ -z "${SUPABASE_ANON_KEY:-}" ]; then
    SUPABASE_ANON_KEY=$(generate_jwt "anon" "$JWT_SECRET")
    if [ -n "$SUPABASE_ANON_KEY" ]; then
        export SUPABASE_ANON_KEY
        echo "[Selfbase] Generated SUPABASE_ANON_KEY"
    fi
fi

if [ -z "${SUPABASE_SERVICE_KEY:-}" ]; then
    SUPABASE_SERVICE_KEY=$(generate_jwt "service_role" "$JWT_SECRET")
    if [ -n "$SUPABASE_SERVICE_KEY" ]; then
        export SUPABASE_SERVICE_KEY
        echo "[Selfbase] Generated SUPABASE_SERVICE_KEY"
    fi
fi

# Selfbase: Auto-generate username if not set
if [ -z "${DASHBOARD_USERNAME:-}" ]; then
    export DASHBOARD_USERNAME="selfbase-$(generate_short_id)"
    echo "[Selfbase] Generated DASHBOARD_USERNAME: $DASHBOARD_USERNAME"
fi

# Selfbase: Auto-generate password if not set
if [ -z "${DASHBOARD_PASSWORD:-}" ]; then
    export DASHBOARD_PASSWORD=$(generate_random 32)
    echo "[Selfbase] Generated DASHBOARD_PASSWORD"
fi

# Set defaults
export NEXT_PUBLIC_SELFBASE_MULTI_PROJECT=${NEXT_PUBLIC_SELFBASE_MULTI_PROJECT:-true}

# Save login info to file for CLI commands
echo "Username: $DASHBOARD_USERNAME" > "$SELFBASE_LOGIN_FILE"
echo "Password: $DASHBOARD_PASSWORD" >> "$SELFBASE_LOGIN_FILE"
echo "URL: $SUPABASE_PUBLIC_URL" >> "$SELFBASE_LOGIN_FILE"

# Save environment variables to file for CLI commands
cat > "$SELFBASE_ENV_FILE" << EOF
SUPABASE_PUBLIC_URL=$SUPABASE_PUBLIC_URL
SUPABASE_URL=${SUPABASE_URL:-}
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY
JWT_SECRET=$JWT_SECRET
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
DASHBOARD_USERNAME=$DASHBOARD_USERNAME
DASHBOARD_PASSWORD=$DASHBOARD_PASSWORD
EOF

# Create CLI commands
create_show_env_command
create_show_login_info_command

# Display login info in logs
echo ""
echo "[Selfbase] =========================================="
echo "[Selfbase]  Login Information"
echo "[Selfbase] =========================================="
echo "[Selfbase]  URL:      $SUPABASE_PUBLIC_URL"
echo "[Selfbase]  Username: $DASHBOARD_USERNAME"
echo "[Selfbase]  Password: $DASHBOARD_PASSWORD"
echo "[Selfbase] =========================================="
echo "[Selfbase]  CLI Commands:"
echo "[Selfbase]    show-env           - Show all env variables"
echo "[Selfbase]    show-env --VAR     - Show specific variable"
echo "[Selfbase]    show-login-info    - Show login credentials"
echo "[Selfbase] =========================================="
echo ""

echo "[Selfbase] Environment ready"

exec "${@}"
