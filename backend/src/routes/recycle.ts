import express, { Request, Response } from 'express';
import RecycledProduct from '../models/RecycledProduct';
import authenticateJWT, { adminMiddleware } from '../routes/authMiddleware';
import multer from 'multer'; //middleware til håndtering af filuploads
import path from 'path'; //node.jsbiblio til håndtering af fil- og stioperationer
import fs from 'fs'; //filsystemoperationer fx sletning af filer
import transporter from '../helpers/emailConfig'; 
import { body, param, validationResult } from "express-validator";
import crypto from "crypto"; 
import sharp from "sharp";





const router = express.Router(); // Create a new router instance

// Interface for handling authenticated requests
interface AuthenticatedRequest extends Request {
    user?: { userId: string; username: string; role?: string }; // Ensure user info is available
  }


// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************

// ****Multer Storage
// Set up multer storage with file type and size validation
const storage = multer.diskStorage({
  // Destination -> Filer gemmes i mappen recycleproduct_images
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../public/recycleproduct_images"));
  },

  // Filename -> Filerne får unikke navne: 
    // timestamp, tilfældig streng + filtypenavn
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    // crypto.randomBytes --> Ekstra randomness
    const uniqueSuffix = crypto.randomBytes(4).toString("hex");
    // path.extname tager filens navn, som brugerne uplaoder, og udtrækker filens udvidelse
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${timestamp}-${uniqueSuffix}${extension}`);
  },
});

// ****Multer Upload
const upload = multer({
  // Begrænser fiæstørrelse til 2mb og tillader kun JPEG, png og jpg
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});


// **** Sharp: Ekstra validering af billeder
// Problem med path.extname --> hacker kan ændre file.originalname for a tinkludere en falsk filudvidelse
// fx fakeimage.png.exe vil returnere exe.. snyd
// MIME-typen kan ikke nemt manipuleres da den afhænger af filens reele indhold og ikke kun navnetm men hacker kan stadig snyde ved at inkludere .png men med farligt indhold
// For at sikre filens indhold valideres der med sharp:
const validateImage = async (filePath: string): Promise<boolean> => {
  try {
    // Forsøg at læse metadata fra billedet
    await sharp(filePath).metadata();
    return true; // Hvis metadata kan læses, er filen et gyldigt billede
  } catch (error) {
    console.error("Invalid image file:", error);
    return false; // Filen er ikke et billede
  }
};


// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************


//*************************************************** ADD A NEW RECYCLED PRODUCT
router.post(
  "/",
  authenticateJWT, //middleware der validere rJWT-tokenet, autentificeret brugere kan kun tilgå ruten
  upload.single("image"), // Use the multer middleware til filupload. LAgrer i den mappe der defineret i multerkonfig med et unikt navn
  [
    body("name") //body validerer inputfelt, name
      .isString()
      .trim()
      .escape() // Escape input to prevent XSS ved at konvertere farlige tegn som <> til sikre versioner
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must be between 3 and 50 characters."),
    body("price")
      .isFloat({ gt: 0, lt: 10000 })
      .withMessage("Price must be a positive value and below 10,000."),
    body("size")
      .isIn(["Onesize", "6", "7", "8", "9", "10"])
      .withMessage("Invalid size value."),
    body("visibility")
      .isIn(["public", "private"])
      .withMessage("Invalid visibility value.")
      .escape(), // Escape visibility field
    body("type")
      .isIn(["ring", "necklace", "bracelet", "earring"])
      .withMessage("Invalid type of jewelry.")
      .escape(), // Escape type field
  ],
  async (req: AuthenticatedRequest, res: Response) => {

    // Kontrollerer om input overholder reglerne
    // validationResult(req) samler alle fejl fra valideringsmidlerne i body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
       res.status(400).json({ errors: errors.array() });
       return;
    }

    // reqbody --> idneholder data fra klient
    const { name, price, size, visibility, type } = req.body;
    // udpakker brugerens ID fra tokenet, som authetnicateJWT gemmer i req.user
    const userId = req.user?.userId;

    if (!userId) {
      console.error("User ID missing in request.");
       res.status(401).json({ error: "Access denied." });
      return;

    }

    // Tjekker om en fil blev uploadet
    if (!req.file) {
      console.error("File upload failed. No file found in request.");
       res.status(400).json({ error: "File upload failed. Please upload a valid file." });
      return;
    }

    // Validering af filtypen - MIME-type kontrol
    // req.file.mimetype --> MIME-type fx image/jpeg -> includes tjekker om filens type er blandt de tilladte jpeg, jpg and so on
    if (!["image/jpeg", "image/png", "image/jpg"].includes(req.file.mimetype)) {
       res.status(400).json({ error: "Invalid file type. Only JPEG, PNG, and JPG are allowed." });
       return;
    }

    // Generer den fulde sti til filen der lige er blevet uploadet
    const filePath = path.join(__dirname, "../../../public/recycleproduct_images", req.file.filename);


    // validateimage --> Bruger sharp til at kontrollere om filen faktisk er et billede
    const isValidImage = await validateImage(filePath);
    if (!isValidImage) {
      // Slet filen, hvis den ikke er et gyldigt billede
      fs.unlinkSync(filePath);
       res.status(400).json({ error: "Invalid image content. Please upload a valid image." });
       return;
    }


    try {
      const imagePath = `recycleproduct_images/${req.file.filename}`;

      // Gem produkt i db
      const newProduct = new RecycledProduct({
        name,
        price,
        size,
        visibility,
        type,
        userId,
        images: imagePath,
      });

      await newProduct.save();
      console.log("New product saved successfully:", newProduct);

      res.status(201).json({ message: "Product added successfully!", product: newProduct });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error. Please try again later." });
    }
  }
);



// ************************************************************************ UPDATE OTHER DETAILS

router.put("/:id", authenticateJWT, [
  body("name").optional().trim().escape(),
  // isFloat({gt:0}) sikrer at price er flydende tal (decimal) større end 0
  body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be positive."),
  // Validerer at parameteren id er et gyldigt mognoDB objectId format
  param("id").isMongoId().withMessage("Invalid product ID."),
  ],async (Request: any, res: Response) => {
  try {
    // Ekstraherer id fra URL-parametrene. Dette bruges til at finde produktet i databasen
    const { id } = Request.params;
    // Henter den autentificerede brugers ID fra req.user
    const userId = Request.user?.userId;
    const { visibility } = Request.body; // 'public' or 'private'


    // Check if user is authenticated
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Finder produktet i databasen ved hjælp af dets unikke ID (id).
    const product = await RecycledProduct.findById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Ensure the product belongs to the authenticated user
    if (product.userId.toString() !== userId) {
      res.status(403).json({ error: "You can only edit your own products" });
       return;
    }

    // Update the product's visibility
    product.visibility = visibility;
    await product.save();

    // Update other product details (like name, price, size, visibility, and type)
    product.name = Request.body.name || product.name;
    product.price = Request.body.price || product.price;
    product.size = Request.body.size || product.size;
    product.visibility = Request.body.visibility || product.visibility;
    product.type = Request.body.type || product.type;

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully!", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});


//*************************************************** GET ALL RECYCLED PRODUCTS, THAT IS VIEWABLE FOR ALL
router.get("/", async (req: Request, res: Response) => {
  try {
    // RecycledProduct: Er modellen, der repræsenterer recycled produkter i MongoDB
    // Kører en forespørgsel i databasen for at finde alle produkter, hvor visibility-feltet har værdien "public"
    const products = await RecycledProduct.find({ visibility: "public" });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching recycled products:", error);
    res.status(500).json({ error: "Failed to fetch recycled products" });
  }
});

//*************************************************** GET ALL PRODUCTS CREATED BY LOGGED IN USER

// Middleware, der verificerer, om anmodningen indeholder en gyldig JWT --> For om brugeren er logget ind
router.get("/user", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
  // req.user: Denne værdi er tilføjet af authenticateJWT-middleware, som verificerer JWT'en og udtrækker brugeroplysninger
  const userId = req.user?.userId;


  if (!userId) {
     Response.status(401).json({ error: "Unauthorized" });
     return;
  }

  // await RecycledProduct.find({ userId }):
  // MongoDB-model, som repræsenterer recycled produkter
  // .find({ userId }): Søger i databasen efter alle produkter, hvor userId-feltet matcher det autentificerede bruger-ID
  try {
    const userProducts = await RecycledProduct.find({ userId });
    // Indeholder en liste over produkter oprettet af den aktuelle bruger.
    Response.status(200).json(userProducts);
  } catch (error) {
    console.error("Error fetching user's recycled products:", error);
    Response.status(500).json({ error: "Failed to fetch user's recycled products" });
  }
});


//*************************************************** EDIT VISIBILITY OF A RECYCLED PRODUCT (PUBLIC/PRIVATE)
// Endpoint to update the visibility of a recycled product (public/private)
router.put("/:productId/visibility", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
  // req.params.productId: Produkt-ID, som er en del af URL'en --> Identificere det produkt der skal opdateres
  const { productId } = req.params;
  // Indeholder den nye synlighedsstatus, som klienten ønsker at sætte. Klienten sender dette som en del af request body.
  const { visibility } = req.body;
  // Indeholder ID'et for den bruger, der er logget ind. Denne værdi tilføjes til requesten af authenticateJWT middleware. 
  const userId = req.user?.userId;

  if (!userId) {
     Response.status(401).json({ error: "Unauthorized" });
    return;

  }

  try {
    // Søger i databasen efter et produkt med det angivne ID.
    const product = await RecycledProduct.findById(productId);
    if (!product) {
       Response.status(404).json({ error: "Product not found" });
      return;

    }

    // Ensure the product belongs to the authenticated user
    // product.userId: ID'et for den bruger, der har oprettet produktet. userId: ID'et for den aktuelt loggede bruger.
    // toString --> Konverterer MognoDB ObjectId til en streng, så daen kan sammenlignes med userId
    if (product.userId.toString() !== userId) {
       Response.status(403).json({ error: "You can only edit your own products" });
       return;
    }

    // Update the product's visibility
    product.visibility = visibility;
    const updatedProduct = await product.save();

    Response.status(200).json({ message: "Product visibility updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product visibility:", error);
    Response.status(500).json({ error: "Failed to update product visibility" });
  }
});




//*************************************************** DELETE A RECYCLED PRODUCT (ADMIN & PRODUCTOWNER)

// Middleware that ensures the user is logged in with a valid JWT token.
// Middleware that ensures the user has admin privileges or necessary authorization to delete the product
router.delete("/:productId", authenticateJWT, adminMiddleware, [
  // Validates that the productId parameter is a valid MongoDB ObjectId.
  param("productId").isMongoId().withMessage("Invalid product ID."),
  ], async (req: Request, res: Response) => {
  // Extracts the product ID from the URL. This ID is used to locate the product in the database.
  const { productId } = req.params;

  try {
    // Searches for the product in the database using the provided productId.
    // If the product is found, it deletes it from the database and returns the deleted document.
    const deletedProduct = await RecycledProduct.findByIdAndDelete(productId).populate('userId');

    if (!deletedProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Delete associated images
    // If the delete dproduct has associated images, the code iterates through the images array
    if (deletedProduct.images && deletedProduct.images.length > 0) {
      deletedProduct.images.forEach((image: string) => {
        // Constructs the full path to each image in the public directory.
        const imagePath = path.join(__dirname, '../../../public', image);

    
        // Checks if the image file exists on the server.
        if (fs.existsSync(imagePath)) {
          // Delete the image file
          fs.unlinkSync(imagePath);
          console.log(`Deleted image: ${image}`);
        } else {
          console.log(`Image not found: ${imagePath}`);
        }
      });
    }


    // Retrieves the email of the product owner from the populated userId field
    const ownerEmail = deletedProduct.userId.email; 

    // Constructing the meail that prepares the email notificaiton to informt he product owner that their has been banned
    const mailOptions = {
      from: process.env.EMAIL_USER,  
      to: ownerEmail, 
      subject: "Your product has been banned", 
      text: `Dear user,\n\nYour product "${deletedProduct.name}" has been banned from the platform due to policy violations.\n\nRegards,\nJewelryShop Team`,
    };

    // Send email notification to the product owner
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});


export default router;
