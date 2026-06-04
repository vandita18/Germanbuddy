const API_URL = "/api/ai";

export const askAI = async (topic: string) => {
  const response = await fetch(`${API_URL}/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AI response");
  }

  return response.json();
};