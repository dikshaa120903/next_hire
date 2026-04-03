from django.urls import path

from apps.ai.views import ChatAPIView, ImproveResumeAPIView

urlpatterns = [
    path("improve-resume/", ImproveResumeAPIView.as_view(), name="improve-resume"),
    path("chat/", ChatAPIView.as_view(), name="chat"),
]
