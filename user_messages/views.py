from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import Message
from .serializers import MessageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        message = self.get_object()
        if message.receiver == request.user and not message.is_read:
            message.is_read = True
            message.read_at = timezone.now()
            message.save()
        return Response({'status': 'message marked as read'})

    @action(detail=False, methods=['get'])
    def conversations(self, request):
        user = request.user
        messages = Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-timestamp')

        conversations = {}
        for message in messages:
            other_user = (
                message.receiver if message.sender == user else message.sender
            )
            if other_user.id not in conversations:
                conversations[other_user.id] = {
                    'user': {
                        'id': other_user.id,
                        'username': other_user.username,
                        'email': other_user.email
                    },
                    'last_message': MessageSerializer(message).data,
                    'unread_count': Message.objects.filter(
                        sender=other_user,
                        receiver=user,
                        is_read=False
                    ).count()
                }

        return Response(list(conversations.values()))

    @action(detail=False, methods=['get'])
    def chat_with_user(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id parameter is required'},
                status=400
            )

        try:
            other_user = User.objects.get(id=user_id)
            messages = Message.objects.filter(
                (Q(sender=request.user) & Q(receiver=other_user)) |
                (Q(sender=other_user) & Q(receiver=request.user))
            ).order_by('timestamp')

            # Mark unread messages as read
            unread_messages = messages.filter(
                receiver=request.user,
                is_read=False
            )
            unread_messages.update(
                is_read=True,
                read_at=timezone.now()
            )

            serializer = MessageSerializer(messages, many=True)
            return Response({
                'messages': serializer.data,
                'other_user': {
                    'id': other_user.id,
                    'username': other_user.username,
                    'email': other_user.email
                }
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=404
            )

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = Message.objects.filter(
            receiver=request.user,
            is_read=False
        ).count()
        return Response({'count': count})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=400
            )

        try:
            other_user = User.objects.get(id=user_id)
            unread_messages = Message.objects.filter(
                sender=other_user,
                receiver=request.user,
                is_read=False
            )
            
            updated_count = unread_messages.update(
                is_read=True,
                read_at=timezone.now()
            )
            
            return Response({
                'status': f'{updated_count} messages marked as read'
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=404
            )
