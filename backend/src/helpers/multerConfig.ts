import multer from "multer"; 
// Middleware der forenkler processen med at gemme filer på serveren
import path from "path"; 
// Håndterer filstier og sikrer at de er sikre go korrekte på tværs af appen
import { Request } from "express"; 

// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************


// Storage Configuration - Specificerer hvor filer skal gemmes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Hvor de skal gemmes - path.join sikrer at filstien er sikker - Forhindrer directory traversal-angreb (hacker prøver at gemme filer uden for den tilladte mappe)
    // Filerne gemmes i mappen public/... - Adskiller fra roden af projektet
    const uploadPath = path.join(__dirname, "../../../public/uploads_profilepictures");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generer et unikt og sikkert filnavn
    // Tidsstempel som en del af filnavnet for at gøre det unikt
      // Math.random() --> Tilføjer et tilfældigt tal for yderligere sikkerhed
      //path.extname... --> Bevarer filtypen (.png osv) --> Sikrer at den gemte fil har samme type som den uploadede fil --> Ingen mulighed for extensions fx .php
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// fileFilter validerer filens mimetype for kun at tillade bestemte filtyper
const fileFilter = (_req: Request, file: Express.Multer.File, cb: any) => {
  // Only allow JPEG, PNG, and JPG file types
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  //Henter MIME-typen for den uploadede fil --> Hvis typen findes i allowedTypes --> Accept 
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("File upload failed. Please check your file and try again.")); // Reject with error --> Som ike afslører for meget
  }
};

// Multer Instance
const upload = multer({
  storage, // Use the defined storage configuration
  fileFilter, // Apply the file filter
  limits: { fileSize: 5 * 1024 * 1024 }, // Restrict file size to 5MB
});

// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************


//Bruges i eksempelvis userinfo.ts --> Profilepicture

export default upload; // Export the configured Multer instance
