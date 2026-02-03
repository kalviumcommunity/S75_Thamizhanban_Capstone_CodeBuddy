const ChatMessage = require('../model/chat');

const getChatMessages = async (req, res) => {
    try {
        const messages = await ChatMessage.find({ AnswerId: req.params.answerId }).sort('timestamp');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

const postChatMessage = async (req, res) => {
    const { AnswerId, sender, text } = req.body;
    try {
        const message = await ChatMessage.create({ AnswerId, sender, text });
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

module.exports = { getChatMessages, postChatMessage };
