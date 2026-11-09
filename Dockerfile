# ==============================================================================
# MEENAKSHI TECHNOLOGIES - PRODUCTION BACKEND & APPLICATION DOCKERFILE
# Node.js 22 Alpine (LTS) - Native SQLite & High-Performance Express Runtime
# ==============================================================================

# STAGE 1: Dependency Installation
FROM node:22-alpine AS dependencies

WORKDIR /app

# Install security patches & build tooling if required
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Copy package descriptors
COPY package*.json ./

# Install production dependencies only with clean npm ci
RUN npm ci --omit=dev && npm cache clean --force

# STAGE 2: Production Runtime
FROM node:22-alpine AS runner

WORKDIR /app

# Install runtime utilities (curl/wget for container health checks)
RUN apk add --no-cache dumb-init curl tzdata \
    && cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime \
    && echo "Asia/Kolkata" > /etc/timezone

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Copy node_modules from dependency stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code
COPY package*.json ./
COPY server.js ./
COPY cms/ ./cms/
COPY data/ ./data/
COPY images/ ./images/
COPY public/ ./public/
COPY views/ ./views/

# Ensure persistent directories exist and have proper permissions
RUN mkdir -p /app/data /app/public/catalogues /app/public/uploads \
    && chown -R node:node /app

# Switch to non-root security user
USER node

# Expose backend application port
EXPOSE 3000

# Container Healthcheck
HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Launch application via dumb-init for proper process and signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
