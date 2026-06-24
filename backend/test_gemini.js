const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Checking API key. Length:", apiKey ? apiKey.length : 0);

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  const models = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-pro"
  ];
  
  for (const modelName of models) {
    try {
      console.log(`\n--- Testing model: ${modelName} ---`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, respond with 'Success' if you can read this.");
      console.log(`✅ Success for model ${modelName}! Response:`, result.response.text().trim());
      process.exit(0);
    } catch (e) {
      console.log(`❌ Failed for model ${modelName}. Error:`, e.message);
    }
  }
  
  console.log("\n❌ All tested models failed. Please verify API Key permissions.");
  process.exit(1);
}

run();
