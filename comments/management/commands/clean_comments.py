from django.core.management.base import BaseCommand
from comments.models import Comment


class Command(BaseCommand):
    help = 'Cleans invalid comments by removing those without a podcast'

    def handle(self, *args, **options):
        # Delete comments without a podcast
        deleted_count = Comment.objects.filter(podcast__isnull=True).delete()[0]
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully deleted {deleted_count} invalid comments'
            )
        ) 