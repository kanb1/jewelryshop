import express, { Request, Response } from "express";
// Used to make HTTP requests to the Geoapify API for geocoding and parcel shop data
import axios from "axios";
// ****Security
import { query, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';


// I can create endpoints
// Allows for a RESTful design (uses HTTP methods to perform CRUD, (GET,POST,PUT,DELETE))
// stateless --> each request is independent and carries all necessary information eg JWT tokens
const router = express.Router();

// Loads the API key from env vile
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

// Opret en Axios-instans med timeout
const axiosInstance = axios.create({
    timeout: 5000, // Timeout for alle forespørgsler: 5 sekunder
  });

// Rate limiter for at forhindre misbrug af /parcel-shop endpoint ved gentagne foresprøgsler
const parcelShopLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutter
    max: 100, // Maksimalt 100 forespørgsler pr. IP
    message: "Too many requests, please try again later.",
  });

// Brug rate-limiter på /parcel-shops ruten
router.use("/parcel-shops", parcelShopLimiter);





//******************* */ Defining the structure of a parcelshop object
type ParcelShop = {
  name: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  coordinates: number[]; //long and lat as an array
  distance: number;
};

//******************* GET /api/delivery/parcel-shops
router.get("/parcel-shops", [
    // Validering og sanitizing
    query("address")
        .optional()
        .isString().withMessage("Address must be a string")
        .trim() // Fjerner whitespace i starten og slutningen
        .escape(), // Escape HTML-characters (sanitizing)

    query("lon")
        .optional()
        .isFloat().withMessage("Longitude must be a number"),

    query("lat")
        .optional()
        .isFloat().withMessage("Latitude must be a number"),

    query("radius")
        .optional()
        .isInt({ min: 1, max: 100000 }).withMessage("Radius must be between 1 and 100000 meters"),
], async (req: Request, res: Response) => {
    // extracts query parameters from the frontend
    // radius --> search radius for parcel shops, default is 50 km
    const { address, lon, lat, radius = 50000 } = req.query;

    // Tjekker for valideringsfejl
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
     return;
    }


    // Ensures the Geoapify key is loaded
    const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
    if (!GEOAPIFY_API_KEY) {
        res.status(500).json({ error: "API key is not defined" });
        return;
    }

    // Variable for holding teh long adn lat values, intially set to null
    let coordinates: { lon: number; lat: number } | null = null;

    // ************************ CONVERT THE ADDRESS INTO COORDINATES (Geoapify Geocoding api)

    // To locate parcel shops near a specific address, the API requires coordinates instead of textual address and the radius (Geocoding)
    if (address) {
        
        // Fetch coordinates from Geoapify Geocoding API
        // Purpose: converting human-readable adress into geographic coordinates (lat and long). We want to make mathematical stuff 
            // encodeURIComponent: Ensures the address is properly encoded for the URL
        const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            address as string
        )}&apiKey=${GEOAPIFY_API_KEY}`;

        // Request
        try {
            // axios.get(geocodingUrl): Sends a GET request to the Geoapify Geocoding API.
            const geoResponse = await axiosInstance.get(geocodingUrl); // Bruger timeouteren her
            const features = geoResponse.data.features;

            // The API returns an object with features, which includes coordinates
            if (features && features.length > 0) {
                // The first result's longitude and latitude
                // Sets coordinates with lon (longitude) and lat (latitude)
                coordinates = {
                    lon: features[0].geometry.coordinates[0],
                    lat: features[0].geometry.coordinates[1],
                };
            } else {
                res.status(400).json({ error: "Address not found" });
                return;
            }
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch geolocation data" });
            return;
        }
        // If lon and lat are provided directly in the query, they are converted to numbers and stored in coordinates.
    } else if (lon && lat) {
        coordinates = { lon: Number(lon), lat: Number(lat) };
    //If missing location --> if neither address nor coordinates are provided 
    } else {
        res.status(400).json({ error: "Location query parameter is required" });
        return;
    }

    // ************************ FETCH PARCEL SHOPS (Geoapify places api)
    // constructs a geoapicy places API URL
        //Here we say to filter locations to commercials
        // filter=circle --> searches within a circular area centered at the given coordinates with the specified radius 
    const parcelShopUrl = `https://api.geoapify.com/v2/places?categories=commercial&filter=circle:${coordinates.lon},${coordinates.lat},${radius}&apiKey=${GEOAPIFY_API_KEY}`;
    try {
        // fetches parcel shops from the API
        const parcelShopResponse = await axios.get(parcelShopUrl);
        // maps the raw API response to a simpler format (parelshops)
        const parcelShops = parcelShopResponse.data.features.map((feature: any) => ({
            name: feature.properties.name || "No Name",
            address: feature.properties.address_line1 || "No Address",
            city: feature.properties.city || "No City",
            postcode: feature.properties.postcode || "No Postcode",
            country: feature.properties.country || "No Country",
            coordinates: feature.geometry.coordinates,
        }));

        res.status(200).json(parcelShops);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch parcel shops" });
    }
});


export default router;
