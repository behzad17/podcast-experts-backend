from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.template.response import TemplateResponse
from admin_dashboard.views import admin_stats


class CustomAdminSite(admin.AdminSite):
    """اضافه کردن صفحه‌ی آمار به پنل ادمین"""
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("stats/", self.admin_view(self.stats_view), name="admin_stats"),
        ]
        return custom_urls + urls

    def stats_view(self, request):
        """دریافت اطلاعات آمار و نمایش در پنل مدیریت"""
        data = admin_stats(request)  # دریافت داده‌ها از ویو `admin_stats`
        context = {"data": data.json()}  # داده‌ها را به قالب ارسال می‌کنیم
        return TemplateResponse(request, "admin/stats.html", context)


# تعریف یک نمونه از CustomAdminSite
custom_admin_site = CustomAdminSite(name="custom_admin")

# جایگزینی `admin.site` پیش‌فرض با `custom_admin_site`
admin.site = custom_admin_site
admin.autodiscover()
