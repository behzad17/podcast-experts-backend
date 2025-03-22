from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpertViewSet

router = DefaultRouter()
router.register(r'', ExpertViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 