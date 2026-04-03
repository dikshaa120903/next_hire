from django.urls import path

from apps.scoring.views import ScoreResumeAPIView, ScoreResumeWithDescriptionAPIView

urlpatterns = [
    path("score-resume/", ScoreResumeAPIView.as_view(), name="score-resume"),
    path("score-resume-with-description/", ScoreResumeWithDescriptionAPIView.as_view(), name="score-resume-with-description"),
]
