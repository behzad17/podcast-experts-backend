from django.db import models

# Create your models here.
class ExpertProfile(models.Model):
    user = models.OneToOneField('users.CustomUser', on_delete=models.CASCADE, related_name='expert_profile')
    specialty = models.CharField(max_length=255)
    bio = models.TextField()
    participation_method = models.CharField(max_length=255, choices=[
        ('حضوری', 'حضوری'),
        ('تصویری', 'تصویری'),
        ('تلفنی', 'تلفنی'),
        ('مکاتبه', 'مکاتبه'),
    ])
    sample_works = models.TextField(blank=True, null=True)
    contact_methods = models.TextField()

    is_approved = models.BooleanField(default=False)  # تأیید متخصص توسط ادمین

    def __str__(self):
        return f"{self.user.username} - {self.specialty}"
    
class FavoriteExperts(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} favorite {self.expert.user.username}"


