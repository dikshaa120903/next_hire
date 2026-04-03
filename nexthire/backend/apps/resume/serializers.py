from rest_framework import serializers

from apps.resume.models import Resume, Skill
from utils.feature_extractor import validate_resume_file


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ("name",)


class ResumeUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        validate_resume_file(value)
        return value


class ResumeSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = Resume
        fields = ("id", "file", "extracted_text", "uploaded_at", "skills")
