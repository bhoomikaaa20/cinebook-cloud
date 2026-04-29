# 🎬 Cinemati – Movie Ticket Booking Platform

A full-stack movie ticket booking application built using the **MERN stack (MongoDB, Express, React, Node.js)**.
Users can browse movies, view showtimes, select seats, and book tickets, while admins can manage movies, shows, and bookings.

---

## 🚀 Features

### 👤 User Features

* 🔐 User Authentication (JWT-based)
* 🎥 Browse Movies
* 📅 View Showtimes
* 🎟️ Select Seats
* 💳 Book Tickets
* 📜 View Booking History

### 🛠️ Admin Features

* ➕ Add / Delete Movies
* 🎬 Manage Shows
* 📊 View All Bookings

---

## 🧱 Tech Stack

### Frontend

* React (TypeScript)
* React Router
* Tailwind CSS
* Axios / Fetch API

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

## 📁 Project Structure

```
cinebook-cloud/
│
├── client/        # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── hooks/
│
├── server/        # Node.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone Repository

```bash
git clone https://github.com/your-username/cinemati.git
cd cinemati
```

---

### 🔹 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run server:

```bash
npm run dev
```

---

### 🔹 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Authentication Flow

1. User signs up / logs in
2. JWT token is generated
3. Token stored in localStorage
4. Protected routes use middleware (`protect`)
5. Admin routes use role-based access

---

## 📡 API Endpoints

### Auth

* `POST /api/auth/signup`
* `POST /api/auth/login`
* `GET /api/auth/me`

### Movies

* `GET /api/movies`
* `GET /api/movies/:id`

### Shows

* `GET /api/shows/movie/:id`

### Bookings

* `POST /api/bookings`
* `GET /api/bookings/my`

### Admin

* `POST /api/admin/movies`
* `DELETE /api/admin/movies/:id`
* `POST /api/admin/shows`
* `DELETE /api/admin/shows/:id`
* `GET /api/admin/bookings`

---

## 🧠 Key Concepts Used

* RESTful API Design
* JWT Authentication
* Role-based Authorization
* MongoDB Relationships (Refs & Populate)
* State Management with React Hooks
* Error Handling & Validation

---

## ⚠️ Known Issues / Notes

* Ensure valid MongoDB ObjectIds are used
* Avoid stale/invalid references in DB
* Clean test data if needed

---

