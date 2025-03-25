# Podcast Experts Backend

A Django-based backend system for the Podcast Experts platform. This application manages podcast experts, user interactions, ratings, and comments.

## Features

- User authentication and authorization with email verification
- Strong password requirements
- Podcast expert profiles
- User messages and bookmarks
- Rating and comment system

## Setup

1. Create and activate virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your settings
   - For email verification, you'll need to set up Gmail SMTP:
     - Enable 2-factor authentication in your Google account
     - Generate an App Password for your application
     - Use the App Password in EMAIL_HOST_PASSWORD

4. Run migrations:

   ```bash
   python manage.py migrate
   ```

5. Start server:
   ```bash
   python manage.py runserver 8001
   ```

## Frontend

The frontend React application runs on port 3002 and communicates with this backend.

## Security Features

### Password Requirements

- Minimum length: 8 characters
- Must not be too similar to user information
- Cannot be a commonly used password
- Cannot be entirely numeric

### Email Verification

- Users must verify their email address before logging in
- Verification links are sent via email
- Tokens are securely generated and stored
