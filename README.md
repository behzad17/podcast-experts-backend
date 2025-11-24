# CONNECT (Find Experts For Podcasts)

A full-stack web application for discovering, sharing, and managing contact between podcasters and experts. The platform provides a convenient and reliable way for experts and specialists to connect with podcasters and content creators.

- **Backend:** Django + Django REST Framework  
- **Frontend:** React  
- **Deployment:** Single Heroku app serving both API and compiled React build  
- **Media:** Cloudinary for images and profile pictures  

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Goals](#project-goals)
- [User Stories](#user-stories)
- [Frontend Pages Overview](#frontend-pages-overview)
- [Design & UX](#design--ux)
  - [Design Process & File Locations](#design-process--file-locations)
  - [Colour Palette](#colour-palette)
  - [Typography](#typography)
  - [UX Enhancements](#ux-enhancements)
- [Models Explained](#models-explained)
- [How the Site Works](#how-the-site-works)
- [LO4 – Front-End Interactivity & API Integration](#lo4--front-end-interactivity--api-integration-distinction-level-summary)
- [Frontend Architecture & React Features](#frontend-architecture--react-features)
  - [React Hooks Usage](#react-hooks-usage)
  - [Advanced JavaScript Features](#advanced-javascript-features)
  - [Reusable Components](#reusable-components)
- [Frontend URL](#frontend-url)
- [Admin Panel URL](#admin-panel-url)
- [API Endpoints](#api-endpoints)
- [How to Use the Site](#how-to-use-the-site)
- [Environment Variables](#environment-variables)
- [Installation (Local Setup)](#installation-local-setup)
- [Deployment](#deployment)
  - [Frontend Build & Deployment](#frontend-build--deployment)
  - [Backend Deployment Guide](#backend-deployment-guide)
- [CRUD Operations](#crud-operations)
  - [Overall CRUD Overview](#overall-crud-overview)
- [Testing](#testing)
  - [Backend API Testing](#backend-api-testing)
  - [Frontend Manual Testing](#frontend-manual-testing)
  - [API Testing (Postman, Browser, Django Admin)](#api-testing-postman-browser-django-admin)
- [Project Management (Agile)](#project-management-agile)
- [Future Improvements](#future-improvements)
- [Screenshots](#screenshots)
- [Wireframes](#wireframes)
- [Contact](#contact)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

---

## Project Overview

CONNECT is a platform where users can:

- Discover and browse podcasts  
- Create and manage their own podcasts (for podcasters)  
- Comment on and like podcasts  
- Communicate with experts and other users via messaging  
- Browse expert profiles and connect with industry specialists  
- Access comprehensive About and Contact pages  

The backend is built with **Django** and **Django REST Framework (DRF)**.  
The frontend is built with **React** and consumes the REST API via Axios.  
Media files (podcast images, expert pictures) are stored using **Cloudinary**.

---

## 🎯 Project Goals

### 1. User-Focused Goals

- Provide an easy way for users to discover podcasts and experts  
- Allow users to create profiles and interact through messaging  
- Offer a smooth, consistent user experience across all devices  
- Provide meaningful and clear feedback during navigation and form submission  

### 2. Technical Goals

- Build a modular and maintainable React frontend using reusable components  
- Expose a secure Django REST API for authentication and CRUD operations  
- Implement full validation on both frontend and backend  
- Use GitHub Issues, Milestones, and a Kanban board for Agile project management  

### 3. Accessibility & Responsiveness

- Full responsiveness across desktop, tablet, and mobile  
- Clear UI elements with sufficient contrast  
- Accessible form inputs, labels, and buttons  

### 4. Platform Purpose

- Create a hub where podcasters can showcase content  
- Enable experts to present their expertise and be discovered  
- Provide a reliable environment for communication between users and experts  

---

## 👥 User Stories

A selection of key user stories implemented in this project:

- As a **visitor**, I can browse podcasts so that I can discover interesting content.  
- As a **visitor**, I can view expert profiles so that I can learn about their expertise.  
- As a **user**, I can register and log in so that I can access additional features.  
- As a **podcaster**, I can create new podcasts so that I can share content with listeners.  
- As a **podcaster**, I can edit or delete my podcasts so that I can maintain up-to-date information.  
- As an **expert**, I can create and edit my expert profile so that others can see my skills and contact me.  
- As a **user**, I can leave comments on a podcast so that I can give feedback and start discussions.  
- As a **user**, I can reply to and edit my comments so that I can correct or extend my input.  
- As a **user**, I can send messages to other users/experts so that I can communicate privately.  
- As a **user**, I can bookmark podcasts or experts so that I can easily return to them later.  
- As a **user**, I can clearly see when I’m logged in and access a user menu with relevant options.  
- As an **admin**, I can manage users, podcasts, comments, and experts through the admin panel.

---

## 🗺 Frontend Pages Overview

The main React pages and their roles:

- **Home / Podcasts List** – Displays all podcasts with category-based filtering and search.  
- **Podcast Detail Page** – Shows full podcast information, comments, likes, and actions.  
- **Podcast Create / Edit Pages** – Forms for creating and updating podcasts (podcaster-only).  
- **Experts List** – Directory of experts with category filters.  
- **Expert Detail Page** – Detailed information about a single expert, plus option to send a message.  
- **Profile Page** – Allows logged-in users to view their profile and open the Profile Edit modal.  
- **Messages / Inbox** – Displays conversations and allows near real-time chat using polling.  
- **Auth Pages (Login / Register)** – Authentication flows for users.  
- **About Page** – Explains the purpose and background of the platform.  
- **Contact Page** – Provides a form and information for contacting the site owner.  

---

## Design & UX

### Design Process & File Locations

The design of the CONNECT / Podcast Experts platform followed a user-centred process:

1. **Research & Planning**  
   - Analysed common patterns in podcast and expert platforms.  
   - Defined user types (Visitor, Podcaster, Expert, Admin).  
   - Mapped key user journeys and use cases.

2. **Wireframing**  
   - Low-fidelity wireframes were created for all main pages.  
   - These guided layout decisions and UX flows.

3. **Layout & Components**  
   - Reusable components for cards, forms, modals, and navigation.  
   - Mobile-first responsive design.  

**Documentation locations:**

- **Wireframes:**  
  `docs/design/wireframes/`

- **Design Document (PDF):**  
  `docs/design/podcast_design_document_updated.pdf`

---

### Colour Palette

| Purpose              | Colour      | Hex       |
|----------------------|------------|----------|
| Primary Background   | Dark Gray  | `#1E1E1E` |
| Primary Text         | White      | `#FFFFFF` |
| Accent / Action      | Blue       | `#007BFF` |
| Secondary Background | Light Gray | `#F5F5F5` |
| Success              | Green      | `#28A745` |
| Error                | Red        | `#DC3545` |

Goals:

- WCAG-friendly contrast  
- Clear call-to-action elements  
- Professional, focused look  

---

### Typography

- **Primary Font:** `Inter`, fallback `Arial, sans-serif`  
- **Headings:** 600–700 weight, clear hierarchy  
- **Body Text:** 400 weight for readability  
- **Buttons & Labels:** Slightly bolder (500–600)  

Spacing and readability:

- Consistent vertical spacing between sections  
- Comfortable padding around cards and forms  
- Minimum 16px base font size  

---

### UX Enhancements

To improve user experience beyond basic functionality:

- **Toast notifications** using `react-toastify` for all major actions (create/edit/delete/comment/message).  
- **Inline form validation** with clear error messages and disabled submit buttons when input is invalid.  
- **Automatic modal closing** after successful actions (e.g. profile update, podcast edit via modal).  
- **Instant UI updates** via React state (no full page reloads).  
- **Clear login state** through a user dropdown: “Hi, username” with links to Profile, My Podcasts/Profile, Create, Messages, Admin (if applicable), and Logout.  
- **Responsive navigation** with a hamburger menu that auto-closes after selection on mobile.  

These decisions directly address previous feedback about UX clarity and user feedback.

---

## Models Explained

### 1. `CustomUser`

- Custom user model for authentication  
- Roles: listener, podcaster, expert, admin  

### 2. `PodcasterProfile`

- Linked one-to-one with `CustomUser`  
- Stores podcaster bio, website, social links  

### 3. `ExpertProfile`

- Linked one-to-one with `CustomUser`  
- Contains expertise areas, bio, website, social media, featured flag  
- Profile picture stored via Cloudinary  

### 4. `Category`

- Used to categorise podcasts and experts  
- Supports filtering and discovery  

### 5. `Podcast`

- Represents podcast entries  
- Fields: title, description, owner, category, image, link, approval, featured, timestamps  
- Full CRUD (owner-only editing & deletion)  

### 6. `PodcastComment`

- Nested comments and replies  
- Owner-only editing and deletion  

### 7. `PodcastLike`

- Tracks which users like which podcasts  

### 8. `UserMessage`

- Direct messages between users and experts  
- Conversation-level interactions  

### 9. `Bookmark`

- Users can bookmark podcasts and experts  

---

## How the Site Works

- **Browse Podcasts:** Anyone can access lists and detail pages.  
- **Register/Login:** Required to create podcasts, comment, like, and message.  
- **Podcasters:** Can create and manage their own podcasts.  
- **Experts:** Can create and maintain expert profiles.  
- **Users:** Can comment, reply, like, and bookmark content.  
- **Messaging:** Users and experts can exchange direct messages.  
- **Admin:** Manages all data in Django Admin.  
- **Responsive:** Layout works across desktop, tablet, and mobile.  

---

## LO4 – Front-End Interactivity & API Integration (Distinction-Level Summary)

The front-end of this project delivers a fully interactive, React-based user experience that consumes and manipulates API data from a Django REST backend. The application implements complete CRUD functionality across **Podcasts**, **Experts/Profiles**, **Comments**, and **Messaging**, with immediate UI updates through React state management and consistent toast notifications for success and error handling.

All forms include robust client-side validation (required fields, minimum length constraints, URL validation, whitespace prevention), inline error messages, and disabled submit buttons for invalid input. This ensures data integrity before interacting with the API and delivers a smooth, predictable user experience.

Authentication state is clearly represented through a redesigned navigation bar: logged-out users see only public navigation and authentication options, while logged-in users see a personalized user menu (`Hi, username`) containing **Profile**, **Create**, **Messages**, **My Podcasts/My Profile**, **Admin** (if applicable), and **Logout**. This directly addresses earlier assessor feedback regarding unclear login state.

UX behaviour is consistent and responsive:

- Modals close automatically when actions succeed  
- List views update instantly after CRUD operations  
- API errors are surfaced with friendly, high-level messages  
- No full page reloads are required  

Together, these features demonstrate strong competence in front-end engineering, API-driven UI design, and user-centred interaction patterns.

---

## Frontend Architecture & React Features

### React Hooks Usage

The frontend makes extensive use of React Hooks:

- `useState` – manages local state for forms, filters, modals, and message input.  
- `useEffect` – fetches data from the API on mount and when dependencies change (e.g. selected category, current chat).  
- Context usage – auth context to propagate user state and tokens.  

This functional, hook-based approach keeps components predictable and easier to test.

### Advanced JavaScript Features

Modern JavaScript/ES6+ is used throughout the codebase:

- `async/await` for API calls via Axios, improving readability and error handling.  
- Array methods (`map`, `filter`, `reduce`) to shape lists and collections before rendering.  
- Axios interceptors to automatically attach JWT tokens and handle 401/403 responses globally.  
- Destructuring, template literals, and optional chaining for concise logic.  

### Reusable Components

Key reusable components include:

- **`Navbar`** – central navigation with login state awareness.  
- **`PodcastCard` / `ExpertCard`** – reused across multiple list views.  
- **`PodcastEditModal`** – used to edit podcasts in place within the list.  
- **`ProfileEditModal`** – for editing profile data without leaving the page.  
- **`MessageButton`** – standardised entry point to send messages from various contexts.  
- **`CommentSection`** – encapsulates nested comment display and comment/reply/edit/delete logic.  

These patterns help keep the code DRY, readable, and maintainable.

---

## Frontend URL

- **Main Site:**  
  https://podcast-backend-4e5439705bd3.herokuapp.com/

Frontend and backend are served from the same Heroku application.

---

## Admin Panel URL

- **Admin Panel:**  
  https://podcast-backend-4e5439705bd3.herokuapp.com/admin/

Staff users only.

---

## API Endpoints

### Podcasts

- `GET /api/podcasts/` – List podcasts  
- `GET /api/podcasts/<id>/` – Podcast detail  
- `POST /api/podcasts/create/` – Create podcast  
- `PUT /api/podcasts/<id>/` – Update podcast  
- `DELETE /api/podcasts/<id>/` – Delete podcast  
- `GET /api/podcasts/categories/` – List categories  

### Comments

- `GET /api/podcasts/<id>/comments/` – List comments for a podcast  
- `POST /api/podcasts/<id>/comments/` – Create comment/reply  

### Reactions

- `GET /api/podcasts/<id>/reactions/`  
- `POST /api/podcasts/<id>/reactions/`  
- `DELETE /api/podcasts/<id>/reactions/<reaction_id>/`  

### Experts

- `GET /api/experts/`  
- `GET /api/experts/<id>/`  
- `POST /api/experts/`  
- `PUT /api/experts/<id>/`  
- `DELETE /api/experts/<id>/`  

### Authentication

- `POST /api/auth/register/`  
- `POST /api/auth/login/`  
- `POST /api/auth/logout/`  

### User Messages

- `GET /api/messages/`  
- `POST /api/messages/`  

---

## How to Use the Site

1. Visit the main site.  
2. Register for an account or log in.  
3. Browse podcasts or filter by category.  
4. Click a podcast to see details, comments, and likes.  
5. Create your own podcast (as a podcaster).  
6. Comment on podcasts and interact with experts.  
7. Bookmark favourite content.  
8. Explore expert profiles and send messages.  
9. Use the responsive navigation on all devices.  

---

## Environment Variables

Create a `.env` file in the project root and add values similar to:

```bash
# Django Settings
SECRET_KEY=your-actual-secret-key-here
DEBUG=True

# Database Configuration
DATABASE_URL=sqlite:///db.sqlite3

# Email Configuration
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret


## 🛠 Installation (Local Setup)

### Backend (Django + DRF)

```bash
git clone <repository-url>
cd podcast-experts-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # if provided
# Edit .env with your configuration
python manage.py migrate
python manage.py loaddata db_backup_cleaned.json   # optional sample data
python manage.py createsuperuser
python manage.py runserver
```

The API will be available at:  
**http://127.0.0.1:8000/**

---

## 🚀 Deployment

The project is deployed on **Heroku**, using:
- Gunicorn  
- WhiteNoise  
- Cloudinary for media  

---

## 🧱 Frontend Build & Deployment (React)

### Build React locally:

```bash
cd frontend
npm install
npm run build
```

React generates a production-ready folder:  
`frontend/build/`

---

### Two deployment methods:

#### **Option A — Copy React build into Django**

```
backend/
  static/
  staticfiles/
  frontend_build/   ← place the React build here
```

#### **Option B — Serve React build directly (recommended)**

```python
STATICFILES_DIRS = [ BASE_DIR / 'frontend/build' ]
TEMPLATES[0]['DIRS'] = [ BASE_DIR / 'frontend/build' ]
MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")
```

---

### React Environment Variables (set at build time)

```bash
REACT_APP_API_BASE_URL="https://your-api.com" \
REACT_APP_WEBSITE_URL="https://your-frontend.com" \
npm run build
```

---

## ☁️ Deploy to Heroku

```bash
git add frontend/build
git commit -m "Add updated React production build"
git push heroku main
```

Heroku will:
- Install backend dependencies  
- Install frontend dependencies  
- Build React  
- Run collectstatic  
- Serve via WhiteNoise  

Final app URL:
```
https://your-heroku-app.herokuapp.com/
```

---

## 🔧 Backend Deployment Settings

Install required packages:

```bash
pip install gunicorn whitenoise dj-database-url psycopg[binary] django-cors-headers
```

### `settings.py`

```python
import dj_database_url, os

DEBUG = False
SECRET_KEY = os.getenv("SECRET_KEY")
ALLOWED_HOSTS = ["your-domain.com", "podcast-backend-4e5439705bd3.herokuapp.com"]

DATABASES = {
    "default": dj_database_url.config(default=os.getenv("DATABASE_URL"))
}

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
```

### Procfile

```
web: gunicorn backend.wsgi
```

### First-time deployment

```bash
heroku create your-app-name
heroku config:set SECRET_KEY="..."
heroku config:set DATABASE_URL="..."
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

---

## 📦 CRUD Operations

### Podcasts CRUD

| Operation | Endpoint | Description | Status |
|----------|----------|-------------|--------|
| Create | POST /api/podcasts/create/ | Create new podcast | ✅ |
| Read | GET /api/podcasts/ | Public list | ✅ |
| Detail | GET /api/podcasts/<id>/ | View single podcast | ✅ |
| Update | PUT /api/podcasts/<id>/ | Owner only | ✅ |
| Delete | DELETE /api/podcasts/<id>/ | Owner only | ✅ |

---

### Expert Profiles CRUD

| Operation | Endpoint | Description | Status |
|----------|----------|-------------|--------|
| Create | POST /api/experts/ | Create expert profile | ✅ |
| Read | GET /api/experts/ | Public expert list | ✅ |
| Detail | GET /api/experts/<id>/ | Expert detail | ✅ |
| Update | PUT /api/experts/<id>/ | Owner only | ✅ |
| Delete | DELETE /api/experts/<id>/ | Optional | ✅ |

---

### Messages CRUD

| Operation | Description | Status |
|----------|-------------|--------|
| Create | Send messages between users | ✅ |
| Read | Inbox + conversation threads | ✅ |
| Update | Not required | ❌ |
| Delete | Not implemented | ⚠️ |

---

### User Profiles CRUD

| Operation | Description | Status |
|----------|-------------|--------|
| Create | Auto-created | N/A |
| Read | View profile | ✅ |
| Update | Profile edit modal | ✅ |
| Delete | Not in scope | ❌ |

---

## 🧪 Testing

### Backend API Testing (Postman)

| Scenario | Expected Result | Status |
|----------|----------------|--------|
| Login | JWT tokens returned | ✅ |
| Register | 201 status | ✅ |
| Unauthorized create | 401 | ✅ |
| Update podcast | 200 | ✅ |
| Delete podcast | 204 | ✅ |
| List podcasts | JSON list | ✅ |

---

### Frontend Testing

- User can register and is redirected with a success message.
- User can log in and sees the updated navbar with user dropdown.
- Create podcast → toast notification + new item in the list.
- Update podcast → changes are visible immediately.
- Delete podcast → confirmation modal + removal from list.
- Search and category filter → display relevant podcasts.
- Expert profile create/edit → works with URL validation and toasts.
- Comments CRUD → create/edit/delete with inline validation and toasts.
- Messages → send via chat window and modal with success/error toasts.
- Responsive design → navbar and hamburger menu work correctly on mobile.
---

### API Testing Tools

- **Postman**  
- **Browser DevTools**  
- **Django Admin**

Ensures requirements for:
- **LO3.7** CRUD on API  
- **LO3.10** Endpoint testing  
- **LO4.4** Error handling  
- **LO4.5** No functional defects  

# Project Management (Agile)
This project followed an Agile-inspired workflow using GitHub:
GitHub Issues to track features, bugs, and tasks
MoSCoW prioritisation to separate Must/Should/Could/Won’t-have items
Milestones to group work into meaningful releases
Kanban Project Board to visualise progress from Backlog → To Do → In Progress → Done
Project Board:
GitHub Project Board

# Future Improvements
Automated unit and integration tests
Advanced search and filtering (multi-field, tags)
Better handling for large audio uploads
Real-time notifications (WebSockets)
Analytics dashboard for podcasters and experts
Social media integrations and deep links
Podcast episode management
Expert verification / endorsement system


## 📸 Screenshots

### Home Page
![Home Page](screenshots/homepage.png)

### Podcast Detail
![Podcast Detail](screenshots/podcast_detail.png)

### Admin Panel
![Admin Panel](screenshots/admin_panel.png)

### Mobile Navigation
![Mobile Navigation](screenshots/mobile_nav.png)

---

## 🗂 Wireframes

Low-fidelity wireframes for the main pages:

![Wireframes](docs/design/wireframes/wireframes.png)

These cover:
- Home  
- Registration  
- Login  
- Podcast List  
- Podcast Detail  
- Expert Create  
- Expert Detail  
- Messages / Inbox  
- Contact  

---

## 📞 Contact

- **Email:** info@connect-podcast-experts.com  
- **Website:** https://podcast-backend-4e5439705bd3.herokuapp.com/  
- **Location:** Stockholm, Sweden  
- Support is also available via the Contact page.

---

## 📄 License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch:  
   ```bash
   git checkout -b feature/AmazingFeature

3. Commit your changes:
git commit -m "Add some AmazingFeature"
4. Push the branch:
git push origin feature/AmazingFeature
5. Open a Pull Request


# Acknowledgments
Django & Django REST Framework
React
Cloudinary
Bootstrap
Code Institute (project structure & assessment style)
All testers and contributors who helped improve the platform