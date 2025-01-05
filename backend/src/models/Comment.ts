import mongoose, { Schema, Document } from 'mongoose';

// **********SECURITY


export interface IComment extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>('Comment', CommentSchema);
