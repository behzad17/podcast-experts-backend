from rest_framework import serializers
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    receiver_id = serializers.IntegerField(write_only=True)
    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id',
            'sender',
            'receiver',
            'receiver_id',
            'content',
            'timestamp',
            'is_read',
            'read_at',
            'attachment',
            'attachment_name',
            'attachment_type',
            'attachment_url'
        ]
        read_only_fields = [
            'id',
            'sender',
            'timestamp',
            'is_read',
            'read_at',
            'attachment_url'
        ]

    def get_attachment_url(self, obj):
        if obj.attachment:
            return obj.attachment.url
        return None

    def create(self, validated_data):
        receiver_id = validated_data.pop('receiver_id')
        receiver = User.objects.get(id=receiver_id)
        sender = self.context['request'].user
        return Message.objects.create(
            sender=sender,
            receiver=receiver,
            **validated_data
        ) 