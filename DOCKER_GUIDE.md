# Docker Deployment Guide – Meenakshi Technologies 2026 Platform

This guide outlines the production-ready containerized architecture for **Meenakshi Technologies** (`https://www.meenakshitechnologies.org/`).

---

## 1. System Architecture

The containerized stack is composed of 4 coordinated microservices:

```
                  +---------------------------+
                  |  Client Browser / User    |
                  +-------------+-------------+
                                |  HTTP (80) / HTTPS (443)
                                v
               +---------------------------------+
               |      frontend (Nginx 1.27)      |
               |  - Gzip & Brotli Compression    |
               |  - Static Asset Edge Caching    |
               |  - Reverse Proxy & SSL Term.    |
               +----------------+----------------+
                                |  Proxy HTTP (backend:3000)
                                v
               +---------------------------------+
               |       backend (Node.js 22)      |
               |  - Express SSR (EJS Views)      |
               |  - CMS v2.0 REST APIs           |
               |  - PDF Catalogue Generator      |
               |  - Embedded SQLite WAL Sync     |
               +-------+-----------------+-------+
                       |                 |
        SQL (5432)     v                 v   TCP (6379)
+---------------------------+   +---------------------------+
|      db (PostgreSQL 16)   |   |      redis (Redis 7)      |
|  - Enterprise Relational  |   |  - Session Store          |
|  - Auto-bootstrapped DDL  |   |  - Response Rate Limiter  |
|  - Persistent Volumes     |   |  - Micro-Caching Layer    |
+---------------------------+   +---------------------------+
```

---

## 2. File Structure

| File | Purpose |
|---|---|
| [`Dockerfile`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/Dockerfile) | Multi-stage Node.js 22 Alpine backend container build |
| [`backend/Dockerfile`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/backend/Dockerfile) | Dedicated backend Dockerfile for decoupled CI/CD |
| [`frontend/Dockerfile`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/frontend/Dockerfile) | Nginx 1.27 Alpine web server & reverse proxy container |
| [`frontend/nginx.conf`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/frontend/nginx.conf) | Nginx configuration (gzip, static caching, 50MB upload, proxy headers) |
| [`db/init.sql`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/db/init.sql) | PostgreSQL schema initialization script with initial super admin seeding |
| [`docker-compose.yml`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/docker-compose.yml) | Multi-container composition connecting frontend, backend, db, and redis |
| [`.env.example`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/.env.example) | Environment variables template |
| [`.dockerignore`](file:///c:/Users/pc/Desktop/Meenakshi%20Technologies%202026%20New%20Website/.dockerignore) | Excludes node_modules, logs, and temporary files from build contexts |

---

## 3. Quick Start Instructions

### Step 1: Copy Environment Variables
```bash
cp .env.example .env
```
*(Optionally modify `.env` to update database passwords or JWT secret).*

### Step 2: Build & Start All Services
```bash
docker compose up -d --build
```

### Step 3: Verify Running Services
```bash
docker compose ps
```
All containers (`meenakshi_frontend`, `meenakshi_backend`, `meenakshi_db`, `meenakshi_redis`) will report `healthy` status.

### Step 4: Access the Application
- **Main Website**: [http://localhost/](http://localhost/) (via Nginx on Port 80)
- **Direct Backend**: [http://localhost:3000/](http://localhost:3000/) (Port 3000)
- **CMS Admin Portal**: [http://localhost/admin](http://localhost/admin)
  - **Email**: `admin@meenakshi.com`
  - **Password**: `Meenakshi@2026`
- **PostgreSQL Database**: Port `5432` (`meenakshi_cms`)
- **Redis Cache**: Port `6379`

---

## 4. Useful Docker Commands

### View Live Logs
```bash
# View logs from all services
docker compose logs -f

# View only backend application logs
docker compose logs -f backend

# View only Nginx web server access & error logs
docker compose logs -f frontend
```

### Restart Services
```bash
docker compose restart
```

### Stop Services
```bash
# Stop containers without losing database data
docker compose down

# Stop containers and remove persistent volumes (WARNING: Deletes database!)
docker compose down -v
```

### Execute Database Shell
```bash
docker compose exec db psql -U meenakshi_user -d meenakshi_cms
```

---

## 5. Persistent Storage & Backups

The following Docker named volumes safeguard all application data:

1. `meenakshi_postgres_data`: Stores PostgreSQL database files.
2. `meenakshi_cms_data`: Stores local SQLite database (`cms_v2.sqlite`) and JSON leads.
3. `meenakshi_catalogues_data`: Stores all dynamically generated PDF catalogues.
4. `meenakshi_uploads_data`: Stores CMS media library image uploads.
5. `meenakshi_redis_data`: Stores Redis cache snapshots.

### Creating a Database Backup
```bash
docker compose exec db pg_dump -U meenakshi_user meenakshi_cms > backup_$(date +%Y%m%d).sql
```
