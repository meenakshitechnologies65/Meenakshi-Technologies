# ==============================================================================
# MEENAKSHI TECHNOLOGIES - BACKEND SERVICE DOCKERFILE
# Node.js 22 Alpine (LTS) - Native SQLite & High-Performance Express Runtime
# ==============================================================================

FROM node:22-alpine AS dependencies

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache dumb-init
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache dumb-init curl tzdata \
    && cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime \
    && echo "Asia/Kolkata" > /etc/timezone

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY server.js ./
COPY cms/ ./cms/
COPY data/ ./data/
COPY images/ ./images/
COPY public/ ./public/
COPY views/ ./views/

RUN mkdir -p /app/data /app/public/catalogues /app/public/uploads \
    && chown -R node:node /app

USER node

EXPOSE 3000

HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
