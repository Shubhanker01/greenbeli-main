# GreenBeli Deployment & Docker Setup Guide

This guide details how to build, run, and deploy the entire GreenBeli Nursery stack on server **`93.127.166.30`** using Docker Compose.

---

## Architecture Overview

| Service | Container Name | Internal Port | Exposed Host Port | Subdomain |
|---|---|---|---|---|
| **MongoDB** | `greenbeli_mongo` | `27017` | `27017` | Local DB |
| **Backend API** | `greenbeli_backend` | `5008` | `5008` | `api.greenbeli.in` |
| **Frontend Web** | `greenbeli_frontend` | `80` | `3000` | `greenbeli.in` / `www.greenbeli.in` |
| **Admin Panel** | `greenbeli_admin` | `80` | `3001` | `admin.greenbeli.in` |

---

## 1. Local / Server Launch Commands

To start all services in detached mode on your server:

```bash
docker-compose up -d --build
```

To view logs:
```bash
docker-compose logs -f
```

To stop all services:
```bash
docker-compose down
```

---

## 2. Server Nginx Reverse Proxy Configuration (`/etc/nginx/sites-available/greenbeli.conf`)

On your server (`93.127.166.30`), place this Nginx configuration to route traffic to the Docker containers:

```nginx
# 1. Main Frontend Website (greenbeli.in & www.greenbeli.in)
server {
    server_name greenbeli.in www.greenbeli.in;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 2. Admin Panel (admin.greenbeli.in)
server {
    server_name admin.greenbeli.in;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 3. Express API Server (api.greenbeli.in)
server {
    server_name api.greenbeli.in;

    location / {
        proxy_pass http://127.0.0.1:5008;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 3. Enable SSL Certificate (Certbot / Let's Encrypt)

Run Certbot on your server to issue free HTTPS certificates for all subdomains:

```bash
sudo certbot --nginx -d greenbeli.in -d www.greenbeli.in -d admin.greenbeli.in -d api.greenbeli.in
```
