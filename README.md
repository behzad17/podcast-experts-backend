# CONNECT (Find Experts For Podcasts)

A web application for discovering, sharing, and managing contact between podcasters and experts. This platform provides a convenient and reliable way for experts and specialists to connect with podcasters and content creators, built with Django (backend) and React (frontend), and deployed on Heroku.

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
- [CRUD Operations](#crud-operations)
- [Screenshots](#screenshots)
- [Contact](#contact)

---

## Project Overview

CONNECT is a platform where users can:

- Discover and listen to podcasts
- Create and manage their own podcasts
- Comment on and like podcasts
- Communicate with experts and other users
- Browse expert profiles and connect with industry specialists
- Access comprehensive About and Contact pages

The backend is built with Django and Django REST Framework. The frontend is built with React. Media files (like podcast images and expert profile pictures) are stored using Cloudinary.

---

## Main Features

- User registration and login (Podcasters, Experts, Listeners)
- Podcast listing, detail, and search with category filtering
- Podcast creation and editing (for podcasters)
- Podcast categories and featured content
- Comments and likes on podcasts
- Expert profiles with expertise areas and ratings
- Direct messaging between users
- Bookmarking system for favorites
- Admin panel for managing all data
- Responsive design with mobile-optimized navigation
- About and Contact pages with comprehensive information

---

## Models Explained

### 1. **User (CustomUser)**

- Custom user model for authentication
- Users can be regular listeners, podcasters, or experts
- Supports email verification and password management

### 2. **PodcasterProfile**

- Linked to a user
- Stores bio, website, and social links for podcasters
- Manages podcaster-specific information

### 3. **ExpertProfile**

- Linked to a user
- Stores information about podcast experts
- Includes expertise areas, bio, website, social media, and featured status
- Profile pictures with Cloudinary integration

### 4. **Category**

- Each podcast belongs to a category (e.g., Health, Technology, Business)
- Supports filtering and organization

### 5. **Podcast**

- Main model for podcasts
- Fields: title, description, owner (podcaster), category, image, link, approval status, featured status, created/updated times
- Full CRUD operations with owner-only editing/deletion

### 6. **PodcastComment**

- Users can comment on podcasts
- Supports threaded comments and replies
- Owner-only editing and deletion

### 7. **PodcastLike**

- Users can like podcasts
- Tracks user interactions and engagement

### 8. **UserMessage**

- Users can send messages to each other (including experts)
- Supports conversation threading

### 9. **Bookmark**

- Users can bookmark favorite experts and podcasts
- Quick access to saved content

---

## How the Site Works

- **Browse Podcasts:** Anyone can view the list of podcasts and see details
- **Register/Login:** Users can create an account to comment, like, or create podcasts
- **Create Podcasts:** Podcasters can add new podcasts, including uploading an image
- **Comment & Like:** Users can comment on and like podcasts
- **Expert Interaction:** Users can view expert profiles and send messages
- **Bookmarking:** Save favorite content for easy access
- **Admin Panel:** Site admins can manage users, podcasts, comments, and more
- **Mobile Responsive:** Hamburger menu with auto-close functionality on mobile devices

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

### **Podcasts**

- **List:** `GET /api/podcasts/`
- **Detail:** `GET /api/podcasts/<id>/`
- **Create:** `POST /api/podcasts/create/`
- **Update:** `PUT /api/podcasts/<id>/`
- **Delete:** `DELETE /api/podcasts/<id>/`
- **Categories:** `GET /api/podcasts/categories/`

### **Comments**

- **List:** `GET /api/podcasts/<id>/comments/`
- **Create:** `POST /api/podcasts/<id>/comments/`

### **Reactions**

- **List:** `GET /api/podcasts/<id>/reactions/`
- **Add/Update:** `POST /api/podcasts/<id>/reactions/`
- **Delete:** `DELETE /api/podcasts/<id>/reactions/<reaction_id>/`

### **Experts**

- **List:** `GET /api/experts/`
- **Detail:** `GET /api/experts/<id>/`
- **Create:** `POST /api/experts/`
- **Update:** `PUT /api/experts/<id>/`
- **Delete:** `DELETE /api/experts/<id>/`

### **Authentication**

- **Register:** `POST /api/auth/register/`
- **Login:** `POST /api/auth/login/`
- **Logout:** `POST /api/auth/logout/`

### **User Messages**

- **List:** `GET /api/messages/`
- **Create:** `POST /api/messages/`

---

## How to Use the Site

1. **Visit the main site**
2. **Register** for an account or log in
3. **Browse** podcasts or search by category
4. **Click** a podcast to see details, comments, and likes
5. **Create** your own podcast if you are a podcaster
6. **Comment** on podcasts and interact with experts
7. **Bookmark** favorite content for easy access
8. **Explore** expert profiles and connect with specialists
9. **Use** the responsive navigation on all devices

---

## Environment Variables

A `.env` file in project root with the following (example values):

```bash
# Django Settings
SECRET_KEY=your-actual-secret-key-here
DEBUG=True

# Database Configuration
DATABASE_URL=sqlite:///db.sqlite3

# Email Configuration (Gmail SMTP)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Deployment

- The project is deployed on Heroku
- Static and media files are handled by WhiteNoise and Cloudinary
- The `Procfile` and `requirements.txt` are set up for Heroku deployment
- Cloudinary integration provides optimized image delivery and storage

---

## CRUD Operations

### **Complete CRUD Functionality Status: ✅ FULLY FUNCTIONAL**

| Operation         | API Endpoint                 | Description                                 | Status |
| ----------------- | ---------------------------- | ------------------------------------------- | ------ |
| **Create**        | `POST /api/podcasts/create/` | Authenticated users can create new podcasts | ✅     |
| **Read**          | `GET /api/podcasts/`         | Public endpoint to view all podcasts        | ✅     |
| **Read (Detail)** | `GET /api/podcasts/:id/`     | View details of a specific podcast          | ✅     |
| **Update**        | `PUT /api/podcasts/:id/`     | Only the podcast owner can update           | ✅     |
| **Delete**        | `DELETE /api/podcasts/:id/`  | Only the podcast owner can delete           | ✅     |

### **Expert Profiles CRUD**

| Operation         | API Endpoint               | Description                         | Status |
| ----------------- | -------------------------- | ----------------------------------- | ------ |
| **Create**        | `POST /api/experts/`       | Users can create expert profiles    | ✅     |
| **Read**          | `GET /api/experts/`        | Public endpoint to view all experts | ✅     |
| **Read (Detail)** | `GET /api/experts/:id/`    | View expert profile details         | ✅     |
| **Update**        | `PUT /api/experts/:id/`    | Only the expert owner can update    | ✅     |
| **Delete**        | `DELETE /api/experts/:id/` | Only the expert owner can delete    | ✅     |

### **Frontend Implementation**

- ✅ All CRUD operations implemented with forms and buttons
- ✅ Delete confirmation modals with proper error handling
- ✅ Toast notifications for success/failure feedback
- ✅ Real-time state updates after operations
- ✅ Responsive design with mobile-optimized interface
- ✅ Hamburger menu auto-close functionality on mobile

---

## Manual Testing

### **Backend API Testing**

| Scenario                         | Test Steps                                      | Expected Result    | Status |
| -------------------------------- | ----------------------------------------------- | ------------------ | ------ |
| User Registration (valid)        | `POST /api/auth/register/` with valid data      | 201 Created        | ✅     |
| User Registration (invalid)      | `POST /api/auth/register/` with duplicate email | 400 Bad Request    | ✅     |
| Login                            | `POST /api/auth/login/`                         | JWT Token returned | ✅     |
| Create Podcast                   | `POST /api/podcasts/create/` with valid token   | 201 Created        | ✅     |
| Create Podcast (unauthenticated) | `POST /api/podcasts/create/` without token      | 401 Unauthorized   | ✅     |
| Update Podcast                   | `PUT /api/podcasts/:id/`                        | 200 OK             | ✅     |
| Delete Podcast                   | `DELETE /api/podcasts/:id/`                     | 204 No Content     | ✅     |
| List Podcasts                    | `GET /api/podcasts/`                            | 200 OK + JSON List | ✅     |

### **Frontend Manual Testing**

- ✅ User can register → success message + redirect to login
- ✅ User can log in → navbar updates with personalized menu
- ✅ Create podcast → Toast notification + new item appears in list
- ✅ Update podcast → changes reflected immediately
- ✅ Delete podcast → item removed from list with confirmation
- ✅ Search and filter → correct results displayed
- ✅ Responsive design works (hamburger menu closes after selection on mobile)
- ✅ Expert profile CRUD operations work correctly
- ✅ Delete confirmations prevent accidental deletions

---

## Installation (Local Setup)

### **Backend (Django + DRF)**

```bash
git clone <repository-url>
cd podcast-experts-backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
python manage.py migrate
python manage.py loaddata db_backup_cleaned.json  # Load sample data
python manage.py createsuperuser
python manage.py runserver
```

## Frontend Deployment

The frontend of **Podcast Experts** is built using **React** and compiled into production-ready static files using:

```bash
npm run build

In production, the compiled React build is served by the Django backend through WhiteNoise, allowing a single Heroku application to host both the API and the frontend.
🚀 1. Local Production Build
Generate the production build:
cd frontend
npm install
npm run build
A build/ folder is created containing minified and production-ready static assets.
🗂 2. Serving the React Build with Django + WhiteNoise
Two supported methods:
A) Copy React build into Django static files
/backend
    /static
    /staticfiles
    /frontend_build   ← React build output
B) Serve the build folder directly
Update Django settings:
STATICFILES_DIRS
TEMPLATES
WhiteNoiseMiddleware
Both methods work seamlessly with WhiteNoise.
🔧 3. Frontend Environment Variables
React requires environment variables at build time:
Variable	Description
REACT_APP_API_BASE_URL	URL of the deployed Django REST API
REACT_APP_WEBSITE_URL	Public frontend URL
Example:
REACT_APP_API_BASE_URL="https://your-api.com" \
REACT_APP_WEBSITE_URL="https://your-frontend.com" \
npm run build
These variables are embedded directly into the compiled React files.
☁️ 4. Deploying to Heroku
This project uses one Heroku app to serve both backend and frontend.
Step 1 — Include the latest build
git add frontend/build
git commit -m "Add updated React production build"
Step 2 — Deploy
git push heroku main
What Heroku does automatically:
Installs backend dependencies
Installs frontend dependencies (if configured)
Builds React (npm run build)
Runs collectstatic
Serves the app using WhiteNoise
Final deployed application:
https://your-heroku-app.herokuapp.com/
All React routes (e.g., /login, /podcasts, /about) are handled entirely through the compiled React build served by Django.

---

## Deployment Guide (Backend)

1. **Install dependencies**

   ```bash
   pip install gunicorn whitenoise dj-database-url psycopg[binary] django-cors-headers
   ```

2. **Settings (settings.py)**

   ```python
   import dj_database_url, os

   DEBUG = False
   SECRET_KEY = os.getenv("SECRET_KEY")
   ALLOWED_HOSTS = ["your-domain.com"]

   DATABASES = {
       "default": dj_database_url.config(default=os.getenv("DATABASE_URL"))
   }

   STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

   CORS_ALLOWED_ORIGINS = [
       "https://your-frontend-domain.com",
   ]
   ```

3. **Procfile**

   ```
   web: gunicorn backend.wsgi
   ```

4. **Deploy to Heroku**

   ```bash
   heroku create your-app-name
   heroku config:set SECRET_KEY="..."
   heroku config:set DATABASE_URL="..."
   git push heroku main
   heroku run python manage.py migrate
   heroku run python manage.py createsuperuser
   ```

5. **Verify deployment**
   - API Live URL: [https://podcast-backend-4e5439705bd3.herokuapp.com/](https://podcast-backend-4e5439705bd3.herokuapp.com/)

---

## Project Management

### **Current Status**

- ✅ Core functionality implemented
- ✅ CRUD operations fully functional
- ✅ Mobile responsive design
- ✅ Cloudinary integration complete
- ✅ About and Contact pages added
- ✅ Database populated with sample data
- ✅ Admin panel accessible

### **Recent Improvements**

- Fixed hamburger menu auto-close on mobile
- Standardized API endpoints for consistency
- Added delete functionality with confirmation modals
- Enhanced Cloudinary configuration for existing images
- Created comprehensive About and Contact pages
- Improved frontend-backend communication

---

## Future Improvements

- [ ] Automated tests (Unit & Integration)
- [ ] Enhanced search and filtering capabilities
- [ ] Better handling for large audio uploads
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Social media integration
- [ ] Podcast episode management
- [ ] Expert verification system

---

## Screenshots

### **Home Page**

![Home Page](screenshots/homepage.png)

### **Podcast Detail**

![Podcast Detail](screenshots/podcast_detail.png)

### **Admin Panel**

![Admin Panel](screenshots/admin_panel.png)

### **Mobile Navigation**

![Mobile Navigation](screenshots/mobile_nav.png)

> To add your own screenshots, place images in a `screenshots/` folder and update the links above.

---

## Contact

- **Email:** info@connect-podcast-experts.com
- **Website:** [www.connect-podcast-experts.com](https://podcast-backend-4e5439705bd3.herokuapp.com/)
- **Location:** Stockholm, Sweden
- **Support:** Available through the Contact page on the website

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Acknowledgments

- Django and Django REST Framework for the robust backend
- React for the dynamic frontend
- Cloudinary for media management
- Bootstrap for responsive design components
- All contributors and testers who helped improve the platform
# Force deployment
# Force Heroku deployment with latest fixes
