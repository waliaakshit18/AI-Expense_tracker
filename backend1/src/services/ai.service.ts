import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface ParsedExpense {
  amount: number;
  currency: string; // default 'INR'
  category: string;
  description: string;
  merchant?: string | null;
}

const CATEGORY_MAP: Record<string, string> = {
  "Food": "Food & Dining",
  "Transport": "Transport",
  "Shopping": "Shopping",
  "Entertainment": "Entertainment",
  "Bills": "Bills & Utilities",
  "Health": "Health",
  "Travel": "Travel",
  "Other": "Other",
};

export async function parseExpenseFromText(input: string): Promise<ParsedExpense | null> {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an AI that extracts expense data from natural language.
Return ONLY valid JSON with:
- amount (number)
- category (Food, Transport, Shopping, Entertainment, Bills, Health, Travel, Other)
- description (short text)
- merchant (optional)
        `,
        },
        { role: "user", content: input },
      ],
      temperature: 0,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);

    // Normalize & default values
    return {
      amount: parsed.amount,
      currency: parsed.currency || "INR",
      category: CATEGORY_MAP[parsed.category] || "Other",
      description: parsed.description,
      merchant: parsed.merchant ?? null,
    };
  } catch (err) {
    console.error("AI parse error:", err);
    return null;
  }
}
