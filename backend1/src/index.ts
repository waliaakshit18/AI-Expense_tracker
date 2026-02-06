import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenses";




const app = express();

// ✅ middleware FIRST
app.use(cors());
app.use(express.json()); // ← THIS LINE MUST EXIST

// ✅ routes AFTER middleware
app.use("/expenses", expenseRoutes);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
