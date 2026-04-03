from django.urls import path
from apps.recommendation.views import RecommendJobsAPIView, RecommendJobsSemanticAPIView

urlpatterns = [
    path('recommend-jobs/', RecommendJobsAPIView.as_view(), name='recommend_jobs'),
    path('recommend-jobs-semantic/', RecommendJobsSemanticAPIView.as_view(), name='recommend_jobs_semantic'),
]
