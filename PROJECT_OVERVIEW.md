# Project Overview

## **Project Name**: JewelryShop Web App

### **Overview**
JewelryShop is an e-commerce web application for showcasing and selling jewelry. It includes features like user authentication, dynamic product listings, and a fully responsive design. Built using the MERN stack, it incorporates modern development practices and a clean UI.

---

### **Key Features**
- **User Authentication**:
  - Users can sign up, log in, and log out.
  - JWT-based authentication with secure token storage in `localStorage`.
  - Profile page displays user information.
  - Protected routes for user-specific data.

- **Product Features**:
  - Dynamic product categories such as Rings, Necklaces, Bracelets, and Earrings.
  - Individual product detail pages with relevant information.

- **Navigation**:
  - A responsive navbar that updates dynamically based on the user's login state.
  - Drawer-based navigation for mobile users.
  - Search functionality for products.

- **Backend**:
  - Built using Node.js and Express.
  - MongoDB as the database for user and product management.
  - API endpoints tested via Postman.

---

### **Current Progress**
1. **Authentication**:
   - Implemented secure signup, login, and logout functionality.
   - Used bcrypt for password hashing and JWT for session management.
   - Tested authentication endpoints with Postman.
   - Navbar dynamically updates based on login state.

2. **Frontend**:
   - Pages created:
     - Front Page
     - Login Page
     - Signup Page
     - Profile Page
     - Product Pages (dynamic categories)
   - Fully responsive design using Chakra UI.

3. **Backend**:
   - Connected to MongoDB Atlas.
   - API endpoints implemented for users, authentication, and products.
   - Middleware for JWT token validation.

---

### **Next Steps**
1. **Product Features**:
   - Complete product listing and detail pages.
   - Add filtering and sorting for products.

2. **Cart and Checkout**:
   - Implement cart functionality.
   - Integrate payment gateway.

3. **Testing**:
   - Add more robust error handling.
   - Write tests for critical components and backend routes.

4. **Deployment**:
   - Deploy backend to a hosting provider.
   - Connect the frontend with the deployed backend.

---

### **Technologies Used**
- **Frontend**: React.js, TypeScript, Chakra UI
- **Backend**: Node.js, Express.js, MongoDB
- **Others**: Postman, Axios, JWT, bcrypt

---

### **Git Commit History**:
See commit messages for specific changes.

