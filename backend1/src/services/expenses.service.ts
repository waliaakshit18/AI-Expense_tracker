import { db } from "../databases/db";

export function createExpense(data: {
  amount: number;
  currency?: string;
  category: string;
  description: string;
  merchant?: string;
  original_input: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO expenses 
    (amount, currency, category, description, merchant, original_input)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.amount,
    data.currency ?? "INR",
    data.category,
    data.description,
    data.merchant ?? null,
    data.original_input
  );

  return { id: result.lastInsertRowid };
}

export function getAllExpenses() {
  return db.prepare(`SELECT * FROM expenses ORDER BY created_at DESC`).all();
}
