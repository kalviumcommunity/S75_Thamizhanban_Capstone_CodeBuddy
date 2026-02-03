const { Answers } = require('../model/Questions');

const postAnswer = async (req, res) => {
    try {
        const { answer, question } = req.body;
        if (!answer || !question) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const answerDoc = await Answers.create({
            question, answer,
            author: req.user.email
        });
        res.status(200).json({ message: "Answer posted successfully!", answerDoc });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllAnswers = async (req, res) => {
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
};

const rateAnswer = async (req, res) => {
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
};

const getMyAnswers = async (req, res) => {
    try {
        const answers = await Answers.find({ author: req.user.email })
            .populate('question', 'question');
        res.json(answers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { postAnswer, getAllAnswers, rateAnswer, getMyAnswers };
