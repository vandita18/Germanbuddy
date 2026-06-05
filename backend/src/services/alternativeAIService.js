/**
 * Germanbuddy Alternative AI Service
 * Fallback support for multiple AI providers
 * Provides flexibility and redundancy if one API service becomes unavailable
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// =====================
// 1. Google Gemini API (Primary)
// =====================
export const useGeminiAPI = async (topic) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = generateTutorPrompt(topic);
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// =====================
// 2. OpenAI API (Alternative - Now Configured)
// =====================
export const useOpenAIAPI = async (topic) => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a German language tutor for Germanbuddy. Provide clear, beginner-friendly explanations.",
        },
        {
          role: "user",
          content: `Explain this German topic: ${topic}\n\nProvide: 1. Explanation 2. German Examples 3. English Translation 4. Learning Tip`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// =====================
// 3. Anthropic Claude API (Alternative)
// =====================
export const useAnthropicAPI = async (topic) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a German language tutor for Germanbuddy. ${generateTutorPrompt(topic)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
};

// =====================
// 4. Hugging Face API (Free Alternative)
// =====================
export const useHuggingFaceAPI = async (topic) => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY not configured");
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/gpt2",
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      method: "POST",
      body: JSON.stringify({
        inputs: `Germanbuddy German Tutor - Explain in German: ${topic}. Provide explanation, examples, and translation.`,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data[0].generated_text;
};

// =====================
// Helper Functions
// =====================

/**
 * Generate consistent tutor prompt for all AI providers
 */
function generateTutorPrompt(topic) {
  return `
You are a German language tutor for Germanbuddy application.

Explain this topic in simple language.

Topic:
${topic}

Return:
1. Explanation (clear and beginner-friendly)
2. German Examples (with context)
3. English Translation (of examples)
4. Learning Tip (memory aid or helpful hint)

Keep response beginner friendly and structured.
`;
}

/**
 * Fallback mechanism - try providers in order
 * Default order: Gemini → OpenAI → Anthropic → HuggingFace
 */
export const explainGermanTopicWithFallback = async (topic, providers = null) => {
  const defaultProviders = ["gemini", "openai", "anthropic"];
  const providersToTry = providers || defaultProviders;

  console.log(`[Germanbuddy] Explaining topic: "${topic}"`);
  console.log(`[Germanbuddy] Trying providers: ${providersToTry.join(", ")}`);

  for (const provider of providersToTry) {
    try {
      switch (provider.toLowerCase()) {
        case "gemini":
          console.log("[Germanbuddy] Attempting Gemini API...");
          return await useGeminiAPI(topic);
        case "openai":
          console.log("[Germanbuddy] Attempting OpenAI API...");
          return await useOpenAIAPI(topic);
        case "anthropic":
          console.log("[Germanbuddy] Attempting Anthropic API...");
          return await useAnthropicAPI(topic);
        case "huggingface":
          console.log("[Germanbuddy] Attempting Hugging Face API...");
          return await useHuggingFaceAPI(topic);
        default:
          console.warn(`[Germanbuddy] Unknown provider: ${provider}`);
      }
    } catch (error) {
      console.warn(`[Germanbuddy] ${provider} failed: ${error.message}`);
      continue;
    }
  }

  throw new Error("[Germanbuddy] All AI providers failed. Please check your API keys.");
};
