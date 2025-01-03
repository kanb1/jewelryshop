import mongoose, { Schema, Document } from "mongoose";

interface ISession extends Document {
  jti: string; // Sessionens unikke ID
  createdAt: Date; // Automatisk tidsstempel
}

const SessionSchema: Schema = new Schema(
  {
    jti: { type: String, required: true, unique: true },
  },
  { timestamps: true } // Tilføjer createdAt automatisk
);

const Session = mongoose.model<ISession>("Session", SessionSchema);
export default Session;
