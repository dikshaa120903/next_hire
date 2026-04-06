# CareerBoost AI Platform

A full-stack AI-powered resume analysis and scoring platform, now upgraded for professional production deployment on **Azure** using **Supabase** and **Groq (Llama 3.3)**.

---

## 🏛️ Project Directory Structure

```text
nexthire/
├── frontend/             # React 18 + TypeScript Frontend
│   ├── src/             # Source code (pages, components, lib)
│   ├── public/          # Static assets
│   ├── dist/            # Production build folder (on VM)
│   └── vite.config.ts   # Build configuration
│
├── backend/             # Django REST Framework Backend
│   ├── apps/           # Django apps (ai, resume, scoring, users)
│   ├── config/         # System settings (settings.py)
│   ├── utils/          # ML & AI utilities (Groq, FAISS, scikit-learn)
│   ├── staticfiles/     # Collected static assets
│   ├── manage.py       # Django management script
│   └── .env            # Environment secrets (Supabase, Groq)
│
├── deploy.sh           # Automated server-side deployment script
├── requirements.txt     # Python backend dependencies
└── README.md            # This documentation file
```

---

## 🚀 Setting Up the Development Environment

### 1. Backend Setup (Django)

1.  **Environment**: Create a Python virtual environment.
    ```bash
    python -m venv venv
    source venv/bin/activate # Windows: venv\Scripts\activate
    ```
2.  **Dependencies**: Install the required Python packages.
    ```bash
    pip install -r requirements.txt
    ```
3.  **Secrets**: Configure your `backend/.env` file with your **Supabase `DATABASE_URL`** and **Groq `OPENAI_API_KEY`**.
4.  **Database**: Migrate and create your database tables.
    ```bash
    python manage.py migrate
    ```
5.  **Run**: Start the development server.
    ```bash
    python manage.py runserver
    ```

### 2. Frontend Setup (React)

1.  **Dependencies**: Install npm packages.
    ```bash
    cd frontend
    npm install
    ```
2.  **Run**: Start the Vite development server.
    ```bash
    npm run dev
    ```

---

## 🛠️ Production & CI/CD Pipeline

The application is fully automated for production on an **Azure Virtual Machine**.

- **CI/CD**: Every push to the `main` branch triggers a **GitHub Action** that logs into the Azure VM via SSH and executes the `deploy.sh` script.
- **Auto-Update**: The script handles `git pull`, `npm build`, `django collectstatic`, `django migrate`, and restarts the **PM2** process for the backend.
- **Traffic Routing**: **Nginx** acts as a reverse proxy, serving the React frontend on Port 80 and routing `/api/` traffic to the Django Gunicorn server.

---

## 🔐 Credentials & Security

The platform is secured with:
- **SSL/HTTPS**: Automatically managed by **Certbot (Let's Encrypt)**.
- **Session Pooler**: High-performance database connections through **Supavisor (Supabase)**.
- **Environment Separation**: Distinct settings for local development vs production environments.

---

## 📬 Contact
**Diksha Malusare**  
Email: [dikshaamalusare@gmail.com](mailto:dikshaamalusare@gmail.com)
