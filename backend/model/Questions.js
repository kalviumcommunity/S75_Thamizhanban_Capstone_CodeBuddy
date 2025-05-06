const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Python', 'Java', 'DSA', 'C++', 'JavaScript', 'SQL', 'Others'], 
    required: true
  },
  tagline: {
    type: String,
    required: true
  },
  posted_by:{
    type:String,
    required:true,
    
  }
});

const AnswerSchema = new mongoose.Schema({
  Answers: [
    {
      answer: {
        type: String,
        required: true
      }
    }
  ],
  Question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questions',
    required: true
  }
});

const Questions = mongoose.model('Questions',QuestionSchema);
const Answers = mongoose.model('Answers',AnswerSchema);

module.exports = {Questions,Answers};