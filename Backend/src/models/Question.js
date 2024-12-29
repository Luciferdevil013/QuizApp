import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: true 
  },
  options: [{ 
    type: String, 
    required: true 
  }],
  correctAnswer: { 
    type: String, 
    required: true 
  },
  points: { 
    type: Number, 
    default: 10 
  }
});

export default mongoose.model('Question', questionSchema); 