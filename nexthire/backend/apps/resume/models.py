from django.db import models


def resume_upload_path(instance, filename):
    return f"resumes/{filename}"


CAREER_ROLE_CHOICES = [
    ("software_engineer", "Software Engineer"),
    ("data_scientist", "Data Scientist"),
    ("data_engineer", "Data Engineer"),
    ("product_manager", "Product Manager"),
    ("project_manager", "Project Manager"),
    ("management", "Management"),
    ("sales", "Sales"),
    ("marketing", "Marketing"),
    ("finance", "Finance"),
    ("hr", "Human Resources"),
    ("design", "Design"),
]


class Resume(models.Model):
    file = models.FileField(upload_to=resume_upload_path)
    extracted_text = models.TextField(blank=True)
    job_description = models.TextField(blank=True)
    career_role = models.CharField(
        max_length=50,
        choices=CAREER_ROLE_CHOICES,
        default="software_engineer",
        help_text="Detected or user-selected career role for fair scoring"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume {self.id} ({self.get_career_role_display()})"


class Skill(models.Model):
    resume = models.ForeignKey(Resume, related_name="skills", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ("resume", "name")

    def __str__(self):
        return self.name
