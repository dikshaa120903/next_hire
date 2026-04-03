from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.resume.models import Resume, Skill, CAREER_ROLE_CHOICES
from apps.resume.serializers import ResumeUploadSerializer
from utils.feature_extractor import extract_text_from_file, detect_career_role
from utils.nlp import extract_skills


class UploadResumeAPIView(APIView):
    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uploaded_file = serializer.validated_data["file"]
        job_description = request.data.get("job_description", "")
        resume = Resume.objects.create(file=uploaded_file, job_description=job_description)
        try:
            extracted_text = extract_text_from_file(resume.file.path)
            if not extracted_text:
                raise ValueError("Could not extract any text from the uploaded file. Please ensure it's a valid PDF or DOCX with selectable text.")
            
            resume.extracted_text = extracted_text
            # Auto-detect career role from resume content
            resume.career_role = detect_career_role(extracted_text)
            resume.save(update_fields=["extracted_text", "career_role"])
            skills_data = extract_skills(extracted_text)
            skill_objects = [Skill(resume=resume, name=skill) for skill in skills_data["all"]]
            Skill.objects.bulk_create(skill_objects, ignore_conflicts=True)
            return Response(
                {
                    "resume_id": resume.id,
                    "extracted_text": resume.extracted_text,
                    "skills": skills_data,
                    "detected_role": resume.get_career_role_display(),
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as exc:
            resume.delete()
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateResumeRoleAPIView(APIView):
    """Allow users to update/confirm their career role for more accurate scoring."""
    
    def post(self, request):
        resume_id = request.data.get("resume_id")
        new_role = request.data.get("role")
        
        if not resume_id or not new_role:
            return Response(
                {"error": "resume_id and role are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate role choice
        valid_roles = [choice[0] for choice in CAREER_ROLE_CHOICES]
        if new_role not in valid_roles:
            return Response(
                {"error": f"Invalid role. Must be one of: {', '.join(valid_roles)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            resume = Resume.objects.get(id=resume_id)
            resume.career_role = new_role
            resume.save(update_fields=["career_role"])
            
            return Response(
                {
                    "resume_id": resume.id,
                    "career_role": resume.get_career_role_display(),
                    "message": "Career role updated successfully. Score will be recalculated on next refresh."
                },
                status=status.HTTP_200_OK
            )
        except Resume.DoesNotExist:
            return Response(
                {"error": "Resume not found"},
                status=status.HTTP_404_NOT_FOUND
            )
