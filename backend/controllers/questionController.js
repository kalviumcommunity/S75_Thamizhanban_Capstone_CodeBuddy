const { Questions } = require('../model/Questions');

const getAllQuestions = async (req, res) => {
    try {
        const data = await Questions.find();
        if (!data) {
            return res.status(400).json({ message: "Data not found" });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPostedQuestions = async (req, res) => {
    try {
        const data = await Questions.find({ posted_by: req.user.email });
        if (!data) {
            return res.status(404).json({ message: "Questions not found" });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const postQuestion = async (req, res) => {
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
};

const getMyQuestions = async (req, res) => {
    try {
        const email = req.user.email;
        const myQuestions = await Questions.find({ posted_by: email });
        res.status(200).json(myQuestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllQuestions, getPostedQuestions, postQuestion, getMyQuestions };
