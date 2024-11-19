# Jewelry E-commerce Web Application

This project is a jewelry e-commerce website built with React and TypeScript. 

**SO FAR** it includes a product grid with filtering options based on jewelry type and collections, allowing users to easily browse products.

## Features

- **Product Filtering**: Filter products based on type (e.g., necklaces, rings) and collection (e.g., Luxury, Classic).
- **Sorting**: Sort products by price (Low to High / High to Low).
- **Static Navbar**: The navbar now uses static data for categories, avoiding the need for an API call for categories.
- **Dynamic URL Parameters**: Filters are reflected in the URL, making it easier to share specific product views.
- **Reset Filters**: When clicking "All Products", all filters are reset.

## MongoDB Integration (Currently Disabled)

The project was initially designed to use MongoDB Atlas for dynamic data (e.g., categories). However, since we switched to a static navbar, the MongoDB integration is no longer used in the frontend.

### Current State:
- The MongoDB Atlas integration is **commented out** for future use.
- The connection to MongoDB and the fetching of categories from the database has been removed from the active codebase.
- You can re-enable MongoDB integration in the future if dynamic categories are needed.

## Installation

1. Clone the repository.
2. Install the dependencies:

   ```bash
   npm install
