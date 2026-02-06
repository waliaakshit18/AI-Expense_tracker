import Database from "better-sqlite3";

export const db = new Database("expenses.db");

export function initDB() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'INR',
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      merchant TEXT,
      original_input TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  console.log("✅ Database initialized");
}