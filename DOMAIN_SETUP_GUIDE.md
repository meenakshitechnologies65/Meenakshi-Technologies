# Step-by-Step Guide: Linking Your Domain to Server IP `129.121.169.189`

This guide explains how to connect your domain (e.g., `meenakshitechnologies.org` and `www.meenakshitechnologies.org`) to your Dockerized server running at **`129.121.169.189`**.

---

## Step 1: Add DNS Records at Your Domain Registrar

Log in to wherever you purchased your domain (such as **GoDaddy**, **Namecheap**, **Hostinger**, **Cloudflare**, or **Google Domains**), navigate to the **DNS Management / DNS Records** section, and add the following two **A Records**:

| Type | Name / Host | Points to / Value | TTL | Purpose |
|---|---|---|---|---|
| **A** | `@` *(or leave blank)* | `129.121.169.189` | `Automatic` *(or `300`)* | Routes `meenakshitechnologies.org` to your server |
| **A** | `www` | `129.121.169.189` | `Automatic` *(or `300`)* | Routes `www.meenakshitechnologies.org` to your server |

*(Alternatively, you can create a `CNAME` record for `www` with value `meenakshitechnologies.org`)*.

> [!NOTE]
> DNS propagation typically takes between **5 to 30 minutes** (rarely up to a few hours depending on the registrar).

---

## Step 2: Verify DNS Propagation

On your computer terminal (Command Prompt, PowerShell, or macOS/Linux Terminal), run:

```bash
# Check apex domain
nslookup meenakshitechnologies.org

# Check www subdomain
nslookup www.meenakshitechnologies.org
```

**Expected output:**
```
Address: 129.121.169.189
```
Once `nslookup` or `ping` returns `129.121.169.189`, your domain is pointed to your server.

---

## Step 3: Update `.env` on Your Server

On your server (`129.121.169.189`), open your `.env` file:

```bash
nano .env
```

Update the domain configuration lines:

```ini
SERVER_IP=129.121.169.189
APP_URL=https://www.meenakshitechnologies.org
BASE_URL=https://www.meenakshitechnologies.org
WEBSITE_URL=https://www.meenakshitechnologies.org
```

Save and exit (`Ctrl + O`, then `Enter`, then `Ctrl + X`).

---

## Step 4: Set Up Free SSL / HTTPS (Let's Encrypt / Cloudflare)

For security, Google rankings, and user trust, your domain should load over `https://`. Choose the easiest method below:

### Method A: Cloudflare (Easiest & Recommended — 1 Click Free SSL + CDN)
1. Add your domain to a free [Cloudflare](https://dash.cloudflare.com/) account.
2. In Cloudflare DNS, add:
   - `A` record `@` pointing to `129.121.169.189` with **Proxy status: Proxied (Orange cloud)**.
   - `CNAME` record `www` pointing to `meenakshitechnologies.org` with **Proxy status: Proxied**.
3. In **SSL/TLS** settings on Cloudflare, set the encryption mode to **Flexible** or **Full**.
4. Enable **Always Use HTTPS** in Cloudflare.
5. *Done! Instant free SSL certificate with global DDoS protection and CDN caching.*

---

### Method B: Certbot / Let's Encrypt via Nginx on Host Server
If you want SSL terminated directly on your Linux host:
```bash
# 1. Install certbot and nginx
sudo apt update
sudo apt install -y certbot python3-certbot-nginx nginx

# 2. Configure Nginx reverse proxy to forward traffic to Docker (port 3000)
sudo nano /etc/nginx/sites-available/meenakshi
```

Paste the following:
```nginx
server {
    server_name meenakshitechnologies.org www.meenakshitechnologies.org;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and acquire free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/meenakshi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Generate SSL certificate (Certbot will auto-configure HTTPS & auto-renew)
sudo certbot --nginx -d meenakshitechnologies.org -d www.meenakshitechnologies.org
```

---

## Step 5: Restart Docker Containers

Once the DNS or SSL is updated, restart the Docker application container on your server:

```bash
docker compose restart app
```

---

## Step 6: Test Your Live Domain

Open in your browser:
- `https://www.meenakshitechnologies.org/`
- `https://www.meenakshitechnologies.org/products`
- `https://www.meenakshitechnologies.org/admin`

