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
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Failed to fetch AI response");
  }

  return response.json();
};
