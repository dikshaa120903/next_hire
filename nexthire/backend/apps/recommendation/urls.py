from django.urls import path

from apps.recommendation.views import RecommendJobsAPIView

urlpatterns = [
    path("recommend-jobs/", RecommendJobsAPIView.as_view(), name="recommend-jobs"),
]
