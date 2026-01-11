const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Detailed logging for debugging
    console.log("Received prompt:", prompt);
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);

    if (!process.env.GEMINI_API_KEY) {
      console.error("Error: GEMINI_API_KEY is missing.");
      return res.status(500).json({ 
        error: "Server configuration error",
        reply: "AI service is not configured. Please contact the administrator."
      });
    }

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ 
        error: "Prompt is required",
        reply: "Please provide a valid question."
      });
    }

    // Use gemini-1.5-flash (more stable model name)
    const model = "gemini-2.5-flash"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    console.log("Calling Gemini API...");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }] 
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      }),
    });

    const data = await response.json();
    console.log("Gemini API response status:", response.status);

    if (!response.ok) {
      console.error("Gemini API Error:", JSON.stringify(data, null, 2));
      return res.status(response.status).json({
        error: "Gemini API Error",
        details: data.error?.message || "Unknown error",
        reply: `Sorry, the AI service returned an error: ${data.error?.message || "Unknown error"}`
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
    
    console.log("Successfully generated reply");
    res.json({ reply });

  } catch (error) {
    console.error("Server Error:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      error: "Internal server error",
      reply: "An unexpected error occurred. Please try again later."
    });
  }
});

module.exports = router;