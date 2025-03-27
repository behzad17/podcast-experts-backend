from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer
from django.utils import timezone
from users.serializers import UserSerializer

# Create your views here.

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get messages where user is either sender or receiver"""
        return Message.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        ).select_related('sender', 'receiver')

    @action(detail=False, methods=['get'])
    def conversations(self, request):
        """Get all conversations for the current user"""
        messages = self.get_queryset()
        conversations = {}
        
        for message in messages:
            conv_id = message.conversation_id
            other_user = (
                message.receiver if message.sender == request.user 
                else message.sender
            )
            
            if conv_id not in conversations:
                conversations[conv_id] = {
                    'other_user': UserSerializer(other_user).data,
                    'last_message': message,
                    'unread_count': 0
                }
            else:
                if (message.timestamp > 
                    conversations[conv_id]['last_message'].timestamp):
                    conversations[conv_id]['last_message'] = message
                if not message.is_read and message.receiver == request.user:
                    conversations[conv_id]['unread_count'] += 1

        # Convert to list and sort by last message timestamp
        conversation_list = [
            {
                'conversation_id': conv_id,
                'other_user': data['other_user'],
                'last_message': MessageSerializer(data['last_message']).data,
                'unread_count': data['unread_count']
            }
            for conv_id, data in conversations.items()
        ]
        conversation_list.sort(
            key=lambda x: x['last_message']['timestamp'],
            reverse=True
        )
        
        return Response(conversation_list)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a message as read"""
        message = self.get_object()
        if message.receiver == request.user:
            message.mark_as_read()
            return Response({'status': 'message marked as read'})
        return Response(
            {'detail': 'Not authorized to mark this message as read'},
            status=status.HTTP_403_FORBIDDEN
        )

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all messages as read"""
        messages = Message.objects.filter(
            receiver=request.user,
            is_read=False
        )
        messages.update(is_read=True, read_at=timezone.now())
        return Response({'status': 'all messages marked as read'})
