from django.contrib import admin
from .models import Rating

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'podcast', 'expert', 'score', 'created_at')
    list_filter = ('score', 'created_at')
    search_fields = ('user__username', 'podcast__title', 'expert__name')
    readonly_fields = ('created_at',)
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['user'].required = True
        form.base_fields['score'].required = True
        return form
    
    def save_model(self, request, obj, form, change):
        if not obj.podcast and not obj.expert:
            raise ValueError("Either podcast or expert must be provided")
        if obj.podcast and obj.expert:
            raise ValueError("Cannot provide both podcast and expert")
        super().save_model(request, obj, form, change)

