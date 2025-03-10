from django.urls import path
from .views import CollaborationListCreateView, CollaborationDetailView

urlpatterns = [
    path('', CollaborationListCreateView.as_view(), name='collaboration-list'),
    path('<int:pk>/', CollaborationDetailView.as_view(), name='collaboration-detail'),
]
