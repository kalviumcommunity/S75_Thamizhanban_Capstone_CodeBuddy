const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Signup, Login } = require('./model/UserScehma');
const { Questions, Answers } = require('./model/Questions');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');
require('dotenv').config();
const ChatMessage = require('./model/chat');







router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All the data are required" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    await Signup.create({ email, password: hashedPass });
    res.status(201).json({ message: "Data created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/signup', async (req, res) => {
  try {
    const data = await Signup.find();
    if (!data) {
      return res.status(500).json({ message: 'Data not found' });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const dataExist = await Signup.findOne({ email });
    if (!dataExist) {
      return res.status(404).json({ message: "No users found on this email" });
    }

    const isPasswordValid = await bcrypt.compare(password, dataExist.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: dataExist._id, email: dataExist.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful!", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/postedQuestions', authMiddleware, async (req, res) => {
  try {
    const data = await Questions.find({ posted_by: req.user.email });
    if (!data) {
      return res.status(404).json({ message: "Questions not found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/allQuestions', async (req, res) => {
  try {
    const data = await Questions.find();
    if (!data) {
      return res.status(400).json({ message: "Data not found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/postQuestion', authMiddleware, async (req, res) => {
  const { question, tagline, category } = req.body;
  try {
    if (!question) {
      return res.status(400).json({ message: "Question not found!" });
    }
    const allowedCategories = ['Python', 'Java', 'DSA', 'C++', 'JavaScript', 'SQL', 'Others'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category selected' });
    }
    const newData = await Questions.create({
      question, tagline, category, posted_by: req.user.email
    });
    res.status(200).json({ message: "Question added", newData });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/postAnswer', authMiddleware, async (req, res) => {
  try {
    const { answer, question } = req.body;
    if (!answer || !question) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const answerDoc = await Answers.create({ question, answer,
       author: req.user.email 
     });
    res.status(200).json({ message: "Answer posted successfully!", answerDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/allAnswers/:id', async (req, res) => {
  try {
    const questionId = req.params.id;
    const answers = await Answers.find({ question: questionId });
    if (!answers || answers.length === 0) {
      return res.status(404).json({ message: 'No answers found for this question' });
    }
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/chat/:answerId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ AnswerId: req.params.answerId }).sort('timestamp');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/chat', async (req, res) => {
  const { AnswerId, sender, text } = req.body;
  try {
    const message = await ChatMessage.create({ AnswerId, sender, text });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.put('/rate/:answerId', authMiddleware, async (req, res) => {
  const { answerId } = req.params;
  const { rating } = req.body;
  const user = req.user.email;
  try {
    const ans = await Answers.findById(answerId);
    if (!ans) return res.status(404).send('Answer not found');

    const existing = ans.ratings.find(r => r.user === user);
    if (existing) {
      existing.stars = rating;
    } else {
      ans.ratings.push({ user, stars: rating });
    }

    const total = ans.ratings.reduce((sum, r) => sum + r.stars, 0);
    ans.rating = total / ans.ratings.length;

    await ans.save();
    res.json({ message: 'Rating updated', rating: ans.rating });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.get('/myQuestions', authMiddleware, async (req, res) => {
  try {
    const email = req.user.email;
    const myQuestions = await Questions.find({ posted_by: email });
    res.status(200).json(myQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/myAnswers', authMiddleware, async (req, res) => {
  try {
    const answers = await Answers.find({ author: req.user.email })
      .populate('question', 'question'); 
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
