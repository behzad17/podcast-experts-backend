from django.contrib import admin
from .models import Category, PodcasterProfile, Podcast

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
    list_display = ('title', 'owner', 'category', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'category', 'created_at')
    search_fields = ('title', 'description', 'owner__user__username')

