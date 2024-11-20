Jewelry E-commerce Web Application
This project is a jewelry e-commerce website built with React, TypeScript, and MongoDB Atlas, providing users with a seamless browsing and shopping experience.

Features
1. Product Filtering
Users can filter products by:
Jewelry Type: Categories like necklaces, rings, bracelets, and earrings.
Collections: Unique themes such as "Luxury," "Classic," and "Vintage."
Dynamic Filtering:
Filters are synchronized with the backend and URL parameters.
Reset filters easily with a single click.
2. Sorting
Sort products by price:
Low to High
High to Low
Sorting is integrated with the filtering and pagination system for a seamless experience.
3. Pagination
Smooth pagination with:
Current page indicators.
Reset to page 1 automatically when filters or sorting are changed.
Backend integration ensures efficient fetching of data for the current page only.
4. Accurate Product Count
Displays the total number of products matching the applied filters, ensuring clarity for users.
5. Dynamic URL Parameters
Filters, sorting, and pagination states are reflected in the URL:
Enables sharing of specific filtered product views.
Bookmark-friendly design.
6. Reset Filters
Clicking "All Products" or a jewelry type in the navigation bar resets all filters, sorting, and pagination to their defaults.
7. Static Navbar Categories
The navbar includes static jewelry categories (rings, necklaces, bracelets, earrings) for quick navigation.
Eliminates the need for additional API calls for categories.
8. Bug Fixes and Optimizations
Resolved glitches in filtering, pagination, and sorting workflows.
Fixed navigation from the navbar to correctly apply the selected category filter.
Optimized synchronization between URL parameters and component states.
Backend Integration (MongoDB)
The project is fully integrated with MongoDB Atlas, enabling dynamic fetching and filtering of product data.

API Endpoints:
Products API: /api/products

Supports:
Pagination (page, limit query parameters).
Filtering by type, collection, minPrice, and maxPrice.
Sorting by priceLowToHigh or priceHighToLow.
Example: GET /api/products?page=1&type=necklaces&sort=priceLowToHigh
Collections API: /api/products/collections

Fetches all unique product collections for the filter bar.