import multer from "multer"; // Import Multer, the middleware for handling file uploads
import path from "path";    // Import Path for managing file and directory paths
import { Request } from "express"; // Import Request from express


// Storage Configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../../public/uploads_profilepictures"));
      console.log("Saving to:", path.join(__dirname, "../../public/uploads_profilepictures"));

    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
    
  });

// File Filter Configuration
const fileFilter = (_req: Request, file: Express.Multer.File, cb: any) => {
  // Define allowed file types
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]; // Allow only JPEG, PNG, and JPG file formats
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file if it's of an allowed type
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed.")); // Reject the file with an error message
  }
};

// Multer Instance
const upload = multer({
  storage, // Use the defined storage configuration
  fileFilter, // Use the defined file filter configuration
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export default upload; // Export the configured Multer instance for use in routes


