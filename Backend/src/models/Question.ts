import { Schema, model } from 'mongoose';

interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

const questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 10 }
});

export default model<IQuestion>('Question', questionSchema); 