from django.contrib.auth import get_user_model
from rest_framework import serializers
import re
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(
        choices=User.USER_TYPE_CHOICES,
        default='podcaster'
    )
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password',
            'confirm_password', 'user_type'
        )
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        logger.debug(f'Validating username: {value}')
        if len(value) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters long"
            )
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers, and underscores"
            )
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken")
        return value

    def validate_email(self, value):
        logger.debug(f'Validating email: {value}')
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "This email is already registered"
            )
        return value

    def validate_password(self, value):
        logger.debug('Validating password')
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long"
            )
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter"
            )
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter"
            )
        if not re.search(r'\d', value):
            raise serializers.ValidationError(
                "Password must contain at least one number"
            )
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError(
                "Password must contain at least one special character"
            )
        return value

    def validate(self, data):
        logger.debug(f'Validating registration data: {data}')
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match"}
            )
        return data

    def create(self, validated_data):
        logger.debug(f'Creating user with data: {validated_data}')
        # Remove confirm_password from the data
        validated_data.pop('confirm_password', None)
        password = validated_data.pop('password')
        # Get user_type with default
        user_type = validated_data.get('user_type', 'podcaster')
        user = User.objects.create_user(
            password=password,
            user_type=user_type,  # Explicitly set user_type
            **validated_data
        )
        logger.debug(f'User created successfully: {user.username}')
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user_type']
        read_only_fields = ['id', 'username', 'email', 'user_type']
