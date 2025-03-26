from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, filters, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from .models import ExpertProfile, ExpertComment, ExpertRating
from .serializers import (
    ExpertProfileSerializer,
    ExpertCommentSerializer,
    ExpertRatingSerializer
)
from rest_framework.decorators import action
from django.db.models import Q

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
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ExpertProfile.objects.all()
        return ExpertProfile.objects.filter(is_approved=True)


class ExpertProfileCreateView(generics.CreateAPIView):
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.user_type != 'expert':
            raise PermissionDenied(
                "Only users registered as experts can create expert profiles."
            )
        if hasattr(self.request.user, 'expert_profile'):
            raise PermissionDenied(
                "You already have an expert profile."
            )
        serializer.save(user=self.request.user, is_approved=False)


class ExpertProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ExpertProfile.objects.all()

    def get_object(self):
        obj = super().get_object()
        if (not obj.is_approved and not self.request.user.is_staff and 
            obj.user != self.request.user):
            raise PermissionDenied("This profile is not approved yet.")
        return obj

    def check_object_permissions(self, request, obj):
        if request.method not in permissions.SAFE_METHODS:
            if not (request.user.is_staff or obj.user == request.user):
                raise PermissionDenied(
                    "You don't have permission to modify this profile."
                )
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
    permission_classes = [permissions.AllowAny]
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


class MyExpertProfileView(generics.RetrieveUpdateAPIView):
    """
    Get and update the current user's expert profile.
    """
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(ExpertProfile, user=self.request.user)

    def perform_update(self, serializer):
        # Handle profile picture upload
        profile_picture = self.request.FILES.get('profile_picture')
        if profile_picture:
            # Delete old profile picture if it exists
            instance = self.get_object()
            if instance.profile_picture:
                instance.profile_picture.delete()
        
        serializer.save(user=self.request.user)


class ExpertStatsView(APIView):
    """
    Get statistics for the current expert's profile.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        expert_profile = get_object_or_404(ExpertProfile, user=request.user)
        
        # Get total views
        total_views = expert_profile.get_total_views()
        
        # Get total bookmarks
        total_bookmarks = expert_profile.get_total_bookmarks()
        
        # Get average rating
        average_rating = expert_profile.get_average_rating()
        
        return Response({
            'total_views': total_views,
            'total_bookmarks': total_bookmarks,
            'average_rating': round(average_rating, 2),
        })


class ExpertProfileViewSet(viewsets.ModelViewSet):
    queryset = ExpertProfile.objects.all()
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'bio', 'expertise', 'user__username']
    ordering_fields = ['name', 'created_at', 'experience_years', 'average_rating']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = ExpertProfile.objects.all()
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        
        if category:
            queryset = queryset.filter(categories__id=category)
            
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(bio__icontains=search) |
                Q(expertise__icontains=search) |
                Q(user__username__icontains=search)
            )
            
        if self.action == 'list':
            queryset = queryset.filter(is_approved=True)
        return queryset

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        expert = self.get_object()
        serializer = ExpertCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(expert=expert, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        expert = self.get_object()
        serializer = ExpertRatingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(expert=expert, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def bookmark(self, request, pk=None):
        expert = self.get_object()
        if request.user in expert.bookmarks.all():
            expert.bookmarks.remove(request.user)
            return Response({'status': 'unbookmarked'})
        expert.bookmarks.add(request.user)
        return Response({'status': 'bookmarked'})

    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        expert = self.get_object()
        expert.views.add(request.user)
        return Response({'status': 'viewed'})

    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        try:
            expert_profile = ExpertProfile.objects.get(user=request.user)
            serializer = self.get_serializer(expert_profile)
            return Response(serializer.data)
        except ExpertProfile.DoesNotExist:
            return Response(
                {'error': 'Expert profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def stats(self, request):
        try:
            expert_profile = ExpertProfile.objects.get(user=request.user)
            stats = {
                'total_views': expert_profile.get_total_views(),
                'total_bookmarks': expert_profile.get_total_bookmarks(),
                'average_rating': expert_profile.get_average_rating(),
            }
            return Response(stats)
        except ExpertProfile.DoesNotExist:
            return Response(
                {'error': 'Expert profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class PendingExpertProfilesView(generics.ListAPIView):
    """
    List all pending expert profiles.
    Only accessible by admin users.
    """
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return ExpertProfile.objects.filter(is_approved=False)


class ExpertProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ExpertProfile.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
