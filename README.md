# Todo App (Fullstack: React + Node.js/Express + MongoDB)

A beautiful, modern, and fully responsive Todo application with calendar-based task management, daily/weekly progress tracking, and persistent storage using MongoDB. Built with a React frontend and a Node.js/Express backend.

---

## 🚀 Features
- Add, complete, and delete todos with a clean UI
- Calendar view to select and filter tasks by date
- Daily and weekly progress bars
- Persistent storage in MongoDB (no more lost tasks!)
- Responsive design for desktop, tablet, and mobile
- Backend REST API for all CRUD operations

---

## 🛠️ Tech Stack
- **Frontend:** React, Axios, React Calendar, date-fns, React Icons, Vite
- **Backend:** Node.js, Express, Mongoose, MongoDB, CORS

---

## 📁 Folder Structure
```
Cursor-todo/
│
├── server/                # Backend (Node.js + Express + MongoDB)
│   ├── index.js
│   ├── package.json
│   └── ...
│
├── src/                   # Frontend (React)
│   ├── App.jsx
│   ├── App.css
│   └── ...
├── package.json           # Frontend package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. **Backend (Node.js + Express + MongoDB)**

1. **Open a terminal and create the backend folder:**
   ```sh
   mkdir server
   cd server
   ```
2. **Initialize Node.js project:**
   ```sh
   npm init -y
   ```
3. **Install dependencies:**
   ```sh
   npm install express mongoose cors
   ```
4. **Create `index.js` in `server/` and paste the backend code.**
5. **Start MongoDB locally:**
   - Make sure MongoDB is installed and running (`mongod`)
6. **Start the backend server:**
   ```sh
   node index.js
   ```
   The backend will run at `http://localhost:5000`.

### 2. **Frontend (React)**

1. **Install dependencies (from the project root):**
   ```sh
   npm install
   npm install axios
   ```
2. **Start the React app:**
   ```sh
   npm run dev
   ```
   The frontend will run at `http://localhost:5173` (or similar).

---

## 🔄 Data Flow & API Endpoints

- **Frontend** uses Axios to communicate with the backend API.
- **Backend** exposes RESTful endpoints:
  - `GET    /api/todos`         → Get all todos
  - `POST   /api/todos`         → Add a new todo
  - `PUT    /api/todos/:id`     → Update a todo (mark as done, edit, etc.)
  - `DELETE /api/todos/:id`     → Delete a todo
- **MongoDB** stores all todos with fields: `text`, `done`, `created`, `completedAt`, `date`.
- **Frontend** fetches todos on load, and updates UI in real-time as you add/complete/delete tasks.

---

## 📝 Project Workflow (Step by Step)

1. **User opens the app**
   - React fetches all todos from the backend API.
2. **User adds a new todo**
   - Todo is sent to the backend and stored in MongoDB.
   - UI updates instantly with the new task.
3. **User marks a todo as done**
   - The backend updates the todo's `done` and `completedAt` fields.
   - Progress bars update to reflect daily/weekly completion.
4. **User deletes a todo**
   - The backend removes the todo from MongoDB.
   - UI updates to remove the task.
5. **User selects a date on the calendar**
   - Todos are filtered by the selected date.
   - Progress bars and stats update accordingly.

---

## 📊 Progress Bars
- **Daily Progress:** Fills based on the number of tasks completed today (target: 5).
- **Weekly Progress:** Fills based on the number of tasks completed this week (target: 20).
- Progress bars update in real-time as you complete tasks.

---

## 🧩 Miscellaneous & Tips
- **MongoDB:** Make sure your local MongoDB server is running (`mongod`).
- **Backend Port:** The backend runs on port 5000 by default. Change in `server/index.js` if needed.
- **Frontend API URL:** The React app expects the backend at `http://localhost:5000/api/todos`.
- **Styling:** All styles are in `src/App.css` and are fully responsive.
- **Calendar:** Uses `react-calendar` for date selection and filtering.
- **Icons:** Uses `react-icons` for a modern look.
- **Development:** Use `nodemon` for backend auto-reload (optional: `npm install -g nodemon`).

---

## 💡 Credits & Inspiration
- Built with ❤️ using React, Node.js, Express, and MongoDB.
- Inspired by modern productivity apps and best UX practices.

---

Enjoy your fullstack Todo App!
