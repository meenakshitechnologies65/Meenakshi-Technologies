# ==============================================================================
# MEENAKSHI TECHNOLOGIES - DOCKERFILE
# Single unified production container: Node.js 22 LTS Alpine Express & CMS v2.0
# ==============================================================================

# STAGE 1: Dependencies Cache
FROM node:22-alpine AS dependencies

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache dumb-init
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# STAGE 2: Production Runtime
FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache dumb-init curl tzdata \
    && cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime \
    && echo "Asia/Kolkata" > /etc/timezone

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    SERVER_IP=129.121.169.189 \
    APP_URL=http://129.121.169.189

# Copy installed production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code directly from root
COPY package*.json ./
COPY server.js ./
COPY cms/ ./cms/
COPY data/ ./data/
COPY images/ ./images/
COPY public/ ./public/
COPY views/ ./views/

# Setup persistent directory permissions
RUN mkdir -p /app/data /app/public/catalogues /app/public/uploads \
    && chown -R node:node /app

# Switch to non-root user for security
USER node

# Expose internal application port
EXPOSE 3000

# Container Healthcheck
HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
