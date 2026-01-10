const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Debug: Check if key is loaded (logs to Render console, not browser)
    if (!process.env.GEMINI_API_KEY) {
      console.error("CRITICAL: GEMINI_API_KEY is missing from process.env");
      return res.status(500).json({ error: "API Key configuration missing on server" });
    }

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const model = "gemini-1.5-flash"; 
    // Try v1 first; if it fails, switch back to v1beta
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API returned error:", data);
      return res.status(response.status).json({
        error: "Gemini API Error",
        details: data.error?.message || "Unknown error"
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
    res.json({ reply });

  } catch (error) {
    console.error("Internal Server Error in Chatbot:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

module.exports = router;