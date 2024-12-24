const isProduction = process.env.NODE_ENV === "production";
// Deployment --> the process of making an application available to users
  //Vercel --> Pushed my code to github, Vercel connects to my repo, builds the frontend and deploys it
  //Render --> configured autodeploy from github --> automatically test and deploy after each push
  // linting

//This file ensures my project dynamically connects to either the production environment or the development environment
// It uses a conditional check to automate the URL assignment.

// In server.ts I use NODE_ENV that is a env variable in Node.js that specifies the enviromnet in which my app is running. It helps distinguish between development, production and evne other stages like testing

export const BACKEND_URL = isProduction
  ? "https://jewelryshop-8q3d.onrender.com" 
  : "http://localhost:5001"; // Local backend URL for development

export const FRONTEND_URL = isProduction
  ? "https://jewelryshop-two.vercel.app" // Production frontend URL
  : "http://localhost:5173"; // Local frontend URL for development