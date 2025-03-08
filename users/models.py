from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class CustomUser(AbstractUser):
    is_expert = models.BooleanField(default=False)  # متخصص بودن کاربر
    is_podcaster = models.BooleanField(default=False)  # پادکستر بودن کاربر

    def __str__(self):
        return self.username

