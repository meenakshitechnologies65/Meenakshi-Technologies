# ==============================================================================
# MEENAKSHI TECHNOLOGIES - FRONTEND WEB SERVER & REVERSE PROXY DOCKERFILE
# Nginx 1.27 Alpine - Edge Caching, Brotli/Gzip, HTTP/2 & Security Proxy
# ==============================================================================

FROM nginx:1.27-alpine

# Install curl for container health checking
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom reverse proxy & caching configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy static website assets into Nginx webroot for ultra-fast direct serving
COPY public/ /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Healthcheck checking the nginx /healthz endpoint
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
