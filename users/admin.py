from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile, CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'email_verified', 'is_staff')
    list_filter = ('email_verified', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email',)}),
        (
            'Status',
            {
                'fields': (
                    'email_verified', 'is_active', 'is_staff', 'is_superuser',
                    'groups', 'user_permissions'
                )
            }
        ),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    search_fields = ('username', 'email')
    ordering = ('username',)


admin.site.register(UserProfile)
