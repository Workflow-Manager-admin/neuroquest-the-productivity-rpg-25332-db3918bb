//
// PUBLIC_INTERFACE
// openaiQuestBreakdown.js - Provides a function to get a structured quest breakdown from OpenAI GPT API, grouping into main quest, side quests, and microtasks.
//
// Security Note: This sends your OpenAI API key (VITE_OPENAI_API_KEY in .env) to OpenAI from the frontend. DO NOT hardcode your key, ensure .env is never exposed publicly or in version control.
//
// Only call this in browser environments you control; browser traffic exposes the API key in requests.
//
import axios from "axios";

// PUBLIC_INTERFACE
/**
 * Fetches a quest breakdown from OpenAI GPT, given a user goal.
 * Returns: { mainQuestline: [...], sideQuests: [...], microtasks: [...] }
 */
export async function getQuestBreakdown(userGoal) {
  if (typeof userGoal !== "string" || !userGoal.trim()) {
    throw new Error("Goal must be a non-empty string!");
  }
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("VITE_OPENAI_API_KEY missing from environment!");

  const systemPrompt = `You are NeuroQuestGPT, the expert RPG Quest Master. Given a user's major life goal (such as a big exam, project, or achievement), break it down as an RPG quest map: (a) a Main Questline of 3-6 key milestones, (b) 3-8 Side Quests (parallel or optional helpful tasks), and (c) 5-20 Microtasks (small actionable tasks, mapped to main/side quests, but grouped flat). Respond ONLY with a valid JSON object like: { "mainQuestline": ["..."], "sideQuests": ["..."], "microtasks": ["..."] }`;

  const prompt = [
    {
      role: "system",
      content: systemPrompt,
    },
    { role: "user", content: `Goal: ${userGoal}` },
  ];

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: prompt,
        temperature: 0.4,
        max_tokens: 800,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    // responses may have function_call or choices
    const result = res?.data?.choices?.[0]?.message?.content;
    // Defensive: try to parse as JSON
    let parsed;
    try {
      parsed = JSON.parse(result);
      if (
        parsed.mainQuestline &&
        parsed.sideQuests &&
        parsed.microtasks
      )
        return parsed;
    } catch (_) {
      // could be stringified JSON, or malformed
    }
    throw new Error(
      "OpenAI API did not return a valid quest breakdown (got: " +
        result +
        ")"
    );
  } catch (err) {
    if (
      err?.response?.data?.error &&
      err.response.data.error.message
    ) {
      throw new Error(
        "[OpenAI] " + err.response.data.error.message
      );
    }
    throw new Error("OpenAI API failed: " + (err?.message || err));
  }
}
