import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from experts.models import ExpertProfile, ExpertCategory

User = get_user_model()

# Create expert categories if they don't exist
categories = [
    {'name': 'Technology', 'description': 'Experts in technology and digital transformation'},
    {'name': 'Business', 'description': 'Business strategy and management experts'},
    {'name': 'Health', 'description': 'Health and wellness professionals'},
    {'name': 'Science', 'description': 'Scientific researchers and educators'},
    {'name': 'Arts', 'description': 'Artists and creative professionals'}
]

for category_data in categories:
    name = category_data['name']
    description = category_data['description']
    
    ExpertCategory.objects.get_or_create(
        name=name,
        defaults={
            'description': description
        }
    )
    print(f"Category '{name}' created or already exists")

# Get all categories for association
tech_category = ExpertCategory.objects.get(name='Technology')
business_category = ExpertCategory.objects.get(name='Business')
health_category = ExpertCategory.objects.get(name='Health')
science_category = ExpertCategory.objects.get(name='Science')
arts_category = ExpertCategory.objects.get(name='Arts')

# Create expert users and profiles
experts_data = [
    {
        'username': 'tech_expert',
        'email': 'tech@example.com',
        'password': 'Password123!',
        'first_name': 'Alex',
        'last_name': 'Johnson',
        'name': 'Alex Johnson',
        'bio': 'AI and machine learning expert with 10+ years of experience',
        'categories': [tech_category],
        'expertise': 'Artificial Intelligence',
        'experience_years': 10,
        'is_approved': True,
        'is_featured': True
    },
    {
        'username': 'business_guru',
        'email': 'business@example.com',
        'password': 'Password123!',
        'first_name': 'Sarah',
        'last_name': 'Miller',
        'name': 'Sarah Miller',
        'bio': 'Business strategy consultant for Fortune 500 companies',
        'categories': [business_category],
        'expertise': 'Strategic Planning',
        'experience_years': 15,
        'is_approved': True,
        'is_featured': True
    },
    {
        'username': 'health_pro',
        'email': 'health@example.com',
        'password': 'Password123!',
        'first_name': 'Michael',
        'last_name': 'Davis',
        'name': 'Michael Davis',
        'bio': 'Nutritionist and wellness coach focused on holistic health',
        'categories': [health_category],
        'expertise': 'Nutrition',
        'experience_years': 8,
        'is_approved': True,
        'is_featured': False
    },
    {
        'username': 'science_guru',
        'email': 'science@example.com',
        'password': 'Password123!',
        'first_name': 'Emily',
        'last_name': 'Wilson',
        'name': 'Emily Wilson',
        'bio': 'Physics researcher with publications in quantum mechanics',
        'categories': [science_category],
        'expertise': 'Quantum Physics',
        'experience_years': 12,
        'is_approved': True,
        'is_featured': False
    }
]

for expert_data in experts_data:
    username = expert_data['username']
    email = expert_data['email']
    password = expert_data['password']
    categories = expert_data.pop('categories')
    
    # Create user if it doesn't exist
    try:
        user = User.objects.get(username=username)
        print(f"User '{username}' already exists")
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=expert_data['first_name'],
            last_name=expert_data['last_name']
        )
        print(f"Created user '{username}'")
    
    # Create or update expert profile
    expert_profile, created = ExpertProfile.objects.update_or_create(
        user=user,
        defaults={
            'name': expert_data['name'],
            'bio': expert_data['bio'],
            'expertise': expert_data['expertise'],
            'experience_years': expert_data['experience_years'],
            'is_approved': expert_data['is_approved'],
            'is_featured': expert_data['is_featured']
        }
    )
    
    # Add categories
    for category in categories:
        expert_profile.categories.add(category)
    
    status = "Created" if created else "Updated"
    print(f"{status} expert profile for '{username}'")

print("\nExpert profiles creation completed successfully!") 