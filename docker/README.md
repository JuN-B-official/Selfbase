# Self-Hosted Selfbase with Docker

This is the official Docker Compose setup for self-hosted Selfbase. It provides a complete stack with all Selfbase services running locally or on your infrastructure.

## Getting Started

Follow the detailed setup guide in our documentation: [Self-Hosting with Docker](https://selfbase.com/docs/guides/self-hosting/docker)

The guide covers:

- Prerequisites (Git and Docker)
- Initial setup and configuration
- Securing your installation
- Accessing services
- Updating your instance

## What's Included

This Docker Compose configuration includes the following services:

- **[Studio](https://github.com/selfbase/selfbase/tree/master/apps/studio)** - A dashboard for managing your self-hosted Selfbase project
- **[Kong](https://github.com/Kong/kong)** - Kong API gateway
- **[GoTrue](https://github.com/selfbase/auth)** - JWT-based authentication API for user sign-ups, logins, and session management
- **[PostgREST](https://github.com/PostgREST/postgrest)** - Web server that turns your PostgreSQL database directly into a RESTful API
- **[Realtime](https://github.com/selfbase/realtime)** - Elixir server that listens to PostgreSQL database changes and broadcasts them over websockets
- **[Storage](https://github.com/selfbase/storage)** - RESTful API for managing files in S3, with Postgres handling permissions
- **[ImgProxy](https://github.com/imgproxy/imgproxy)** - Fast and secure image processing server
- **[postgres-meta](https://github.com/selfbase/postgres-meta)** - RESTful API for managing Postgres (fetch tables, add roles, run queries)
- **[PostgreSQL](https://github.com/selfbase/postgres)** - Object-relational database with over 30 years of active development
- **[Edge Runtime](https://github.com/selfbase/edge-runtime)** - Web server based on Deno runtime for running JavaScript, TypeScript, and WASM services
- **[Logflare](https://github.com/Logflare/logflare)** - Log management and event analytics platform
- **[Vector](https://github.com/vectordotdev/vector)** - High-performance observability data pipeline for logs
- **[Supavisor](https://github.com/selfbase/supavisor)** - Selfbase's Postgres connection pooler
