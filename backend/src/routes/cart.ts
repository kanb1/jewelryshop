import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart";
import Product from "../models/Products";
import authenticateJWT from "./authMiddleware";

const router = express.Router();

// Udvider express Request type, undgår runtime-fejl ""Cannot read property 'userid' of undefined
// user er en valgfri egenskab som kun findes hvis en bruger er autentificeret
// for at undgå at TS laver en fejl om at user ikke eksiterer på req... hjulpet med at sige direkte om en userId er undefined i stedet for en irri ts fejl
// vigtigt i mit projekt fordi JWT middleware, tilføjer user til req når brugeren er logget ind.. og kun autentitificerede brugere kan tilgå deres data
// ved at gøre det her så kan vi knytte specifikke data fx kurv og favoritter til den aktuelle bruger
interface AuthenticatedRequest extends Request {
  // strukturen af user, hvor userId er brugerens unikke id
  user?: { userId: string }; 
}
// uden ovenstående ville vi blive nødt til at bruge ts any-type for at undgå at TS klager.. men det dårlig praksis fordi vi mister type sikkerhed, derfor har jeg udvidet Request

// **********************************HENT ALLE VARER I KURVEN
// middlewaren sikrer at brugeren er logget ind og JWT'en verificeres
router.get("/cart", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
  // custom field vi har lavet i vores interface og som tilføjes af vores middleware, når en bruger er logget ind og har en gyldig jwt-token
  // vi udtrækker userId fra req.user (altså hvis user eksisterer.. (dvs at brugeren ikke er autentificeret))
  // ved at gøre det her så kan vi knytte specifikke data fx kurv og favoritter til den aktuelle bruger
  const userId = req.user?.userId;

  try {
    // mfinder alle kurvvarer tilgørende den aktuelle bruger (identificeret via jwt)
    const cartItems = await Cart.find({ userId }).
    // Henter produktdata fra Products-kollektionen, så vi har adgang til anvn, billeder osv
    populate("productId"); // Ensure `productId` is populated
    console.log("Populated cart items yess:", JSON.stringify(cartItems, null, 2)); // Add this line to debug
    Response.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    Response.status(500).json({ error: "Error fetching cart items" });
  }
});

// **********************************TILFØJ PRODUKT TIL KURVEN

// Når brugeren klikker på "Add to bag" i frotnend sendes en POST forespørgsel til denne her endpoint. Middleware tjekker så JWTtoekn og tilføjer brugerens userId til req.user
router.post("/cart", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  // udtræk data fra forespørgslen, disse data sendes i requestens body
  const { productId, size, quantity } = req.body;
  // bruges til at identificere hvilken bruger kurven tilhører
  const userId = req.user?.userId;

  // validering: tjekker om productId er et gyldigt mongodb objectid-format (fordi mongo laver deres egen id)
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
       res.status(400).json({ error: "Invalid productId format" });
       return;
    }


    // Tjek om produktet findes
    // henter produktet fra databasen baseret på dets ID
    const product = await Product.findById(productId);
    if (!product) {
       res.status(404).json({ error: "Product not found" });
      return;

    }

    // tjek om produktet allerede re i kurven
    const existingItem = await Cart.findOne({ userId, productId, size });
    // øger mængden med quantity som brugeren har sendt
    if (existingItem) {
      existingItem.quantity += quantity;
      // gemmer ændringen med existingItem.save()
      await existingItem.save();
       res.status(200).json({ message: "Cart updated", cartItem: existingItem });
       return;

    } else {
      // hvis produktet ikke findes i kurven, opretter vi et nyt cart dokument med userid, produktid osv
      const newCartItem = new Cart({ userId, productId, size, quantity });
      // gemmer nye cart dokument med newCartItem.save()
      await newCartItem.save();
       res.status(201).json({ message: "Product added to cart", cartItem: newCartItem });
       return;
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// **********************************DELETE ITEM FROM BASKET
router.delete("/cart/:id", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
  // :id er en dynamisk parameter i URL'en, det vil være id'et for kurvelementet der skal slettes
  const cartId = req.params.id;

  try {
    // mongodb-forespørgsel der forsøger at finde et dokument i Cart-kollektionen med det specifikke ID og derefter slette
    const deletedItem = await Cart.findByIdAndDelete(cartId);
    if (!deletedItem) {
       Response.status(404).json({ error: "Cart item not found" });
       return;
    }

    Response.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    Response.status(500).json({ error: "Internal server error" });
  }
});

// ************************************************PUT - Update cart item quantity
router.put("/cart/:id", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
     Response.status(400).json({ error: "Quantity must be greater than 0" });
     return;
  }

  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
       Response.status(404).json({ error: "Cart item not found" });
      return;

    }

    Response.json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    Response.status(500).json({ error: "Internal server error" });
  }
});

export default router;
