import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

type ParcelShop = {
  name: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  coordinates: number[];
  distance: number;
};

// GET /api/delivery/parcel-shops
router.get("/parcel-shops", async (req: Request, res: Response) => {
    const { address, lon, lat, radius = 50000 } = req.query;

    const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
    if (!GEOAPIFY_API_KEY) {
        res.status(500).json({ error: "API key is not defined" });
        return;
    }

    let coordinates: { lon: number; lat: number } | null = null;

    if (address) {
        // Fetch coordinates from Geoapify Geocoding API
        const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            address as string
        )}&apiKey=${GEOAPIFY_API_KEY}`;
        try {
            const geoResponse = await axios.get(geocodingUrl);
            const features = geoResponse.data.features;

            if (features && features.length > 0) {
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
    } else if (lon && lat) {
        coordinates = { lon: Number(lon), lat: Number(lat) };
    } else {
        res.status(400).json({ error: "Location query parameter is required" });
        return;
    }

    const parcelShopUrl = `https://api.geoapify.com/v2/places?categories=commercial&filter=circle:${coordinates.lon},${coordinates.lat},${radius}&apiKey=${GEOAPIFY_API_KEY}`;
    try {
        const parcelShopResponse = await axios.get(parcelShopUrl);
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
