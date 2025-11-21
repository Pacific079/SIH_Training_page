import { GoogleGenAI } from "@google/genai";

// No TypeScript types — just plain JS.
// Instead of LogEntry[] or SimulationNode[], we treat them as normal arrays.

// Create Gemini client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// AI analysis for trainee action
export const analyzeAction = async (logs, nodes, lastAction) => {
  const client = getClient();
  if (!client) return "Gemini API Key not configured. AI Tutor is offline.";

  // Build summary of current substation state
  const stateSummary = nodes
    .map(
      (n) =>
        `${n.name} (${n.type}): ${n.state} [${n.isEnergized ? "LIVE" : "DEAD"}]`
    )
    .join("\n");

  // Show last 5 logs
  const recentLogs = logs
    .slice(-5)
    .map((l) => `[${l.type}] ${l.message}`)
    .join("\n");

  const prompt = `
    You are a senior Substation Engineer Instructor.
    The trainee just performed: "${lastAction}".
    
    Current Substation State:
    ${stateSummary}

    Recent Logs:
    ${recentLogs}

    Analyze the last action.
    1. Was it safe?
    2. Did it violate any interlocks?
    3. What should be the next step?

    Keep it brief (max 3 sentences).
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Tutor temporarily unavailable.";
  }
};

// Generate dramatic scenario description intro
export const generateScenarioDescription = async (scenarioTitle) => {
  const client = getClient();
  if (!client) return "Select a scenario to begin.";

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a dramatic 2-sentence intro for a substation scenario: "${scenarioTitle}". Include weather or grid load.`,
    });

    return response.text || "Scenario loaded.";
  } catch (e) {
    return "Scenario loaded (AI unavailable).";
  }
};
