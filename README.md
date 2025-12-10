# Selfbase

> **Multi-Project Supabase Fork** - A self-hosting solution for managing multiple projects in a single instance

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## Project Goals

Remove the **single project limitation** of Supabase Self-Hosted to implement a true multi-tenant environment.

### Supabase Self-Hosted Limitations
- Single project only
- Organization disabled
- No project switching

### Selfbase Goals
- Unlimited project creation
- Project switching support
- Schema-based data isolation

---

## Architecture

```
Selfbase = Supabase Core + Multi-Project Layer

+-----------------------------------------------------+
|              Selfbase Studio (Modified)             |
|         - Project list/create/switch UI             |
+-----------------------------------------------------+
|   Kong   |   Auth    |   REST   |   Realtime       |
|          | (GoTrue)  |(PostgREST)|  (Elixir)       |
+-----------------------------------------------------+
|                   PostgreSQL                         |
|        (Schema isolation: project_a, project_b, ...)|
+-----------------------------------------------------+
```

---

## Key Components

| Component | Description |
|-----------|-------------|
| **Selfbase Studio** | Modified admin dashboard |
| **PostgreSQL** | Schema-based data isolation |
| **Kong** | API Gateway |
| **GoTrue** | Authentication/Authorization |
| **PostgREST** | REST API |
| **Realtime** | WebSocket real-time communication |

---

## Getting Started

### Run with Docker

```bash
cd docker
docker-compose up -d
```

### Development

```bash
pnpm install
pnpm dev
```

---

## License

This project is distributed under the [Apache 2.0 License](LICENSE).

> **Note**: This project is a fork of [Supabase](https://github.com/supabase/supabase).
