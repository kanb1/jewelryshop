// mongoose --> the primary library interacting with mongodb in a node.js application
import mongoose, { Schema, Document } from "mongoose";

// represents a single document in mongodb collection with all mongoose model features
// IUser --> a TS interface that extends the Document type
  // fields like username, email, password are required
  // feilds with ? are optional
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  role: string; // e.g., 'user' or 'admin'
  isActive: boolean; // To track if the user is active - Not really used.. wanted the admin to manage accounts and no email confirmation
  resetPasswordToken?: string; // Token for password reset
  resetPasswordExpires?: Date; // Expiry date for the reset token
  profilePicture?: string;
}

// Schema --> Defines the structure of documents within a mongodb collection
// Blueprint for the documents in collection
  // It defines the fields and their properties
const UserSchema: Schema = new Schema({
  // unique --> ensures that no two users have the same username in the db
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  // enum --> restricts the value of role to either user or admin
  role: { type: String, enum: ["user", "admin"], default: "user" }, // Default to "user"
  isActive: { type: Boolean, default: true }, // Default to active
  // Optional field to store a token for password reset functionality --> Used to verify the identity of a user during the reset process
  resetPasswordToken: { type: String }, // Token for password reset
  // ensures the token is only valid for a specific period
  resetPasswordExpires: { type: Date }, // Expiry date for reset token
  profilePicture: { type: String, default: "" }, // profile pictures
});

// mongoose.model<IUSER> creates a mongoose model based on the userschema --> IUser ties the model to the TS interface, ensuring type safety
  // When creating a new user or query the db, the TS compiler ensures u can only work with fields defined in IUser
// User --> collection where user documents will be stored, mongoDB will automatically pluralize this, storing documents in a collection called users
// UserSchema --> The schema that defines the structure of the users collection
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
