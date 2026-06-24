# FutureMe 🌌

A premium full-stack personal reflection application powered by the **Gemini API**. It helps users speak directly to a highly personalized mental projection of their future self based on their current goals, struggles, and ambitions.

Built under the **Khechar Brain** brand, utilizing modern Apple-style dark aesthetics, subtle neon gradient floating orbs, glassmorphic inputs, and a fully interactive conversational chat interface.

---

## 🛠️ Tech Stack
- **Frontend**: Premium HTML5, CSS3, vanilla JavaScript (fully responsive, custom animations).
- **Backend**: Node.js, Express.js.
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash).

---

## 📁 Directory Structure

```
futureme/
├── backend/
│   ├── server.js          # Express app, API endpoints & Gemini integration
│   ├── package.json       # Backend script definitions and dependencies
│   ├── .env               # Secure environment variables (Gemini API Key)
│   └── .env.example       # Template environment reference
├── frontend/
│   ├── index.html         # Portal form, synced outcome panels & chat frame
│   ├── style.css          # Premium Apple-like dark CSS and animations
│   └── script.js          # DOM controllers, state handlers, and fetch hooks
└── README.md              # Installation and run documentation (this file)
```

---

## 🚀 Installation & Running

### Step 1: Install Backend Dependencies
Open your terminal, navigate to the `backend` folder, and run:
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
Inside the `backend` folder, you will find `.env` and `.env.example`. Make sure you have your secure Gemini API Key saved:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```
*(The build is already pre-configured with your key in the `.env` file)*

### Step 3: Run the Server
Run the Express backend from the `backend` folder:
```bash
npm start
```

### Step 4: Open in Browser
Once the server starts up, open your web browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🔌 API Reference

### 1. `POST /api/generate-futureme`
Generates the comprehensive FutureMe profile and timeline transmission.

- **Request Body**:
  ```json
  {
    "name": "Nitish",
    "age": "23",
    "goal": "Build a successful AI startup",
    "struggle": "Lack of consistency",
    "oneYearVision": "Running a profitable AI company",
    "tone": "Brutally Honest"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "message": "...",
      "futureIdentity": "...",
      "nextMoves": ["...", "...", "..."],
      "habit": "...",
      "warning": "...",
      "mantra": "..."
    }
  }
  ```

### 2. `POST /api/chat-futureme`
Maintains conversational context and returns replies representing the user's future self.

- **Request Body**:
  ```json
  {
    "userProfile": {
      "name": "Nitish",
      "age": "23",
      "goal": "Build a successful AI startup",
      "struggle": "Lack of consistency",
      "oneYearVision": "Running a profitable AI company",
      "tone": "Brutally Honest"
    },
    "chatHistory": [
      {
        "role": "user",
        "message": "Will I actually make it?"
      },
      {
        "role": "futureme",
        "message": "Only if your daily actions stop negotiating with your dreams."
      }
    ],
    "question": "What should I focus on this week?"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "reply": "..."
  }
  ```

---

## 🧠 Dynamic Personas (Tones)
- **Calm Mentor**: Wise, grounding, peaceful, deep perspective.
- **Brutally Honest**: Direct, sharp, calls out excuses, exposes self-imposed boundaries.
- **Motivational**: Warm, inspiring, deeply encouraging, and supportive.
- **CEO Mode**: Strategic, metrics-oriented, tactical execution steps.
