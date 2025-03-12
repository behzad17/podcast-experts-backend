from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserTests(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(username="testuser", password="testpass")
        self.assertEqual(user.username, "testuser")

