const axios = require('axios');
require('dotenv').config();
const Api_ = require('../Models/Api');



async function callLLM({ prompt, response_json_schema = null }) {
  try {
    // 🔑 Fetch API key from DB
    const apiKeyDoc = await Api_.findOne({ type_key: "OpenAI" });

    if (!apiKeyDoc || !apiKeyDoc.api_key) {
      throw new Error("OpenAI API key not found in database");
    }

    const apiKey = apiKeyDoc.api_key.trim();

    const url = "https://api.openai.com/v1/chat/completions";

    const messages = [
      {
        role: "system",
        content:
          "You are a professional career advisor AI. Always respond strictly in valid JSON format only.",
      },
      { role: "user", content: prompt },
    ];

    const requestBody = {
      model: "gpt-4o-mini",
      messages,
      temperature: 0.3,
      max_tokens: 3000,
    };

    // ✅ JSON response format handling
    if (response_json_schema) {
      requestBody.response_format = {
        type: "json_schema",
        json_schema: {
          name: "custom_schema",
          schema: response_json_schema,
          strict: false,
        },
      };
    } else {
      requestBody.response_format = { type: "json_object" };
    }

    // 🔥 Call OpenAI API
    const response = await axios.post(url, requestBody, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const text = response.data.choices?.[0]?.message?.content || "";

    let parsed = null;

    try {
      parsed = JSON.parse(text);
    } catch (error) {
      console.warn("⚠ Failed to parse JSON response:", text);
    }

    return { text, parsed };
  } catch (error) {
    console.error(" LLM call failed:", error.message);
    throw new Error("LLM request failed");
  }
}

module.exports = { callLLM };
