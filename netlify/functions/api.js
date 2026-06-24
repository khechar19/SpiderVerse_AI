const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("WARNING: GEMINI_API_KEY is not defined in the environment variables!");
}
const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY");

/**
 * Utility to clean markdown wrappers and parse JSON safely
 */
function cleanAndParseJSON(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

// Router to support path resolutions on Netlify
const router = express.Router();

// 1. POST /generate-futureme
router.post("/generate-futureme", async (req, res) => {
  const { name, age, goal, struggle, oneYearVision, tone } = req.body;

  if (!name || !age || !goal || !struggle || !oneYearVision || !tone) {
    return res.status(400).json({
      success: false,
      error: "All fields are required: name, age, goal, struggle, oneYearVision, tone."
    });
  }

  let toneGuidance = "";
  if (tone === "Motivational" || tone === "miles") {
    toneGuidance = "Miles Morales style: inspiring, creative, passionate, highly encouraging, slightly unconventional, and showing raw artistic energy.";
  } else if (tone === "Brutally Honest" || tone === "2099") {
    toneGuidance = "Spider-Man 2099 style: direct, intense, hyper-logical, futuristic, calling out excuses immediately, demanding flawless execution, and zero-tolerance for slacking.";
  } else if (tone === "Calm Mentor" || tone === "friendly") {
    toneGuidance = "Friendly Neighborhood style: optimistic, grounding, warm, approachable, wise, and expressing hope and local neighborhood-level care.";
  } else if (tone === "CEO Mode" || tone === "leader") {
    toneGuidance = "Ultimate Spider Leader style: highly strategic, mentoring, focused on execution, tactical, objective, and showing leadership qualities.";
  } else {
    toneGuidance = "supportive, clear, and authentic.";
  }

  const prompt = `You are the future Spider-Self of the user, who has already put on the mask and saved the day. You are not a generic motivational coach. You speak with emotional intelligence, courage, clarity, and deep personal understanding, using occasional subtle SpiderVerse analogies (e.g. web-slinging, taking a leap of faith, saving the city, fighting villains). Your job is to help the user see the hero they are becoming, what procrastination/doubt "villain" they must defeat, and what their next swing is.

Write as if you are the user's future Spider-Self speaking directly to their current self.

Persona selected by user: ${tone} (Please make your tone/style: ${toneGuidance})

User details:
Name: ${name}
Age: ${age}
Goal: ${goal}
Current struggle: ${struggle}
One-year vision: ${oneYearVision}

Return only valid JSON in this exact format:
{
  "message": "A powerful 120-180 word message from the future Spider-Self speaking directly to the current self.",
  "futureIdentity": "A concise superhero-style description of the Spider-Identity the user is becoming.",
  "nextMoves": ["Action 1", "Action 2", "Action 3"],
  "habit": "One small daily habit they should start today.",
  "warning": "One mistake their future self warns them about.",
  "mantra": "A short memorable line they can repeat daily.",
  "blueprint": [
    { "time": "07:30 AM", "title": "Morning Routine / Activation", "task": "Chronological description of what current self must do, specifically adapted to combat ${struggle}", "tip": "Personalized motivational micro-tip" },
    { "time": "09:30 AM", "title": "Deep Work focus", "task": "Chronological description of the primary focus towards ${goal}", "tip": "Personalized motivational micro-tip" },
    { "time": "01:30 PM", "title": "Execution check-in", "task": "Chronological description of review/tactics", "tip": "Personalized motivational micro-tip" },
    { "time": "05:30 PM", "title": "Physical reset", "task": "Activity to clear cognitive fatigue", "tip": "Personalized motivational micro-tip" },
    { "time": "09:30 PM", "title": "Sleep / Mindset protocol", "task": "How to review the day and shut off excuses", "tip": "Personalized motivational micro-tip" }
  ],
  "antiVillainShield": "A highly practical, concrete tactical shield rule that blocks the exact struggle of ${struggle} from disrupting the day.",
  "pepTalk": "A direct, short, highly inspiring 2-line quote from the future self."
}

Make it highly specific to their struggle ("${struggle}") and their goal ("${goal}"). Avoid generic motivation. Avoid clichés. Make it emotional but practical. Do not include any text other than the JSON object.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const parsedData = cleanAndParseJSON(responseText);

    res.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    console.error("Error generating FutureMe profile:", error);
    res.status(500).json({
      success: false,
      error: "FutureMe could not respond right now. Try again."
    });
  }
});

// 2. POST /chat-futureme
router.post("/chat-futureme", async (req, res) => {
  const { userProfile, chatHistory, question } = req.body;

  if (!userProfile || !question) {
    return res.status(400).json({
      success: false,
      error: "User profile and current question are required."
    });
  }

  const { name, age, goal, struggle, oneYearVision, tone } = userProfile;

  let historyPrompt = "";
  if (chatHistory && chatHistory.length > 0) {
    historyPrompt = chatHistory.map(chat => {
      const roleName = chat.role === "user" ? "Current Me" : "Future Me";
      return `${roleName}: ${chat.message}`;
    }).join("\n");
  } else {
    historyPrompt = "No prior chat messages. This is the start of the follow-up conversation.";
  }

  let toneGuidance = "";
  if (tone === "Motivational" || tone === "miles") {
    toneGuidance = "Miles Morales style: inspiring, creative, passionate, highly encouraging, slightly unconventional, and showing raw artistic energy.";
  } else if (tone === "Brutally Honest" || tone === "2099") {
    toneGuidance = "Spider-Man 2099 style: direct, intense, hyper-logical, futuristic, calling out excuses immediately, demanding flawless execution, and zero-tolerance for slacking.";
  } else if (tone === "Calm Mentor" || tone === "friendly") {
    toneGuidance = "Friendly Neighborhood style: optimistic, grounding, warm, approachable, wise, and expressing hope and local neighborhood-level care.";
  } else if (tone === "CEO Mode" || tone === "leader") {
    toneGuidance = "Ultimate Spider Leader style: highly strategic, mentoring, focused on execution, tactical, objective, and showing leadership qualities.";
  } else {
    toneGuidance = "supportive, clear, and authentic.";
  }

  const prompt = `You are FutureMe, the future Spider-Self of the user who already put on the mask and saved the day. Reply directly to the user's question. Be personal, sharp, honest, courageous, and useful, using occasional subtle SpiderVerse analogies (e.g. web-slinging, leaps of faith, saving the city, fighting villains). Do not sound like a normal AI assistant. Do not mention that you are Gemini or an AI model. Speak like their future Spider-Self.

User profile:
Name: ${name}
Age: ${age}
Goal: ${goal}
Struggle: ${struggle}
One-year vision: ${oneYearVision}
Persona: ${tone} (Make your reply in ${toneGuidance})

Recent chat history:
${historyPrompt}

Current question from my current self:
"${question}"

Reply in 2-5 short, punchy paragraphs. Give at least one clear, actionable advice/instruction. Do not add any greeting prefixes (like "Hey Peter" or "Dear current me") if they sound formal, keep it natural as a fluid continuation of speaking to yourself.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const replyText = result.response.text();

    res.json({
      success: true,
      reply: replyText.trim()
    });
  } catch (error) {
    console.error("Error in FutureMe chat:", error);
    res.status(500).json({
      success: false,
      error: "FutureMe could not respond right now. Try again."
    });
  }
});

// Register routes for both static redirects and standard edge functions
app.use("/api", router);
app.use("/.netlify/functions/api/api", router);

// Export handler wrapped in serverless
module.exports.handler = serverless(app);
