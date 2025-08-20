#!/usr/bin/env python3
"""
Environment Setup Script for Podcast Experts Backend

This script helps you set up your .env file by copying from .env.example
and prompting for the required values.
"""

import os
import shutil


def main():
    print("🚀 Podcast Experts Backend - Environment Setup")
    print("=" * 50)
    
    # Check if .env already exists
    if os.path.exists('.env'):
        print("⚠️  .env file already exists!")
        prompt = "Do you want to overwrite it? (y/N): "
        response = input(prompt).lower()
        if response != 'y':
            print("Setup cancelled. Your existing .env file remains unchanged.")
            return
    
    # Check if .env.example exists
    if not os.path.exists('.env.example'):
        print("❌ .env.example file not found!")
        print("Please make sure .env.example exists in the project root.")
        return
    
    try:
        # Copy .env.example to .env
        shutil.copy('.env.example', '.env')
        print("✅ Created .env file from .env.example")
        
        # Read the .env file
        with open('.env', 'r') as f:
            content = f.read()
        
        # Replace placeholder values with user input
        print("\n📝 Please provide the following values:")
        print("-" * 30)
        
        # Get Cloudinary credentials
        cloud_name = input("Cloudinary Cloud Name: ").strip()
        api_key = input("Cloudinary API Key: ").strip()
        api_secret = input("Cloudinary API Secret: ").strip()
        
        # Get email settings
        email_user = input("Gmail Email Address: ").strip()
        email_password = input("Gmail App Password: ").strip()
        
        # Get secret key
        prompt = "Django Secret Key (or press Enter to generate): "
        secret_key = input(prompt).strip()
        if not secret_key:
            import secrets
            secret_key = f"django-insecure-{secrets.token_urlsafe(50)}"
            print(f"🔑 Generated Secret Key: {secret_key[:50]}...")
        
        # Replace values in content
        content = content.replace('YOUR_CLOUDINARY_CLOUD_NAME', cloud_name)
        content = content.replace('YOUR_CLOUDINARY_API_KEY', api_key)
        content = content.replace('YOUR_CLOUDINARY_API_SECRET', api_secret)
        content = content.replace('YOUR_EMAIL@gmail.com', email_user)
        content = content.replace('YOUR_APP_PASSWORD', email_password)
        content = content.replace('YOUR_SECRET_KEY_HERE', secret_key)
        
        # Write updated content back to .env
        with open('.env', 'w') as f:
            f.write(content)
        
        print("\n✅ Environment setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Verify your .env file contains the correct values")
        print("2. Start your Django server: python manage.py runserver")
        print("3. Start your React frontend: npm start")
        print("\n🔒 Security reminder:")
        print("- Never commit .env to version control")
        print("- Keep your API keys and secrets secure")
        print("- Use different credentials for development and production")
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")
        print("Please check your file permissions and try again.")


if __name__ == "__main__":
    main()
