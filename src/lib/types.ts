export const expenseCategories = [
  'Food',
  'Transport',
  'Rent',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Health',
  'Other',
] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];

export type Expense = {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  isRecurring: boolean;
};

export type Income = {
  id: string;
  source: string;
  amount: number;
  date: string;
};

export type Budget = {
  id: string;
  category: ExpenseCategory;
  limit: number;
};
