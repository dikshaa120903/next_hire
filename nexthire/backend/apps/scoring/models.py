from django.db import models

from apps.resume.models import Resume


class Score(models.Model):
    resume = models.OneToOneField(Resume, related_name="score_entry", on_delete=models.CASCADE)
    score = models.FloatField()
    breakdown = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Score {self.score:.2f} for Resume {self.resume_id}"
