Project Overview
Project Name: JewelryShop Web App
Overview
JewelryShop is an e-commerce web application for showcasing and selling jewelry. It includes features like user authentication, dynamic product listings, an admin panel for product management, and a fully responsive design. Built using the MERN stack, it incorporates modern development practices and a clean UI.

Key Features
User Authentication:

Users can sign up, log in, and log out.
JWT-based authentication with secure token storage in localStorage.
Profile page displays user information.
Protected routes for user-specific data.
Admin Panel:

Manage products: Add, update, and delete products.
View all products in a scrollable table sorted by the most recently added.
Access protected admin routes with middleware for role-based control.
Product Features:

Dynamic product categories such as Rings, Necklaces, Bracelets, and Earrings.
Individual product detail pages with relevant information.
Sorting and filtering options for products.
Navigation:

A responsive navbar that updates dynamically based on the user's login state.
Drawer-based navigation for mobile users.
Search functionality for products.
Cart and Checkout:

Users can dynamically add, remove, and update product quantities in the cart.
Cart badge reflects the total quantity of items dynamically.
Backend PUT API supports quantity updates.
Real-time UI updates without requiring page refreshes.
Complete checkout flow:
Select between home delivery or parcel shop pickup.
Integration with Stripe for payment.
Order confirmation email sent after successful checkout.
My Account Section:

Orders Tab:
Show all past orders with statuses: In Progress, Completed, and Return.
Allow initiating returns with email notifications for return labels.
Favourites Tab:
Display a list of favorite products.
Allow users to remove items from their favorites.
User Information Tab:
Editable form for user details (first name, last name, email, etc.).
Password update functionality.
Backend:

Built using Node.js and Express.
MongoDB as the database for user, product, and order management.
API endpoints tested via Postman.
Email confirmation using Nodemailer.
Current Progress
Authentication:

Implemented secure signup, login, and logout functionality.
Used bcrypt for password hashing and JWT for session management.
Tested authentication endpoints with Postman.
Navbar dynamically updates based on login state.
Admin Panel:

Fully functional admin panel with protected routes.
Add, edit, and delete products with a responsive UI.
Products sorted by most recently added in the table.
Frontend:

Pages created:
Front Page
Login Page
Signup Page
Profile Page
Product Pages (dynamic categories)
Admin Pages (Product and Order Management)
Cart Page with interactive quantity updates
Checkout Pages (Delivery, Billing, and Confirmation)
Fully responsive design using Chakra UI.
Backend:

Connected to MongoDB Atlas.
API endpoints implemented for users, authentication, products, cart, and orders.
Middleware for JWT token validation and role-based control.
Dynamic cart handling with PUT and DELETE routes.
Backend logic for delivery options (home and parcel shop).
Integrated Stripe for payment.
Nodemailer for email confirmations.
Tested endpoints with Postman and verified full API integration.


Technologies Used
Frontend: React.js, TypeScript, Chakra UI
Backend: Node.js, Express.js, MongoDB
Others: Postman, Axios, JWT, bcrypt, Stripe, Nodemailer