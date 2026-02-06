import axios from "axios";

const BASE_URL = "http://localhost:3000"; // or your backend URL

export interface Expense {
  id: number;
  amount: number;
  currency: string;
  category: string;
  description: string;
  merchant: string | null;
  original_input: string;
  created_at: string;
}

export async function addExpense(input: string): Promise<Expense> {
  const res = await axios.post(`${BASE_URL}/api/expenses`, { input });
  if (!res.data.success) throw new Error(res.data.error);
  return res.data.expense;
}

export async function getExpenses(): Promise<Expense[]> {
  const res = await axios.get(`${BASE_URL}/api/expenses`);
  if (!res.data.success) throw new Error("Failed to fetch expenses");
  return res.data.expenses;
}

export async function deleteExpense(id: number): Promise<void> {
  const res = await axios.delete(`${BASE_URL}/api/expenses/${id}`);
  if (!res.data.success) throw new Error(res.data.error);
}
