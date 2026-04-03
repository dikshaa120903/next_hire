from django.urls import path

from apps.resume.views import UploadResumeAPIView, UpdateResumeRoleAPIView

urlpatterns = [
    path("upload-resume/", UploadResumeAPIView.as_view(), name="upload-resume"),
    path("update-resume-role/", UpdateResumeRoleAPIView.as_view(), name="update-resume-role"),
]
