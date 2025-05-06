from django.contrib import admin
from .models import (
    ExpertProfile,
    ExpertCategory,
    ExpertComment,
    ExpertReaction
)


@admin.register(ExpertCategory)
class ExpertCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(ExpertProfile)
class ExpertProfileAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'user',
        'expertise',
        'experience_years',
        'is_approved',
        'is_featured',
        'created_at'
    )
    list_filter = (
        'is_approved',
        'is_featured',
        'expertise',
        'categories',
        'created_at'
    )
    search_fields = ('name', 'user__username', 'bio', 'expertise')
    readonly_fields = ('created_at',)
    filter_horizontal = ('categories',)
    actions = ['approve_profiles', 'feature_experts', 'unfeature_experts']

    def approve_profiles(self, request, queryset):
        queryset.update(is_approved=True)
    approve_profiles.short_description = "Approve selected expert profiles"

    def feature_experts(self, request, queryset):
        # Check if we're not exceeding the limit of 6 featured experts
        current_featured = ExpertProfile.objects.filter(
            is_featured=True
        ).count()
        can_feature = 6 - current_featured
        if can_feature <= 0:
            self.message_user(
                request,
                "You can only have 6 featured experts at a time."
            )
            return
        to_feature = min(can_feature, queryset.count())
        queryset[:to_feature].update(is_featured=True)
        self.message_user(request, f"{to_feature} experts were featured.")
    feature_experts.short_description = "Feature selected experts (max 6 total)"

    def unfeature_experts(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f"{updated} experts were unfeatured.")
    unfeature_experts.short_description = "Unfeature selected experts"


@admin.register(ExpertComment)
class ExpertCommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'expert', 'content', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'user__username', 'expert__name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ExpertReaction)
class ExpertReactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'expert', 'reaction_type', 'created_at')
    list_filter = ('reaction_type', 'created_at')
    search_fields = ('user__username', 'expert__name')
    readonly_fields = ('created_at',) 