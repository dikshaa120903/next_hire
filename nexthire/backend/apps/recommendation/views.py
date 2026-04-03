from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.recommendation.serializers import JobRecommendationInputSerializer
from apps.resume.models import Resume

JOB_CATALOG = [
    {
        "title": "Backend Engineer",
        "company": "TechNova",
        "location": "Remote",
        "description": "Build REST APIs using Python, Django, SQL, Docker, and cloud deployment workflows.",
        "required_skills": ["Python", "Django", "SQL", "Docker", "REST"]
    },
    {
        "title": "Machine Learning Engineer",
        "company": "DataForge",
        "location": "Bangalore",
        "description": "Develop machine learning models with scikit-learn, NLP pipelines, and model deployment in production.",
        "required_skills": ["Python", "Machine Learning", "scikit-learn", "NLP", "Deployment"]
    },
    {
        "title": "Full Stack Developer",
        "company": "CloudStack",
        "location": "Hyderabad",
        "description": "Create React and Django applications, integrate APIs, and optimize performance with modern tooling.",
        "required_skills": ["React", "Django", "Python", "JavaScript", "APIs"]
    },
    {
        "title": "Data Analyst",
        "company": "InsightHub",
        "location": "Remote",
        "description": "Perform data analysis with Python, SQL, Tableau, and communication of insights to stakeholders.",
        "required_skills": ["Python", "SQL", "Tableau", "Data Analysis", "Communication"]
    },
    {
        "title": "DevOps Engineer",
        "company": "ScaleOps",
        "location": "Pune",
        "description": "Automate CI CD with Docker, Kubernetes, AWS, monitoring, and reliability best practices.",
        "required_skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"]
    },
]


class RecommendJobsAPIView(APIView):
    def post(self, request):
        serializer = JobRecommendationInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data
        resume_text = payload.get("resume_text", "")
        skills = payload.get("skills", [])
        resume_id = payload.get("resume_id")
        if resume_id:
            resume = Resume.objects.filter(id=resume_id).first()
            if not resume:
                return Response({"error": "Resume not found."}, status=status.HTTP_404_NOT_FOUND)
            resume_text = resume.extracted_text
            skills = list(resume.skills.values_list("name", flat=True))
        source_text = f"{resume_text} {' '.join(skills)}".strip()
        if not source_text:
            return Response({"error": "No content available to compute recommendations."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity
        except ImportError as exc:
            return Response({"error": f"scikit-learn is required: {exc}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        job_descriptions = [job["description"] for job in JOB_CATALOG]
        corpus = [source_text] + job_descriptions
        tfidf = TfidfVectorizer(stop_words="english")
        matrix = tfidf.fit_transform(corpus)
        similarities = cosine_similarity(matrix[0:1], matrix[1:]).flatten()
        ranked_indices = similarities.argsort()[::-1][:5]
        
        recommendations = []
        source_text_lower = source_text.lower()
        
        for index in ranked_indices:
            job = JOB_CATALOG[int(index)]
            match_percent = round(float(similarities[int(index)]) * 100, 2)
            
            # Compute missing skills
            missing_skills = [
                skill for skill in job.get("required_skills", [])
                if skill.lower() not in source_text_lower
            ]
            
            # Compute reason
            if match_percent >= 80:
                why = "Excellent alignment with your core skills and experience."
            elif match_percent >= 50:
                why = "Good foundation, but requires a few additional specific skills."
            else:
                why = "Consider acquiring the missing skills to improve your match."
                
            recommendations.append(
                {
                    "title": job["title"],
                    "company": job["company"],
                    "location": job["location"],
                    "match_percent": match_percent,
                    "missing_skills": missing_skills,
                    "why_recommended": why
                }
            )
        return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)
