import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBfEXcA9x3NhT9Itg2C5IIOjtNl2jVLiX4");

export const explainGermanTopic = async (topic) => {
  // CHANGED: Switched from the retired 'gemini-1.5-flash' to the current 'gemini-3.5-flash'
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
};