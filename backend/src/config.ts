const isProduction = process.env.NODE_ENV === "production";

export const BACKEND_URL = isProduction
  ? "https://jewelryshop-8q3d.onrender.com" 
  : "http://localhost:5001"; // Local backend URL for development

export const FRONTEND_URL = isProduction
  ? "https://jewelryshop-two.vercel.app" // Production frontend URL
  : "http://localhost:5173"; // Local frontend URL for development