import {
  explainGermanTopic,
} from "../services/geminiService.js";

export const getExplanation = async (
  req,
  res
) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: "Topic is required",
      });
    }

    const explanation =
      await explainGermanTopic(topic);

    res.status(200).json({
      success: true,
      explanation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gemini API Error",
    });
  }
};