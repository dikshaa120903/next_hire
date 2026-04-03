from functools import lru_cache
import logging

logger = logging.getLogger(__name__)


SKILL_CATEGORIES = {
    "technical": [
        "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go", "rust", "php",
        "django", "flask", "fastapi", "react", "node.js", "angular", "vue.js", "sql", "postgresql",
        "mongodb", "aws", "docker", "kubernetes", "tensorflow", "pytorch", "scikit-learn", "nlp",
        "machine learning", "deep learning", "computer vision", "data analysis", "data visualization",
        "matplotlib", "seaborn", "pandas", "numpy", "r programming", "data science", "statistics",
        "r", "keras", "opencv", "spark", "hadoop", "kafka", "gradio"
    ],
    "tools": [
        "git", "github", "jira", "postman", "figma", "tableau", "power bi", "linux", "excel", "notion",
        "microsoft office", "office 365", "trello", "slack", "vscode", "mongodb compass"
    ],
    "soft": [
        "communication", "leadership", "teamwork", "problem solving", "adaptability", "critical thinking",
        "time management", "collaboration", "creativity", "public speaking", "project management",
        "agile", "scrum", "negotiation", "presentation skills"
    ],
}


@lru_cache(maxsize=1)
def _build_matcher():
    try:
        import spacy
        from spacy.matcher import PhraseMatcher
    except ImportError as exc:
        raise ImportError("spaCy is required. Install with: pip install spacy") from exc
    
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError as e:
        logger.warning(
            f"spaCy model 'en_core_web_sm' not found. Using blank model. "
            f"Download it with: python -m spacy download en_core_web_sm. Error: {e}"
        )
        nlp = spacy.blank("en")
    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    phrases = []
    for skills in SKILL_CATEGORIES.values():
        phrases.extend(skills)
    matcher.add("SKILLS", [nlp.make_doc(skill) for skill in phrases])
    canonical_map = {skill.lower(): skill for skill in phrases}
    category_map = {}
    for category, skills in SKILL_CATEGORIES.items():
        for skill in skills:
            category_map[skill.lower()] = category
    return nlp, matcher, canonical_map, category_map


def extract_skills(text: str) -> dict:
    if not text:
        logger.warning("extract_skills called with empty text")
        return {"technical": [], "tools": [], "soft": [], "all": []}
    
    nlp, matcher, canonical_map, category_map = _build_matcher()
    doc = nlp(text)
    matches = matcher(doc)
    
    logger.info(f"extract_skills: found {len(matches)} matches in {len(text)} chars")
    
    categorized = {"technical": set(), "tools": set(), "soft": set()}
    for _, start, end in matches:
        raw_skill = doc[start:end].text.strip().lower()
        canonical = canonical_map.get(raw_skill, raw_skill)
        category = category_map.get(canonical.lower())
        if category:
            categorized[category].add(canonical)
    technical = sorted(categorized["technical"])
    tools = sorted(categorized["tools"])
    soft = sorted(categorized["soft"])
    return {
        "technical": technical,
        "tools": tools,
        "soft": soft,
        "all": sorted(set(technical + tools + soft)),
    }
