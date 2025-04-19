# 🏠 RentOrbit

**RentOrbit** is a full-featured room rental platform that simplifies the process of finding or listing rental properties. It offers dedicated interfaces and dashboards for both tenants and landlords, making the rental journey easy, secure, and interactive.

---

## 📸 Preview

> ⚠️ Add screenshots or a video demo to showcase your app. Example:

![Homepage](./screenshots/homepage.png)
![Tenant Dashboard](./screenshots/tenant-dashboard.png)
![Landlord Dashboard](./screenshots/landlord-dashboard.png)

[🎥 Watch Demo Video](https://your-demo-link.com)

---

## ✨ Features

### 🔐 Authentication
- Secure registration & login for **Tenants** and **Landlords**
- JWT-based token authentication with role-based access
- Separate dashboards for each user type

### 🧑‍💼 Landlord Dashboard
- Add property with complete room details (location, price, description, etc.)
- Upload room images via **Cloudinary**
- Edit or delete listed rooms
- View tenant visit or booking requests
- Confirm or reject booking/visits
- Get real-time notifications when a tenant interacts with your listing

### 🧑‍💻 Tenant Dashboard
- Search for available rooms with filters (location, price, etc.)
- Request a visit for a room
- Confirm room booking after a successful visit
- Leave the room anytime and update room status
- View notification updates and personal profile

### 🧾 Other Features
- Responsive and mobile-friendly UI
- Form validation and error handling
- Real-time notifications using **Socket.io**
- Analytics and visual data with **Recharts**
- Time formatting and calculations with **Moment.js**

---

## 🛠️ Tech Stack

### 🌐 Frontend (React.js)
- `react` – Component-based UI
- `react-router-dom` – Routing and navigation
- `axios` – API interaction
- `react-hook-form` – Form validation and management
- `framer-motion` – Smooth animations and transitions
- `recharts` – Dashboard charts and graphs
- `lucide-react` – Icon set
- `jwt-decode` – JWT decoding on client
- `moment` – Date and time formatting
- `react-dnd` – Drag-and-drop (used if applicable)

### 🚀 Backend (Node.js + Express)
- `express` – RESTful API server
- `mongoose` – MongoDB database modeling
- `bcryptjs` – Password hashing
- `jsonwebtoken` – Token-based authentication
- `cloudinary` – Cloud image storage
- `multer` & `sharp` – Image uploading and optimization
- `socket.io` – Real-time communication
- `express-validator` – Backend input validation
- `dotenv` – Environment variable management
- `cors`, `body-parser` – API request handling
- `moment` – Date/time support

---

## ⚙️ Environment Setup

### 📌 Prerequisites
- Node.js and npm installed
- MongoDB (local or cloud)
- Cloudinary account for image storage

### 🔧 Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## 🔐 `.env` File Setup

### 🔧 Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret