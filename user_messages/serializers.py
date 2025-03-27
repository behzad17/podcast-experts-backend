from rest_framework import serializers
from .models import Message
from users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    receiver_id = serializers.IntegerField(write_only=True)
    conversation_id = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'receiver', 'receiver_id', 'content',
            'timestamp', 'is_read', 'read_at', 'conversation_id',
            'attachment', 'attachment_name', 'attachment_type'
        ]
        read_only_fields = ['sender', 'timestamp', 'is_read', 'read_at']

    def get_conversation_id(self, obj):
        return obj.conversation_id

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data) 