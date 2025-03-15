from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from .models import ExpertProfile
from .serializers import ExpertProfileSerializer

# Create your views here.

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
        if hasattr(self.request.user, 'expert_profile'):
            raise PermissionDenied(
                "You already have an expert profile."
            )
        serializer.save(user=self.request.user, is_approved=False)

class ExpertProfileUpdateView(generics.UpdateAPIView):
    """
    Update an existing expert profile.
    Only the owner can update their profile.
    """
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_object(self):
        return get_object_or_404(
            ExpertProfile,
            user=self.request.user
        )

    def perform_update(self, serializer):
        profile = self.get_object()
        if profile.is_approved:
            # Preserve the approved status
            serializer.save(is_approved=True)
        else:
            serializer.save()

class ExpertProfileDetailView(generics.RetrieveAPIView):
    """
    Retrieve an expert profile.
    Users can view their own profile or any approved profile.
    """
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile_id = self.kwargs.get('pk')
        if profile_id:
            # If a specific profile is requested, check if it's approved or belongs to the user
            profile = get_object_or_404(ExpertProfile, pk=profile_id)
            if profile.user == self.request.user or profile.is_approved:
                return profile
            raise PermissionDenied("You cannot view this profile.")
        # If no specific profile is requested, return the user's own profile
        return get_object_or_404(ExpertProfile, user=self.request.user)

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
    """
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show approved profiles to regular users
        if not self.request.user.is_staff:
            return ExpertProfile.objects.filter(is_approved=True)
        # Show all profiles to admin users
        return ExpertProfile.objects.all()
