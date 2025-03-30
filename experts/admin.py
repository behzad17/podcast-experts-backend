from django.contrib import admin
from .models import ExpertProfile, ExpertCategory, ExpertComment


@admin.register(ExpertCategory)
class ExpertCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(ExpertComment)
class ExpertCommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'expert', 'content', 'created_at', 'parent')
    list_filter = ('created_at', 'expert')
    search_fields = ('content', 'user__username', 'expert__name')
    raw_id_fields = ('user', 'expert', 'parent')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ExpertProfile)
class ExpertProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'expertise', 'experience_years', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'expertise', 'categories', 'created_at')
    search_fields = ('name', 'user__username', 'bio', 'expertise')
    readonly_fields = ('created_at',)
    filter_horizontal = ('categories',)
    actions = ['approve_profiles']

    def approve_profiles(self, request, queryset):
        queryset.update(is_approved=True)
    approve_profiles.short_description = "Approve selected expert profiles"

