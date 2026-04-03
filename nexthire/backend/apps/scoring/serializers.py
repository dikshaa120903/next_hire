from rest_framework import serializers

class ScoreResumeInputSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField(required=False, allow_null=True)
    features = serializers.DictField(required=False, allow_null=True)
    job_description = serializers.CharField(required=False, allow_blank=True)