import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with environment variable - securely loaded from .env
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const explainGermanTopic = async (topic) => {
  try {
    // Using gemini-3.5-flash for German language tutor
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash", 
    });

    const prompt = `
You are a German language tutor.

Explain this topic in simple language.

Topic:
${topic}

Return:
1. Explanation
2. German Examples
3. English Translation
4. Learning Tip

Keep response beginner friendly.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in explainGermanTopic:", error.message);
    throw new Error("Failed to generate content from AI model");
  }
};
