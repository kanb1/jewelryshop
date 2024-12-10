// Import the mongoose library which is used to interact with MongoDB
// "Schema" --> Defines the structure of documents in MongoDB
// "Document" --> TypeScript interface representing mongoDB document from Mongoose
import mongoose, { Schema, Document } from 'mongoose';

// Opretter en ts interface ved navn IProduct
// Udvider mongooses Document, så den sikrer at typen matcher det som mongoose forventer for dokumenter
export interface IProduct extends Document {
  name: string;
  type: string;
  productCollection: string;
  price: number;
  sizes?: string[]; // Optional array of sizes (e.g., ["5", "6", "7"] for rings)
  images: string[]; 
}

// Opretter en mongoose schema, der beskriver strukturen af dokumentet
// Specificerer hvordan produktdata struktureres og gemmes i mongoDB
const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  productCollection: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: { type: [String], default: [] }, 
  images: { type: [String], required: true }, 

});

// Opretter en mongoose model der hedder PRdouct based on ProductSchema
// <IProduct> sikrer at modellen føler IProduct-interfacet, hvilket giver stærk type safety for produkt-dokuemtner
// Gør det muligt at interagere med products-samlingen i MongoDB
export default mongoose.model<IProduct>('Product', ProductSchema);
