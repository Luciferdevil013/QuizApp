import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  score: number;
  rank?: number;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score: { type: Number, default: 0 },
  rank: { type: Number },
  isAdmin: { type: Boolean, default: false }
});

export default model<IUser>('User', userSchema); 