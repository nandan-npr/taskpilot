# TaskPilot — Smart Workflow Task Manager

TaskPilot is a full-stack smart task manager application built for the INDPRO Intern Assignment. It allows users to register, login, create tasks, update tasks, delete tasks, and manage tasks across three workflow stages: Todo, In Progress, and Done.

The project goes beyond a basic task manager by adding task health indicators, productivity analytics, activity tracking, and a focus mode experience.

---

## Live Links

Frontend Live Link: Add after deployment  
Backend Live Link: Add after deployment  
GitHub Repository: Add after pushing to GitHub

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected dashboard routes
- User-specific task data
- Logout functionality

### Task Management

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Move tasks between Todo, In Progress, and Done
- Add task priority
- Add due date
- Add task description

### Smart Workflow Features

- Task health status
  - Healthy
  - Needs Attention
  - High Risk
  - Overdue
- Dashboard analytics
- Activity timeline
- Focus mode with 25-minute timer
- Stage update from focus mode
- Responsive user interface
- Loading and error states
- Empty state handling

---

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- React Toastify
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js
- CORS
- dotenv

### Database

- MongoDB Atlas

---

## Project Structure

```txt
taskpilot/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md