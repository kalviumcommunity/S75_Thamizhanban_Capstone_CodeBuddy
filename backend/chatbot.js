const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // Ensure npm install node-fetch@2

router.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const model = "gemini-1.5-flash"; // Use 1.5-flash for maximum compatibility
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    res.json({ reply });
  } catch (error) {
    console.error("Internal Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;