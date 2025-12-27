TaskFlow – Full Stack Task Management System

TaskFlow is a full-stack task management web application developed as a capstone project using modern web technologies. It allows users to register, login, and manage their daily tasks with role-based access.

🔧 Tech Stack

Frontend

React + TypeScript

Vite

Tailwind CSS

Axios

Backend

Node.js

Express.js

Database

MySQL

✨ Features

User Registration & Login (JWT Authentication)

Role-based access (Admin / User)

Create, View and Delete Tasks

Secure API with Token Validation

Clean responsive UI with animations

📂 Project Structure
TaskFlow-Capstone/
├── backend/
└── frontend/

▶ How to Run the Project
Backend Setup
cd backend
npm install
npx nodemon server.js


Server runs on:
http://localhost:5000

Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs on:
http://localhost:5173

🗄 Database

MySQL is used for storing users and tasks.

Connection details are stored in .env file inside the backend folder.
