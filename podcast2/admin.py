from django.contrib import admin
from .models import Category2, Podcaster2Profile, Podcast2

@admin.register(Category2)
class Category2Admin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')


@admin.register(Podcast2)
class Podcast2Admin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'category', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'category', 'created_at')
    search_fields = ('title', 'description', 'owner__user__username')
