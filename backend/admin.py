from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.template.response import TemplateResponse
from admin_dashboard.views import admin_stats


class CustomAdminSite(admin.AdminSite):
    """Custom admin site with statistics"""
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("stats/", self.admin_view(admin_stats), name="admin_stats"),
        ]
        return custom_urls + urls


# Create and register the custom admin site
admin_site = CustomAdminSite(name="admin")
admin.site = admin_site
admin.autodiscover()
