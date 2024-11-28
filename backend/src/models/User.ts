import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  role: string; // e.g., 'user' or 'admin'
  isActive: boolean; // To track if the user is active
}


const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Default to "user"
  isActive: { type: Boolean, default: true }, // Default to active  
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
