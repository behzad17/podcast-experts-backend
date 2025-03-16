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


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class ExpertProfileCreateView(generics.CreateAPIView):
    """
    Create a new expert profile.
    Requires authentication and checks for existing profiles.
    """
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """
        Create a new expert profile for the authenticated user.
        Checks for existing profile and handles potential database errors.
        """
        try:
            if hasattr(self.request.user, 'expert_profile'):
                raise PermissionDenied("You already have an expert profile.")
            serializer.save(user=self.request.user, is_approved=False)
        except IntegrityError:
            raise PermissionDenied("Error creating profile. Please try again.")


class ExpertProfileUpdateView(generics.UpdateAPIView):
    """
    Update an existing expert profile.
    Only the owner can update their profile.
    """
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_object(self):
        return get_object_or_404(ExpertProfile, user=self.request.user)

    def perform_update(self, serializer):
        """
        Update the expert profile while preserving the approval status.
        Validates required fields before updating.
        """
        profile = self.get_object()
        if not serializer.validated_data.get('specialty'):
            raise serializers.ValidationError({
                "specialty": "This field is required."
            })

        if profile.is_approved:
            serializer.save(is_approved=True)
        else:
            serializer.save()

        return Response({
            "message": "Profile updated successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)


class ExpertProfileDetailView(generics.RetrieveDestroyAPIView):
    """
    Retrieve or delete an expert profile.
    Users can view their own profile or any approved profile.
    Only owners can delete their profiles.
    """
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_object(self):
        profile_id = self.kwargs.get('pk')
        if profile_id:
            profile = get_object_or_404(ExpertProfile, pk=profile_id)
            if (profile.user == self.request.user or
                    profile.is_approved):

                return profile
            raise PermissionDenied("You cannot view this profile.")
        return get_object_or_404(ExpertProfile, user=self.request.user)

    def perform_destroy(self, instance):
        """
        Delete the expert profile if the user is the owner.
        """
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own profile.")
        instance.delete()
        return Response(
            {"message": "Profile deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


class ExpertProfileApprovalView(APIView):
    """
    Approve an expert profile.
    Only admin users can approve profiles.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        profile = get_object_or_404(ExpertProfile, pk=pk)

        if profile.is_approved:
            return Response(
                {'message': 'Profile is already approved'},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile.is_approved = True
        profile.save()
        return Response(
            {'message': 'Profile approved successfully'},
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
