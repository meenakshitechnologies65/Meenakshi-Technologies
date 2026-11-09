# Docker Deployment Guide – Meenakshi Technologies 2026 Platform

This project uses a unified **Single Dockerfile** architecture for the application, combined with a dedicated **PostgreSQL 16 database service** and **Redis cache** in `docker-compose.yml`.

---

## 1. System Architecture

```
                  +---------------------------+
                  |  Client Browser / User    |
                  +-------------+-------------+
                                |  HTTP Port 80 or 3000
                                v
               +---------------------------------+
               |        app (Node.js 22)         |
               |  - Express Server & EJS SSR     |
               |  - CMS v2.0 REST & Lead APIs    |
               |  - PDF Catalogue Generator      |
               |  - Embedded SQLite WAL Sync     |
               +-------+-----------------+-------+
                       |                 |
        SQL (5432)     v                 v   TCP (6379)
+---------------------------+   +---------------------------+
|       db (Postgres 16)    |   |      redis (Redis 7)      |
|  - Enterprise Relational  |   |  - Session Store          |
|  - Auto-bootstrapped DDL  |   |  - Response Rate Limiter  |
|  - Persistent Volumes     |   |  - Micro-Caching Layer    |
+---------------------------+   +---------------------------+
```

---

## 2. File Structure

| File | Purpose |
|---|---|
| [`Dockerfile`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/Dockerfile) | **Single unified Dockerfile**: Multi-stage Node.js 22 LTS Alpine build containerizing the full application. |
| [`docker-compose.yml`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/docker-compose.yml) | Orchestrates the application container (`app`), PostgreSQL database (`db`), and Redis cache (`redis`). |
| [`db/init.sql`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/db/init.sql) | Auto-executed SQL bootstrap script creating all relational tables and seeding the Super Admin. |
| [`.env.example`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/.env.example) | Environment variable template for database credentials, ports, and secrets. |
| [`.dockerignore`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/.dockerignore) | Excludes `node_modules`, test scripts, and local temporary files from the build context. |

---

## 3. Quick Start Instructions

### Step 1: Copy Environment Template
```bash
cp .env.example .env
```

### Step 2: Build & Start All Containers
```bash
docker compose up -d --build
```

### Step 3: Check Running Containers
```bash
docker compose ps
```

### Step 4: Access Application
- **Main Website**: [http://localhost/](http://localhost/) (Port 80) or [http://localhost:3000/](http://localhost:3000/) (Port 3000)
- **CMS Admin Portal**: [http://localhost/admin](http://localhost/admin)
  - **Email**: `admin@meenakshi.com`
  - **Password**: `Meenakshi@2026`
- **PostgreSQL Database**: Port `5432` (`meenakshi_cms`)
- **Redis Cache**: Port `6379`

---

## 4. Useful Docker Commands

### Live Logs
```bash
docker compose logs -f app
```

### Stop Services (Preserving Database & Volumes)
```bash
docker compose down
```

### PostgreSQL Database Shell
```bash
docker compose exec db psql -U meenakshi_user -d meenakshi_cms
```
