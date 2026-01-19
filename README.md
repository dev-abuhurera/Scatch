# Bag Brand - Full Stack E-Commerce Platform

<img width="1920" height="939" alt="image" src="https://github.com/user-attachments/assets/b8339559-c43b-4522-a26a-b6bcb2d26b56" />


A full-stack e-commerce application for a bag brand, built from scratch using Node.js, Express, MongoDB, EJS, and Tailwind CSS. Features secure authentication, role-based access control, and follows best practices for scalable web development.

## 📋 Project Overview

This project demonstrates a professional-grade server-side application with separate roles for **customers** and **owners**, each with distinct functionalities and access levels.

## 🚀 Features

### Authentication & Authorization
- Secure user signup and login
- Session-based authentication with cookies
- Role-based access control (Customers vs Owners)
- Password hashing and user data protection

### User Roles
- **Customers**: Browse products, manage cart, place orders, view order history
- **Owners**: Admin dashboard, manage products, inventory control, order management

### Core Functionality
- Product catalog with detailed views
- Shopping cart and order processing
- User profile management
- Fully responsive design

## 🛠️ Tech Stack

**Frontend:**  
- EJS (templating)  
- Tailwind CSS (styling)  
- Vanilla JavaScript (client-side interactivity)  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB & Mongoose  

**Additional Tools:**  
- express-session, cookie-parser (session management)  
- bcrypt (password hashing)  
- dotenv (environment variables)  


## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Steps
1. Clone the repository:  
   ```
   git clone https://github.com/yourusername/bag-brand-mern.git
   
2. Install backend dependencies:
   ```
   cd server
   npm install
   
3. Create a .env file with required environment variables:
   ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    SESSION_SECRET=your_session_secret
   
4. Start the backend server:
   ```
    npm run dev

5. Install frontend dependencies and start client:
   ```
    cd ../client
    npm install
    npm start
   
6. Open http://localhost:3000 to view the app.
