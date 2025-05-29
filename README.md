# CONNECT (Find Experts For Podcasts)

A web application for discovering, sharing, and managing  contact between podcasters and experts.This platform provides a convenient and reliable way for experts and specialists to connect with podcasters and content creators, built with Django (backend) and React (frontend), and deployed on Heroku.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Models Explained](#models-explained)
- [How the Site Works](#how-the-site-works)
- [Frontend URL](#frontend-url)
- [Admin Panel URL](#admin-panel-url)
- [API Endpoints](#api-endpoints)
- [How to Use the Site](#how-to-use-the-site)
- [How to Run Locally](#how-to-run-locally)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contact](#contact)

---

## Project Overview

Podcast Experts is a platform where users can:

- Discover and listen to podcasts
- Create and manage their own podcasts
- Comment on and like podcasts
- Communicate with experts and other users

The backend is built with Django and Django REST Framework. The frontend is built with React. Media files (like podcast images) are stored using Cloudinary.

---

## Main Features

- User registration and login
- Podcast listing, detail, and search
- Podcast creation and editing (for podcasters)
- Podcast categories
- Comments and likes on podcasts
- Expert profiles and messaging
- Admin panel for managing all data

---

## Models Explained

### 1. **User**

- Custom user model for authentication.
- Users can be regular listeners, podcasters, or experts.

### 2. **PodcasterProfile**

- Linked to a user.
- Stores bio, website, and social links for podcasters.

### 3. **ExpertProfile**

- Linked to a user.
- Stores information about podcast experts.

### 4. **Category**

- Each podcast belongs to a category (e.g., Health, Technology).

### 5. **Podcast**

- Main model for podcasts.
- Fields: title, description, owner (podcaster), category, image, link, approval status, featured status, created/updated times.

### 6. **PodcastComment**

- Users can comment on podcasts.
- Supports replies (threaded comments).

### 7. **PodcastLike**

- Users can like podcasts.


### 8. **UserMessage**

- Users can send messages to each other (including experts).

---

## How the Site Works

- **Browse Podcasts:** Anyone can view the list of podcasts and see details.
- **Register/Login:** Users can create an account to comment, like, or create podcasts.
- **Create Podcasts:** Podcasters can add new podcasts, including uploading an image.
- **Comment & Like:** Users can comment on and like podcasts.
- **Expert Interaction:** Users can view expert profiles and send messages.
- **Admin Panel:** Site admins can manage users, podcasts, comments, and more.

---

## Frontend URL

- **Main Site:**  
  [https://podcast-backend-4e5439705bd3.herokuapp.com/](https://podcast-backend-4e5439705bd3.herokuapp.com/)
  > The frontend and backend are served from the same URL.

---

## Admin Panel URL

- **Admin Panel:**  
  [https://podcast-backend-4e5439705bd3.herokuapp.com/admin/](https://podcast-backend-4e5439705bd3.herokuapp.com/admin/)
  > Only staff users can log in to the admin panel.

---

## API Endpoints

- **Podcasts List:** `/api/podcasts/`
- **Podcast Detail:** `/api/podcasts/<id>/`
- **Categories:** `/api/categories/`
- **Comments:** `/api/podcasts/<id>/comments/`
- **Likes:** `/api/podcasts/<id>/like/`
- **Experts:** `/api/experts/`
- **User Messages:** `/api/messages/`
- **Authentication:** `/api/auth/` (register, login, logout, etc.)
  > The exact endpoints may vary; check your Django REST Framework router or `urls.py` for details.

---

## How to Use the Site

1. **Visit the main site.**
2. **Register** for an account or log in.
3. **Browse** podcasts or search by category.
4. **Click** a podcast to see details, comments, and likes.
5. **Create** your own podcast if you are a podcaster.
6. **Comment** on podcasts and interact with experts.

---


## Environment Variables

 A `.env` file in  project root with the following (example values):

```
SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (for password reset, etc.)
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_email_password
```

---

## Deployment

- The project is deployed on Heroku.
- Static and media files are handled by WhiteNoise and Cloudinary.
- The `Procfile` and `requirements.txt` are set up for Heroku deployment.

---

## Screenshots

### Home Page

![Home Page](screenshots/homepage.png)

### Podcast Detail

![Podcast Detail](screenshots/podcast_detail.png)

### Admin Panel

![Admin Panel](screenshots/admin_panel.png)

> To add your own screenshots, place images in a `screenshots/` folder and update the links above.

---

