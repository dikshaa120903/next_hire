import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.resume.models import Resume
from apps.scoring.models import Score
from apps.scoring.serializers import ScoreResumeInputSerializer
from utils.feature_extractor import extract_resume_features
from utils.model_loader import predict_resume_score

logger = logging.getLogger(__name__)


class ScoreResumeAPIView(APIView):
    def post(self, request):
        serializer = ScoreResumeInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        resume_id = serializer.validated_data.get("resume_id")
        incoming_features = serializer.validated_data.get("features")
        job_description = serializer.validated_data.get("job_description", "")
        resume = None
        
        if resume_id:
            resume = Resume.objects.filter(id=resume_id).first()
            if not resume:
                return Response({"error": "Resume not found."}, status=status.HTTP_404_NOT_FOUND)
            skill_names = list(resume.skills.values_list("name", flat=True))
            # Pass the resume's career_role to feature extraction for role-based scoring
            features = extract_resume_features(resume.extracted_text, skill_names, role=resume.career_role, job_description=job_description)
        else:
            features = {
                "skills_count": float(incoming_features.get("skills_count", 0)) if incoming_features else 0,
                "projects_count": float(incoming_features.get("projects_count", 0)) if incoming_features else 0,
                "experience_years": float(incoming_features.get("experience_years", 0)) if incoming_features else 0,
                "keyword_match_percent": float(incoming_features.get("keyword_match_percent", 0)) if incoming_features else 0,
                "detected_role": "software_engineer",
                "missing_keywords": incoming_features.get("missing_keywords", []) if incoming_features else [],
                "matched_keywords_list": incoming_features.get("matched_keywords_list", []) if incoming_features else [],
            }
        
        try:
            predicted_score = predict_resume_score(features)
        except Exception as e:
            logger.error(f"Error predicting resume score: {str(e)}")
            return Response(
                {"error": "Failed to calculate resume score"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        feature_max = {
            "skills_count": 20,
            "projects_count": 10,
            "experience_years": 15,
            "keyword_match_percent": 100,
        }
        breakdown = {
            key: round(min((float(value) / feature_max[key]) * 100, 100), 2)
            for key, value in features.items()
            if key in feature_max
        }
        
        # Always save score data if resume_id is provided
        if resume:
            try:
                Score.objects.update_or_create(
                    resume=resume,
                    defaults={
                        "score": predicted_score,
                        "breakdown": breakdown,
                    },
                )
                logger.info(f"Score saved for resume {resume.id}: {predicted_score}")
            except Exception as e:
                logger.error(f"Error saving score for resume {resume.id}: {str(e)}")
                # Still return response even if save fails
        else:
            logger.warning("Score calculated but not saved (no resume_id provided)")
        
        return Response(
            {
                "resume_id": resume.id if resume else None,
                "score": predicted_score,
                "breakdown": breakdown,
                "features": features,
            },
            status=status.HTTP_200_OK,
        )

class ScoreResumeWithDescriptionAPIView(ScoreResumeAPIView):
    def post(self, request):
        return super().post(request)
