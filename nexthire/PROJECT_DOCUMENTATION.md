# CareerBoost AI Platform - Detailed Architecture Documentation

This document provides a deep dive into the system's design, from its AI-driven logic to its cloud-deployed infrastructure.

---

## 1. Core Platform Architecture

### Frontend (React & TypeScript)
- **Framework**: React 18 with Vite.
- **Pages**: 
  - `UploadResume.tsx`: Handles file ingestion and state management.
  - `Dashboard.tsx`: Displays role-based scoring and high-level metrics.
  - `AISuggestions.tsx`: Fetches AI feedback from the Groq/OpenAI endpoints.
  - `JobRecommendations.tsx`: Provides FAISS-powered matching roles.
- **API Client**: `lib/api.ts` implements a flexible base URL strategy to support both local development and production environments.

### Backend (Django REST Framework)
- **Modular Apps**:
  - `users/`: Secure JWT authentication and session management.
  - `resume/`: Text extraction (PDF/DOCX) and storage.
  - `scoring/`: Custom **Role-Based Scoring Engine** that evaluates resumes against 11+ industry domains.
  - `ai/`: Integration with **Groq (Llama 3.3 70B)** to generate refinement tips.
- **Database**:
  - **Live**: Supabase PostgreSQL (Managed in the cloud).
  - **Local**: SQLite (Used as a development-time fallback).

---

## 2. Cloud Infrastructure & CI/CD

### Azure Virtual Machine
The application resides on an **Azure Ubuntu VM (VMBiz)**.
- **Reverse Proxy**: **Nginx** handles incoming traffic on Port 80, serves the frontend static build, and redirects requests to the backend.
- **Process Management**: **PM2** ensures the Django Gunicorn server restarts automatically after reboots or crashes.
- **Security**: **Certbot** provides automated SSL/TLS management for HTTPS encryption.

### Deployment Workflow
The project implements a full **GitOps** pipeline:
1.  **Code Check-in**: A developer pushes to `main`.
2.  **GitHub Action**: A workflow triggers via SSH connection to the Azure VM.
3.  **Deployment Script**: The `deploy.sh` script on the server executes a fresh build cycle (Git pull, pip install, migrate, collectstatic, build).
4.  **Instant Update**: The server reloads with the latest changes in real-time.

---

## 3. Machine Learning & AI Logic

### Role-Based Scoring
The platform contains a dedicated `feature_extractor.py` that identifies a resume's primary domain (e.g., Software Engineering vs. Sales). 
- It calculates a score out of 100 based on the candidate’s alignment with specific industry benchmarks for that domain.

### Vector Search (FAISS)
- The app uses **FAISS** (Facebook AI Similarity Search) to perform dense vector comparisons between resumes and job descriptions.
- This produces highly accurate and "semantically aware" job recommendations.

### AI Suggestions
- Powered by **Llama 3.3 70B** via the **Groq API**.
- Provides professional feedback on formatting, impactful phrasing, and skill-gap analysis.

---

## 📬 Contact & Support
**Diksha Malusare**  
GitHub: [@dikshaa120903](https://github.com/dikshaa120903)  
Email: [dikshaamalusare@gmail.com](mailto:dikshaamalusare@gmail.com)
