# CareerBoost AI Dashboard

A full-stack AI-powered resume analysis and job recommendation platform.

## Project Structure

```
careerboost-ai-dashboard/
├── frontend/                 # React + TypeScript frontend application
│   ├── src/                 # React components and pages
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (Dashboard, Jobs, Suggestions, etc.)
│   │   ├── lib/             # API utilities and helpers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tsconfig.json        # TypeScript configuration
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   └── index.html           # HTML entry point
│
├── backend/                 # Django REST API backend
│   ├── apps/                # Django applications
│   │   ├── ai/              # AI/ML features (improve resume, chat)
│   │   ├── recommendation/  # Job recommendations
│   │   ├── scoring/         # Resume scoring
│   │   └── resume/          # Resume upload & processing
│   ├── config/              # Django settings
│   ├── utils/               # ML utilities (model loader, feature extraction)
│   ├── manage.py            # Django management
│   ├── requirements.txt     # Python dependencies
│   └── db.sqlite3           # SQLite database
│
├── README.md                # This file
└── .gitignore              # Git ignore rules
```

## Getting Started

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs on: `http://localhost:8000`

API endpoints:
- `POST /api/upload-resume/` - Upload resume file
- `POST /api/score-resume/` - Get resume score
- `POST /api/recommend-jobs/` - Get job recommendations
- `POST /api/improve-resume/` - Get AI suggestions

### Frontend Setup

```bash
cd frontend
npm install
# or
bun install

# Development
npm run dev
# or
bun run dev

# Build for production
npm run build
# or
bun run build
```

Frontend runs on: `http://localhost:5173`

## Features

✨ **AI Resume Analysis** - Get your resume scored and analyzed
🎯 **Job Recommendations** - Discover AI-matched job opportunities
💡 **Resume Suggestions** - AI-powered resume improvement tips
📊 **Analytics Dashboard** - View your resume metrics and scores

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Query (state management)

**Backend:**
- Django + Django REST Framework
- scikit-learn (job matching)
- OpenAI API (resume improvements)
- SQLite (database)
- Python 3.8+
