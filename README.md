AI Expense Tracker

A full-stack expense tracker that uses AI to parse natural language input into structured expenses. Built with React Native (Expo) for the mobile app, Node.js + TypeScript + Express for the backend, and Groq SDK for AI parsing.
Features

Add expenses using natural language, e.g., “Spent 500 on groceries at BigBazaar”.

AI automatically extracts amount, category, description, merchant.
List all expenses with time ago formatting.
Delete expenses.
Categories are displayed with emojis.
Persistent storage using SQLite.

Prerequisites
Node.js >= 18
npm or yarn
Expo CLI
iOS Simulator or Android device / Expo Go app
Groq API key

Project Structure
ai-expense-tracker/

├── backend/  # Node.js + Express backend
│   ├── src/

│   │   ├── services/

│   │   │   └── ai.service.ts

│   │   ├── routes/

│   │   │   └── expenses.ts

│   │   └── index.ts

│   ├── package.json

│   └── tsconfig.json

├── mobile/           # React Native (Expo) mobile app

│   ├── src/

│   │   └── services/api/expenses.ts

│   ├── App.tsx

│   ├── package.json

│   └── tsconfig.json

└── .env              # Contains GROQ_API_KEY

Setup Backend
Navigate to the backend folder:
cd backend
Install dependencies:
npm install
Create .env file in backend folder:
GROQ_API_KEY=your_actual_groq_api_key
Start the backend server:
npm run dev
Default port: 3000
Ensure the backend listens on all interfaces:
app.listen(3000, "0.0.0.0", () => console.log("Backend running on port 3000"));
Enable CORS:
import cors from "cors";
app.use(cors());
Setup Mobile (Expo)
Navigate to the mobile folder:

cd mobile
Install dependencies:
npm install
Update API_URL in src/services/api/expenses.ts:
// Replace with your Mac's local IP on the same Wi-Fi
const API_URL = "http://192.168.xx.xx:3000";

⚠️ localhost won’t work on a physical device.

Start the Expo project:
expo start
Scan the QR code with Expo Go (Android/iOS).
If using iOS Simulator, open with:
expo start --ios
Clear cache if needed:
expo start -c
Important Notes
Mobile app uses SDK 54+. Make sure Expo Go supports your SDK version.
Backend must be reachable from the device. Both must be on the same Wi-Fi.
.env file must contain a valid Groq API key.

If network requests fail:
Check your API_URL.
Make sure CORS is enabled on the backend.
Use your computer’s local IP instead of localhost.
Troubleshooting
Blank screen / network error: Make sure the backend URL is correct and accessible.
AI parsing errors: Check that GROQ_API_KEY is set in .env and server restarted.
TypeScript / Expo errors: Make sure packages match SDK version. Use:
npm install react@18 react-native@0.73 expo@~54 typescript@^5.3
iOS QR scan not working: Expo Go supports only the latest SDK. Either:
Upgrade mobile project to latest SDK
Use iOS Simulator instead

Commands

Backend
npm run dev      # Start backend with ts-node-dev

Mobile
npm start   # Starts Expo React Native mobile app
