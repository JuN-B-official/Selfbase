# Selfbase

> **Multi-Project Supabase Fork** - A self-hosting solution for managing multiple projects in a single instance

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## Features

- **Multiple Organizations** - Create and manage multiple organizations
- **Multiple Projects** - Unlimited projects per organization
- **Full Cloud UI** - Complete Supabase Cloud experience, self-hosted
- **Auto-Generated Secrets** - All credentials auto-generated on deployment
- **PaaS Auto-Detection** - Automatic domain detection for 13+ platforms
- **Schema Isolation** - Each project uses its own PostgreSQL schema
- **Built-in CLI** - `show-env` and `show-login-info` commands
- **Dynamic MCP Config** - Connect page shows real credentials for AI assistants

---

## Quick Start

### Docker Deployment (Recommended)

```bash
cd docker
docker compose up -d
```

That's it! All secrets are auto-generated. Check the logs for your dashboard credentials:

```bash
docker logs selfbase-studio
```

You'll see:
```
[Selfbase] ==========================================
[Selfbase]  Login Information
[Selfbase] ==========================================
[Selfbase]  URL:      http://localhost:8000
[Selfbase]  Username: selfbase-a1b2c3d4
[Selfbase]  Password: xYz123AbC...
[Selfbase] ==========================================
```

### CLI Commands

Access environment variables and login info directly:

```bash
# Show login credentials
docker exec -it selfbase-studio show-login-info

# Show all environment variables
docker exec -it selfbase-studio show-env

# Show specific variable
docker exec -it selfbase-studio show-env --JWT_SECRET
docker exec -it selfbase-studio show-env --SUPABASE_ANON_KEY
```

### Local Development

```bash
cd apps/studio
cp .env.example .env
pnpm install
pnpm run dev
```

---

## PaaS Platform Support

Selfbase auto-detects domains from these platforms:

| Platform | Environment Variable |
|----------|---------------------|
| EasyPanel | `APP_URL` |
| Coolify | `COOLIFY_URL` |
| Railway | `RAILWAY_PUBLIC_DOMAIN` |
| Render | `RENDER_EXTERNAL_URL` |
| Fly.io | `FLY_APP_NAME` |
| Heroku | `HEROKU_APP_NAME` |
| Vercel | `VERCEL_URL` |
| Netlify | `URL` |
| DigitalOcean | `APP_DOMAIN` |
| Google Cloud Run | `K_SERVICE` |
| Azure Container Apps | `CONTAINER_APP_NAME` |
| Dokku | `DOKKU_APP_NAME` |
| CapRover | `CAPROVER_APP_NAME` |

Or set manually: `SUPABASE_PUBLIC_URL=https://your-domain.com`

---

## Architecture

```
Selfbase = Supabase Core + Multi-Project Layer + Full Cloud UI

+-----------------------------------------------------+
|              Selfbase Studio (Modified)             |
|    - Full Supabase Cloud UI experience              |
|    - Organization/Project management                |
|    - Auto-generated environment variables           |
|    - Built-in CLI (show-env, show-login-info)       |
+-----------------------------------------------------+
|   Kong   |   Auth    |   REST   |   Realtime       |
|          | (GoTrue)  |(PostgREST)|  (Elixir)       |
+-----------------------------------------------------+
|                   PostgreSQL                         |
|  selfbase.organizations | selfbase.projects          |
|  (Schema isolation: project_a, project_b, ...)      |
+-----------------------------------------------------+
```

---

## Auto-Generated Environment Variables

| Variable | Description |
|----------|-------------|
| `DASHBOARD_USERNAME` | Auto-generated: `selfbase-xxxxxxxx` |
| `DASHBOARD_PASSWORD` | 32-character random password |
| `POSTGRES_PASSWORD` | Database password |
| `JWT_SECRET` | JWT signing secret |
| `SUPABASE_ANON_KEY` | Anonymous API key |
| `SUPABASE_SERVICE_KEY` | Service role API key |

All values can be overridden by setting them before starting Docker.

---

## MCP Integration

Selfbase includes [Selfbase MCP](https://github.com/JuN-B-official/Selfbase-MCP) support for AI assistants.

The Connect page dynamically shows your actual credentials:

```json
{
  "mcpServers": {
    "selfbase-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@jun-b/selfbase-mcp@latest",
        "--selfbase-url",
        "YOUR_SELFBASE_URL",
        "--service-role-key",
        "YOUR_SERVICE_ROLE_KEY"
      ],
      "env": {}
    }
  }
}
```

**Supported Clients:**
- Cursor (`.cursor/mcp.json`)
- Claude Code (`.mcp.json`)
- VS Code (`.vscode/mcp.json`)
- Antigravity (`~/.gemini/antigravity/mcp_config.json`)

---

## Database Schema

```sql
-- Organizations
selfbase.organizations (id, name, slug, billing_email, ...)

-- Projects
selfbase.projects (id, name, schema_name, organization_id, status, ...)
```

---

## Key Differences from Supabase

| Feature | Supabase | Selfbase |
|---------|----------|----------|
| UI Mode | Self-hosted (limited) | Full Cloud UI |
| Organizations | Single default | Multiple |
| Projects | Single per instance | Multiple per instance |
| Credentials | Manual setup | Auto-generated |
| MCP Config | Manual | Dynamic (auto-filled) |

---

## License

This project is distributed under the [Apache 2.0 License](LICENSE).

> **Note**: This project is a fork of [Supabase](https://github.com/selfbase/selfbase).
