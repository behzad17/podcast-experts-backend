from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework import serializers
from django.db import IntegrityError
from .models import ExpertProfile
from .serializers import ExpertProfileSerializer

# Create your views here.


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class IsExpertOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class ExpertListView(generics.ListAPIView):
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ExpertProfile.objects.all()
        return ExpertProfile.objects.filter(is_approved=True)


class ExpertProfileCreateView(generics.CreateAPIView):
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'expert_profile'):
            raise PermissionDenied(
                "You already have an expert profile."
            )
        serializer.save(user=self.request.user, is_approved=False)


class ExpertProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.AllowAny]
    queryset = ExpertProfile.objects.all()

    def get_object(self):
        obj = super().get_object()
        if not obj.is_approved and not self.request.user.is_staff and (not self.request.user.is_authenticated or obj.user != self.request.user):
            raise PermissionDenied("This profile is not approved yet.")
        return obj

    def check_object_permissions(self, request, obj):
        if request.method not in permissions.SAFE_METHODS:
            if not request.user.is_authenticated:
                raise PermissionDenied("Authentication required to modify profile.")
            if not (request.user.is_staff or obj.user == request.user):
                raise PermissionDenied("You don't have permission to modify this profile.")
        return super().check_object_permissions(request, obj)


class ExpertProfileApprovalView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        profile = get_object_or_404(ExpertProfile, pk=pk)
        profile.is_approved = True
        profile.save()
        return Response(
            {'message': 'Expert profile approved successfully'},
            status=status.HTTP_200_OK
        )


class ExpertProfileListView(generics.ListAPIView):
    """
    List all approved expert profiles.
    Supports pagination, searching, and filtering.
    """
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['specialty', 'user__username', 'bio']
    ordering_fields = ['user__username', 'specialty', 'created_at']

    def get_queryset(self):
        queryset = ExpertProfile.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_approved=True)

        specialty = self.request.query_params.get('specialty', None)
        if specialty:
            queryset = queryset.filter(specialty__icontains=specialty)

        return queryset
