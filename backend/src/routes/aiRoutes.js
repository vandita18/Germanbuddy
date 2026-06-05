import express from "express";
import { explainGermanTopic } from "../services/geminiService.js";
import { explainGermanTopicWithFallback } from "../services/alternativeAIService.js";

const router = express.Router();

/**
 * Germanbuddy Primary Endpoint - Google Gemini API
 * POST /api/ai/explain
 * Body: { topic: "German topic to explain" }
 */
router.post("/explain", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: "Topic is required",
        example: { topic: "Nominative case in German" },
        app: "Germanbuddy",
      });
    }

    const explanation = await explainGermanTopic(topic);

    res.json({
      success: true,
      app: "Germanbuddy",
      provider: "Google Gemini API",
      topic,
      explanation,
    });
  } catch (error) {
    console.error("[Germanbuddy] Error in /api/ai/explain:", error);
    res.status(500).json({
      error: "Failed to generate explanation",
      details: error.message,
      app: "Germanbuddy",
    });
  }
});

/**
 * Germanbuddy Fallback Endpoint - Multiple AI Providers
 * POST /api/ai/explain-with-fallback
 * Body: { topic: "German topic to explain", providers: ["gemini", "openai", "anthropic"] }
 */
router.post("/explain-with-fallback", async (req, res) => {
  try {
    const { topic, providers } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: "Topic is required",
        example: { topic: "Nominative case in German" },
        app: "Germanbuddy",
      });
    }

    const explanation = await explainGermanTopicWithFallback(topic, providers);

    res.json({
      success: true,
      app: "Germanbuddy",
      provider: "Germanbuddy AI Fallback System",
      topic,
      explanation,
      note: "Response generated from available AI provider (Gemini, OpenAI, or Anthropic)",
    });
  } catch (error) {
    console.error("[Germanbuddy] Error in /api/ai/explain-with-fallback:", error);
    res.status(500).json({
      error: "All AI providers failed",
      details: error.message,
      app: "Germanbuddy",
      solution: "Please check your API keys in .env file",
    });
  }
});

/**
 * Germanbuddy Health Check Endpoint
 * GET /api/ai/health
 */
router.get("/health", (req, res) => {
  const apiKeys = {
    gemini: !!process.env.GEMINI_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    huggingface: !!process.env.HUGGINGFACE_API_KEY,
  };

  const availableProviders = Object.entries(apiKeys)
    .filter(([_, configured]) => configured)
    .map(([provider]) => provider);

  res.json({
    status: "healthy",
    app: "Germanbuddy",
    availableProviders,
    configuredProviders: apiKeys,
    primaryProvider: "Google Gemini API",
    fallbackProviders: availableProviders.filter(p => p !== "gemini"),
  });
});

export default router;
