# 🎓 AI-Driven Learning Platform

## 🧠 Overview

This project is a mini learning platform that leverages Artificial Intelligence to provide personalized lessons based on user-selected topics and prompts. Users can register, log in, choose categories and sub-categories, submit learning prompts to an AI model, receive generated lessons, and review their learning history. An Admin Dashboard is also included for user and prompt history management.

The platform is built with a focus on modular architecture, security, robust error handling, and maintainability.

---

## ✨ Features

### 🔧 Backend
- RESTful API: Structured and well-defined endpoints.
- PostgreSQL + Prisma: Efficient data management and ORM.
- OpenAI GPT: Lesson generation via GPT models.
- JWT Authentication: Secure access control.
- Role-based Authorization: User/Admin access levels.
- Input Validation: Zod schemas for robust data validation.
- Centralized Error Handling: Consistent API error responses.
- Security: Helmet for HTTP header security, rate limiting to prevent abuse.
- Logging: Winston for debugging and monitoring.
- Full TypeScript Support: Enhanced code quality and maintainability.
- Swagger/OpenAPI Documentation: Interactive API docs at `/api-docs`.

### 💻 Frontend
- Authentication: User registration and login flows.
- Category & Sub-Category Selection: Intuitive interface for choosing learning topics.
- Prompt Submission Interface: Easy way to submit learning requests to the AI.
- AI Lesson Display: Clear presentation of AI-generated responses.
- Learning History Tracking: Users can view their past lessons.

### 🛠️ Admin Dashboard
- User list and detailed prompt history for any user.
- User role management.
- User deletion and profile updates.
- Pagination and filtering for efficient data navigation.

---

## 🛠️ Technologies Used

### Backend:
- Node.js (TypeScript)
- Express.js
- PostgreSQL
- Prisma (ORM)
- OpenAI GPT API
- JWT, Bcrypt
- Helmet, Express Rate Limit
- Zod
- Winston
- Swagger UI Express, YAMLJS

### Frontend:
- React (TypeScript)
- Redux Toolkit
- Tailwind CSS
- React Hook Form
- Lucide Icons
- Axios

### DevOps & Tooling:
- Docker, Docker Compose
- ESLint, Prettier
- Git, GitHub

---

## 🧱 Architecture

The platform follows a classic client-server architecture with clear separation of concerns:

```
Client (React)
   |
REST API (Express.js)
   |
Middleware (Authentication, Validation, Error Handling)
   |
Controllers -> Services -> Prisma (ORM) -> PostgreSQL (Database)
   |
OpenAI API (accessed via a dedicated prompt service)
```

Frontend: A React application consumes the RESTful API.  
Backend: An Express.js server built with TypeScript handles all business logic.  
Database Interaction: Prisma ORM manages interactions with PostgreSQL.  
AI Integration: OpenAI API is called through a dedicated service layer.  
Validation: Zod schemas are used extensively for input validation.  
Layered Separation: Backend organized into Routes, Controllers, Services, Database access.

---

## 🚀 Setup Instructions

### ✅ Prerequisites
- Node.js (v18+)
- npm or Yarn
- Docker and Docker Compose

### 1. Clone the Repository
```bash
git clone https://github.com/TziviZl/AI-Learning-Platform.git
cd AI-Learning-Platform
```

### 2. Environment Variables
Create a **single `.env` file** in the **root directory** of your project (e.g., `AI-Learning-Platform/.env`). This file will be loaded automatically by Docker Compose and its variables will be passed to the relevant services.

**`./.env` (Root Environment Variables)**

```dotenv
# Database Credentials (used by 'db' service in docker-compose.yml)
# These values configure the PostgreSQL database container.
DB_NAME=learning_db
DB_USER=myuser
DB_PASSWORD=mypass

# Backend Application Configuration (variables passed to 'backend' service)
# DATABASE_URL_LOCAL is used by docker-compose to construct the DATABASE_URL environment variable inside the backend container.
# This URL specifies how the backend connects to the database service within the Docker network.
# Ensure that DB_USER, DB_PASSWORD, and DB_NAME here match the values above.
DATABASE_URL_LOCAL="postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}?schema=public"
OPENAI_API_KEY="sk-proj-YOUR_OPENAI_API_KEY_HERE" # Replace with your actual OpenAI API Key (entire string on one line).
JWT_SECRET=supersecretkey # Replace with a strong, random, and unique string.

NODE_ENV=development

# CORS Origin (Important for Frontend-Backend communication)
# For local development, this should be the URL of your frontend.
CORS_ORIGIN=http://localhost:5173 
```
### 3. Install Dependencies

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 4. Make Entrypoint Executable

This step ensures that the entrypoint scripts within the Docker containers have execution permissions and are correctly formatted for a Linux environment.

1.  **Grant Execution Permissions (if on Unix-like OS):**
    If you are on a Unix-like operating system (Linux, macOS), you might need to ensure the entrypoint script has execution permissions:
    ```bash
    chmod +x frontend/docker-entrypoint.sh
    ```
    **Note for Windows Users (Docker Desktop):** You typically **do not need to execute this `chmod` command manually** in your Windows terminal. Docker Desktop handles file permissions automatically when copying files into Linux-based containers.

2.  **Ensure Correct Line Endings (Crucial for Windows Users):**
    For the `docker-entrypoint.sh` file located in the `frontend/` directory, it is **critical** that its line endings are set to **LF (Line Feed)**, which is the standard for Linux/Unix systems. Windows often defaults to **CRLF (Carriage Return and Line Feed)**, which can cause "no such file or directory" errors in Linux containers.

    * Open `frontend/docker-entrypoint.sh` in a robust code editor (like Visual Studio Code, Notepad++, or Sublime Text).
    * Find the "line endings" or "EOL (End of Line) Conversion" setting in your editor (often in the status bar at the bottom, or under the `View` / `Edit` menu).
    * Change the setting from `CRLF` (or anything else) to **`LF`**.
    * Save the file after making this change.

    Regardless of your operating system, Docker will ensure the script has the correct execution permissions inside the container during the build process, but correct line endings are essential for it to run successfully.
### 5. Run with Docker Compose
```bash
docker-compose up -d --build
```

This will:
- Build images
- Start PostgreSQL
- Run Prisma migrations and seeds
- Start backend and frontend

---

## 🌐 Access Points

| Service          | URL                                                                 |
|------------------|----------------------------------------------------------------------|
| 🛢️ Database       | `localhost:5432`                                                   |
| 🔙 Backend API    | http://localhost:5000                                                |
| 📘 Swagger UI     | http://localhost:5000/api-docs                                       |
| 💻 Frontend App   | http://localhost:5173                                                |

---

## ☁️ Live Deployment (Render)

| Service          | URL                                                                 |
|------------------|----------------------------------------------------------------------|
| 🔙 Backend API    | https://ai-learning-platform-okxq.onrender.com                      |
| 📘 Swagger UI     | https://ai-learning-platform-okxq.onrender.com/api-docs            |
| 💻 Frontend App   | https://ai-learning-platform-1-7kpk.onrender.com                   |

---

## 📘 API Endpoints

| Endpoint                         | Method | Auth  | Description                           |
|----------------------------------|--------|-------|---------------------------------------|
| `/auth/register`                | POST   | None  | Register a new user                   |
| `/auth/login`                   | POST   | None  | Log in an existing user               |
| `/users/me`                     | PATCH  | User  | Update authenticated user's profile   |
| `/users/:id/prompts`           | GET    | User  | Get user's learning history           |
| `/categories`                   | GET    | None  | List all categories                   |
| `/categories/:id/sub-categories`| GET   | None  | Get sub-categories by category        |
| `/prompts`                      | POST   | User  | Submit a new learning prompt          |
| `/admin/users`                  | GET    | Admin | List all users                        |
| `/admin/users/:id/prompts`     | GET    | Admin | Get all prompts for a specific user   |
| `/admin/users/:id`             | PATCH  | Admin | Update user profile by ID             |
| `/admin/users/:id`             | DELETE | Admin | Delete user by ID                     |

---


## 📞 Contact 
📧 Tzivi9763@gmail.com  
For bug reports, questions, or feedback.


