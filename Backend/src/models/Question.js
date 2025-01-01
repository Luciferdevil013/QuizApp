import { Schema, model } from 'mongoose';

const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 10 }
});

export default model('Question', questionSchema); 