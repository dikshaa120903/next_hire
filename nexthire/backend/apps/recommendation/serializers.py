from rest_framework import serializers


class JobRecommendationInputSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField(required=False)
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    resume_text = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if not attrs.get("resume_id") and not attrs.get("skills") and not attrs.get("resume_text"):
            raise serializers.ValidationError("Provide resume_id, skills, or resume_text.")
        return attrs
