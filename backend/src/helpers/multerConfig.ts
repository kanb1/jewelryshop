import multer from "multer"; // Middleware for handling file uploads
import path from "path";    // For managing file and directory paths
import { Request } from "express"; // Express Request type

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save the files in a secure folder
    const uploadPath = path.join(__dirname, "../../../public/uploads_profilepictures");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a secure, unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File Filter Configuration
const fileFilter = (_req: Request, file: Express.Multer.File, cb: any) => {
  // Only allow JPEG, PNG, and JPG file types
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed.")); // Reject with error
  }
};

// Multer Instance
const upload = multer({
  storage, // Use the defined storage configuration
  fileFilter, // Apply the file filter
  limits: { fileSize: 5 * 1024 * 1024 }, // Restrict file size to 5MB
});

export default upload; // Export the configured Multer instance
