import React, { useState } from "react";
import '../styles/AITutor.css';
import { askAI } from "../services/aiApi";

const AiSearch: React.FC = () => {
  const [topic, setTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSearch = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const data = await askAI(topic);

      setResult(data.explanation || "No response received.");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-container">

      {/* TITLE */}
      <h2 className="ai-title">🤖 AI German Tutor</h2>

      {/* SEARCH BOX */}
      <div className="ai-search-box">
        <input
          type="text"
          placeholder="Ask: Dativ, Akkusativ, Verb conjugation..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="ai-loading">
          Generating explanation...
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="ai-error">
          {error}
        </p>
      )}

      {/* RESULT */}
      {result && (
        <div className="ai-result">
          {result.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}

    </div>
  );
};

export default AiSearch;
