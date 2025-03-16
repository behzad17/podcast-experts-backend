from django.contrib import admin
from .models import Podcast, PodcasterProfile

@admin.register(PodcasterProfile)
class PodcasterProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'channel_name', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('user__username', 'channel_name', 'description')
    readonly_fields = ('created_at',)
    list_editable = ('is_approved',)

@admin.register(Podcast)
class PodcastAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('title', 'description', 'owner__channel_name')
    readonly_fields = ('created_at',)
    list_editable = ('is_approved',)

