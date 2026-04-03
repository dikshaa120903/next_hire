import re
from pathlib import Path

from rest_framework.exceptions import ValidationError

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE = 5 * 1024 * 1024

# Role-specific keyword definitions for fair scoring across career paths
ROLE_KEYWORDS = {
    "software_engineer": [
        "python", "java", "javascript", "typescript", "c++", "react", "django",
        "node.js", "api", "rest", "graphql", "microservices", "architecture",
        "git", "github", "docker", "kubernetes", "ci/cd", "agile", "scrum",
        "html", "css", "sql", "nosql", "mongodb", "postgresql", "aws", "gcp", "azure"
    ],
    "data_scientist": [
        "python", "machine learning", "deep learning", "tensorflow", "pytorch",
        "scikit-learn", "pandas", "numpy", "sql", "data analysis", "statistics",
        "nlp", "computer vision", "data mining", "predictive modeling", "r programming"
    ],
    "data_engineer": [
        "sql", "python", "spark", "hadoop", "etl", "data pipeline", "kafka",
        "aws", "gcp", "azure", "airflow", "docker", "java", "scala", "data warehouse"
    ],
    "product_manager": [
        "product management", "roadmap", "user research", "stakeholder management",
        "agile", "ux design", "market analysis", "kpi", "analytics", "metrics",
        "strategic planning", "cross-functional", "leadership", "communication"
    ],
    "project_manager": [
        "project management", "pmp", "agile", "scrum", "kanban", "jira", "scheduling",
        "budget management", "risk management", "stakeholder", "team leadership",
        "timeline", "deliverables", "communication", "planning"
    ],
    "management": [
        "leadership", "team management", "strategic planning", "budget", "business development",
        "stakeholder management", "mentoring", "performance management", "organizational",
        "executive", "director", "manager", "communication", "negotiation"
    ],
    "sales": [
        "sales", "crm", "pipeline management", "revenue", "negotiation", "client relationships",
        "business development", "territory", "forecasting", "quota", "customer acquisition",
        "sales strategy", "deal closure", "relationship building"
    ],
    "marketing": [
        "marketing", "digital marketing", "seo", "content marketing", "social media", "advertising",
        "campaign", "brand", "analytics", "market research", "customer acquisition", "growth",
        "email marketing", "marketing automation", "crm"
    ],
    "finance": [
        "accounting", "financial analysis", "excel", "sql", "python", "finance", "audit",
        "budgeting", "forecasting", "financial modeling", "reporting", "statements",
        "tax", "compliance", "risk management", "valuation"
    ],
    "hr": [
        "human resources", "recruitment", "talent management", "employee engagement", "payroll",
        "benefits", "training", "performance management", "organization development",
        "compliance", "labor relations", "hris", "compensation"
    ],
    "design": [
        "ui design", "ux design", "figma", "adobe", "prototyping", "user research",
        "wireframing", "animation", "design systems", "graphic design", "web design",
        "interaction design", "accessibility", "design thinking"
    ]
}

# Keep old TARGET_KEYWORDS for backward compatibility
TARGET_KEYWORDS = ROLE_KEYWORDS["software_engineer"]


def detect_career_role(text: str) -> str:
    """
    Auto-detect the career role from resume content.
    Returns the detected role or 'software_engineer' as default.
    """
    normalized = (text or "").lower()
    
    # Count keyword matches for each role
    role_scores = {}
    for role, keywords in ROLE_KEYWORDS.items():
        matches = sum(1 for keyword in keywords if keyword in normalized)
        role_scores[role] = matches
    
    # Return role with highest keyword match count
    if max(role_scores.values()) > 0:
        return max(role_scores, key=role_scores.get)
    return "software_engineer"  # default role


def get_keywords_for_role(role: str) -> list[str]:
    """Get keywords for a specific career role."""
    return ROLE_KEYWORDS.get(role, TARGET_KEYWORDS)


def validate_resume_file(uploaded_file) -> None:
    extension = Path(uploaded_file.name).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise ValidationError({"file": "Only PDF and DOCX files are allowed."})
    if uploaded_file.size > MAX_FILE_SIZE:
        raise ValidationError({"file": "File size must be less than 5 MB."})


def extract_text_from_file(file_path: str) -> str:
    extension = Path(file_path).suffix.lower()
    if extension == ".pdf":
        return _extract_pdf_text(file_path)
    if extension == ".docx":
        return _extract_docx_text(file_path)
    raise ValidationError({"file": "Unsupported file format."})


def _extract_pdf_text(file_path: str) -> str:
    try:
        import fitz
    except ImportError as exc:
        raise ImportError("PyMuPDF is required. Install with: pip install pymupdf") from exc
    text_chunks = []
    with fitz.open(file_path) as pdf_doc:
        for page in pdf_doc:
            text_chunks.append(page.get_text("text"))
    return "\n".join(text_chunks).strip()


def _extract_docx_text(file_path: str) -> str:
    try:
        from docx import Document
    except ImportError as exc:
        raise ImportError("python-docx is required. Install with: pip install python-docx") from exc
    document = Document(file_path)
    return "\n".join([paragraph.text for paragraph in document.paragraphs if paragraph.text]).strip()


def extract_resume_features(text: str, skills: list[str] | None = None, role: str | None = None, job_description: str | None = None) -> dict:
    raw_text = (text or "").strip()
    normalized = raw_text.lower()
    
    # Auto-detect role if not provided
    detected_role = role or detect_career_role(text)
    if job_description:
        # Extract relevant keywords from the job description by matching against our predefined lists
        jd_text_normalized = job_description.lower()
        all_known_keywords = set(kw for kws in ROLE_KEYWORDS.values() for kw in kws)
        role_keywords = [kw for kw in all_known_keywords if kw in jd_text_normalized]
        # If no known keywords are found in the JD, fall back to role-detection
        if not role_keywords:
            role_keywords = get_keywords_for_role(detected_role)
    else:
        role_keywords = get_keywords_for_role(detected_role)
    
    skills_count = len(skills or [])
    projects_count = len(re.findall(r"\b(project|projects|portfolio)\b", normalized))
    years_matches = re.findall(r"(\d+)\+?\s*(?:years|yrs)\b", normalized)
    experience_years = max([int(match) for match in years_matches], default=0)
    
    # Use role-specific keywords for keyword matching
    matched_keywords_list = [keyword for keyword in role_keywords if keyword in normalized]
    missing_keywords = [keyword for keyword in role_keywords if keyword not in normalized]
    
    keyword_match_percent = round((len(matched_keywords_list) / len(role_keywords)) * 100, 2) if role_keywords else 0
    
    return {
        "skills_count": skills_count,
        "projects_count": projects_count,
        "experience_years": experience_years,
        "keyword_match_percent": keyword_match_percent,
        "detected_role": detected_role,
        "missing_keywords": missing_keywords,
        "matched_keywords_list": matched_keywords_list,
    }
