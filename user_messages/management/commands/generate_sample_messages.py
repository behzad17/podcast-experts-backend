from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from user_messages.models import Message
from django.utils import timezone
import random

User = get_user_model()

SAMPLE_MESSAGES = [
    "Hi, I saw your profile and wanted to connect!",
    "Hello! Are you interested in collaborating on a podcast?",
    "Thanks for your message. I'd love to discuss more.",
    "What topics are you most passionate about?",
    "Let's schedule a call to talk about our ideas.",
    "I'm available next week for a chat.",
    "Great! Looking forward to working together.",
    "Do you have any experience with AI in podcasts?",
    "How do you usually prepare for interviews?",
    "Thanks for your quick response!"
]

class Command(BaseCommand):
    help = 'Generate custom sample messages between users.'

    def handle(self, *args, **options):
        users = list(User.objects.all())
        if len(users) < 2:
            self.stdout.write(self.style.ERROR('Not enough users to generate messages.'))
            return
        count = 0
        for i in range(10):
            sender, receiver = random.sample(users, 2)
            content = random.choice(SAMPLE_MESSAGES)
            Message.objects.create(
                sender=sender,
                receiver=receiver,
                content=content,
                timestamp=timezone.now()
            )
            count += 1
        self.stdout.write(self.style.SUCCESS(f'Generated {count} sample messages between users.')) 