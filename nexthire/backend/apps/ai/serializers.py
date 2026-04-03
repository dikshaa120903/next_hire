from rest_framework import serializers

class ImproveResumeInputSerializer(serializers.Serializer):
    resume_text = serializers.CharField(required=True)
    custom_prompt = serializers.CharField(required=False, allow_blank=True)
    job_description = serializers.CharField(required=False, allow_blank=True)

class ChatInputSerializer(serializers.Serializer):
    message = serializers.CharField(required=True)
    resume_context = serializers.CharField(required=False, allow_blank=True)