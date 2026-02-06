import { Router } from "express";
import { db } from "../databases/db";
import { parseExpenseFromText } from "../services/ai.service";

const router = Router();

// CREATE expense using AI
router.post("/", async (req, res) => {
    const { input } = req.body;
  
    if (!input || typeof input !== "string") {
      return res.status(400).json({ success: false, error: "Input text is required" });
    }
  
    try {
      const parsed = await parseExpenseFromText(input);
  
      if (!parsed || !parsed.amount) {
        // AI could not parse input
        return res.status(400).json({
          success: false,
          error: "Could not parse expense. Please include an amount.",
        });
      }
  
      const result = db.prepare(`
        INSERT INTO expenses 
        (amount, category, description, merchant, original_input)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        parsed.amount,
        parsed.category,
        parsed.description,
        parsed.merchant ?? null,
        input
      );
  
      const expense = db
        .prepare(`SELECT * FROM expenses WHERE id = ?`)
        .get(result.lastInsertRowid);
  
      res.status(201).json({ success: true, expense });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "AI parsing failed" });
    }
  });
  

// GET all expenses
router.get("/", (_req, res) => {
  const expenses = db
    .prepare(`SELECT * FROM expenses ORDER BY created_at DESC`)
    .all();

  res.json({ success: true, expenses });
});

// GET expense by id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const expense = db
    .prepare(`SELECT * FROM expenses WHERE id = ?`)
    .get(id);

  if (!expense) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.json(expense);
});

// UPDATE expense
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { amount, category, description, merchant } = req.body;

  if (!amount || !category || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = db.prepare(`
    UPDATE expenses
    SET amount = ?, category = ?, description = ?, merchant = ?
    WHERE id = ?
  `).run(amount, category, description, merchant ?? null, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.json({ success: true });
});

// DELETE expense
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const result = db
    .prepare(`DELETE FROM expenses WHERE id = ?`)
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.json({ success: true });
});

export default router;
