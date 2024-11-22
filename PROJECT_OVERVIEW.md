
Jewelry E-commerce Web Application
This project is a jewelry e-commerce website built with React, TypeScript, and MongoDB Atlas, providing users with a seamless browsing and shopping experience.

Features
1. Product Filtering
Jewelry Type: Filter by categories such as necklaces, rings, bracelets, and earrings.
Collections: Unique themes such as "Luxury," "Classic," and "Vintage."
Dynamic Filtering:
Filters are synchronized with the backend and URL parameters.
Reset filters easily with a single click.
2. Sorting
Sort products by price:
Low to High
High to Low
Sorting is integrated with filtering and pagination for a seamless experience.
3. Pagination
Smooth pagination with:
Current page indicators.
Reset to page 1 automatically when filters or sorting are changed.
Backend integration ensures efficient data fetching for the current page only.
4. Accurate Product Count
Displays the total number of products matching the applied filters for user clarity.
5. Dynamic URL Parameters
Reflects filters, sorting, and pagination states in the URL:
Enables sharing of specific filtered product views.
Bookmark-friendly design.
6. Reset Filters
Clicking "All Products" or a jewelry type in the navigation bar resets all filters, sorting, and pagination to their defaults.
7. Static Navbar Categories
The navbar includes static jewelry categories (rings, necklaces, bracelets, earrings) for quick navigation.
No additional API calls for categories.
8. Bug Fixes and Optimizations
Resolved glitches in filtering, pagination, and sorting workflows.
Fixed navigation from the navbar to correctly apply the selected category filter.
Optimized synchronization between URL parameters and component states.
9. User Authentication (Login/Signup) (New Feature)
User Registration:
Users can create an account by providing a username and password.
Passwords are hashed using bcrypt before being saved to the database.
User Login:
Users log in by providing their credentials.
Backend generates a JWT token upon successful authentication.
JWT Authentication:
Stateless Sessions: JWT tokens manage user sessions without storing session data server-side.
Tokens are sent in the Authorization header for subsequent requests.
Session Management: Backend validates the token on each request.
10. Individual Product Page (New Feature)
Product Detail Page:
Each product now has a dedicated page displaying:
Product name, price, image, description, and available sizes.
Users can add products to their shopping bag and mark them as favorites.
Breadcrumb Navigation:
A breadcrumb helps users navigate back to previous pages like "Home" or product categories.
Dynamic Product Information:
Product details are dynamically fetched from the backend based on the product's unique ID.
Filters and Pagination Integration:
Product pages are connected to the global filtering and pagination system for efficient navigation.
11. Backend Integration (MongoDB)
The project is fully integrated with MongoDB Atlas, enabling dynamic fetching and filtering of product data.

API Endpoints
Products API: /api/products
Supports:
Pagination (page, limit query parameters).
Filtering by type, collection, minPrice, and maxPrice.
Sorting (priceLowToHigh, priceHighToLow).
Collections API: /api/products/collections
Fetches all unique product collections for the filter bar.
User Authentication
POST /users: Register a new user.
Hashes passwords before saving them.
POST /auth/login: User login.
Compares the provided password with the stored hashed password.
Returns a JWT token on successful login.
Product Details API: /api/products/:id
Fetches detailed information about a specific product (price, description, available sizes).
Backend Routes (Newly Added)
Authentication:

POST /users: Registers a new user and hashes the password.
POST /auth/login: Authenticates the user and returns a JWT token.
Products:

GET /products/:id: Fetches a single product by its ID, including details like price and description.
JWT Authentication Workflow
Login:
The backend generates a JWT token upon successful login.
The token is sent back to the client as a response.
JWT in Requests:
The frontend includes the token in the Authorization header for all requests requiring authentication (e.g., Authorization: Bearer <token>).
Backend Verification:
Each request's token is validated on the backend using a secret key.
If valid, the request proceeds; otherwise, an error is returned.
What We Added in this Update
JWT Authentication Middleware:
Protects secure routes by validating JWT tokens.
Tested successfully with Postman.
HTTPS Support:
Configured for secure communication with a private key and certificate.
Temporarily disabled for local testing.
User Authentication Endpoints:
Backend routes for user registration (POST /users) and login (POST /auth/login).
Protected Routes:
Added middleware to ensure only authenticated users can access protected resources.