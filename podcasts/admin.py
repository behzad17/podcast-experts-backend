from django.contrib import admin
from .models import Category, PodcasterProfile, Podcast, PodcastComment

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')

@admin.register(PodcasterProfile)
class PodcasterProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'updated_at')
    search_fields = ('user__username', 'bio')
    list_filter = ('created_at', 'updated_at')

@admin.register(Podcast)
class PodcastAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'category', 'is_approved', 'is_featured', 'created_at')
    list_filter = ('is_approved', 'is_featured', 'category', 'created_at')
    search_fields = ('title', 'description', 'owner__user__username')
    actions = ['feature_podcasts', 'unfeature_podcasts']

    def feature_podcasts(self, request, queryset):
        # Check if we're not exceeding the limit of 6 featured podcasts
        current_featured = Podcast.objects.filter(is_featured=True).count()
        can_feature = 6 - current_featured
        if can_feature <= 0:
            self.message_user(request, "You can only have 6 featured podcasts at a time.")
            return
        to_feature = min(can_feature, queryset.count())
        queryset[:to_feature].update(is_featured=True)
        self.message_user(request, f"{to_feature} podcasts were featured.")
    feature_podcasts.short_description = "Feature selected podcasts (max 6 total)"

    def unfeature_podcasts(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f"{updated} podcasts were unfeatured.")
    unfeature_podcasts.short_description = "Unfeature selected podcasts"

@admin.register(PodcastComment)
class PodcastCommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'podcast', 'content', 'created_at', 'parent')
    list_filter = ('created_at', 'podcast')
    search_fields = ('content', 'user__username', 'podcast__title')
    raw_id_fields = ('user', 'podcast', 'parent')

