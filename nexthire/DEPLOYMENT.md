# Deployment Guide: Azure, Nginx, & PM2

This document provides a step-by-step guide on how the **CareerBoost AI Dashboard** is hosted on an **Azure Virtual Machine** and how it maintains 24/7 uptime.

---

## 🏗️ Cloud Infrastructure Overview

The application is hosted on an **Ubuntu 24.04 LTS VM** with the following components:

1.  **Nginx**: Acts as a reverse proxy, serving the static React frontend and proxying API requests to Gunicorn.
2.  **Gunicorn**: A WSGI HTTP Server that runs the Django backend.
3.  **PM2**: A process manager that ensures the Gunicorn server is always running.
4.  **Certbot**: Manages SSL/TLS certificates and automatic HTTPS redirection.

---

## 🌉 Nginx Configuration

The configuration file is located at `/etc/nginx/sites-available/nexthire`. 

Key configuration components:
- **Port 80**: Redirects to Port 443 (HTTPS).
- **Port 443**: Serves the frontend located in `/home/azureuser/Next_Hire/nexthire/frontend/dist`.
- **Location `/api/`**: Proxies requests to `http://127.0.0.1:8000`.
- **Location `/static/`**: Serves gathered static assets for the Django admin.

To test the configuration:
```bash
sudo nginx -t
```
To restart Nginx:
```bash
sudo systemctl restart nginx
```

---

## ⚙️ Process Management (PM2)

We use **PM2** to keep the backend alive. The process is named `backend`.

Useful PM2 commands:
- **Check status**: `pm2 list`
- **View logs**: `pm2 logs backend`
- **Restart**: `pm2 restart backend`
- **Enable auto-start on reboot**: `pm2 save`

---

## 🔄 CI/CD Pipeline (GitHub Actions)

The repository includes a workflow in `.github/workflows/deploy.yml`. 

1.  **Trigger**: Every push to the `main` branch.
2.  **Secrets**: Requires `AZURE_HOST`, `AZURE_USER`, and `AZURE_SSH_KEY` to be set in GitHub Repository Secrets.
3.  **Action**: 
    - Connects to the VM via SSH.
    - Pulls newest code from GitHub.
    - Installs dependencies (`npm install`, `pip install`).
    - Rebuilds the frontend (`npm run build`).
    - Runs database migrations (`python manage.py migrate`).
    - Collects Django static files (`python manage.py collectstatic`).
    - Restarts the backend via PM2.

---

## 🛠️ Troubleshooting

### 1. View Backend Errors
If the API is failing, check the PM2 logs:
```bash
pm2 logs backend --lines 100
```

### 2. View Nginx Errors
For issues with the frontend or routing:
```bash
sudo tail -f /var/log/nginx/error.log
```

---

## 📬 Contact
**Diksha Malusare**  
GitHub: [@dikshaa120903](https://github.com/dikshaa120903)  
Email: [dikshaamalusare@gmail.com](mailto:dikshaamalusare@gmail.com)
