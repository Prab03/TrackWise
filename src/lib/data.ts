import { Income, Expense, Budget, expenseCategories } from '@/lib/types';
import { subDays, formatISO } from 'date-fns';

const today = new Date();

export const initialIncomes: Income[] = [
  {
    id: '1',
    source: 'Monthly Salary',
    amount: 5000,
    date: formatISO(subDays(today, 15)),
  },
  {
    id: '2',
    source: 'Freelance Project',
    amount: 750,
    date: formatISO(subDays(today, 5)),
  },
];

export const initialExpenses: Expense[] = [
  {
    id: '1',
    category: 'Rent',
    amount: 1500,
    date: formatISO(subDays(today, 28)),
    description: 'Monthly Rent',
    isRecurring: true,
  },
  {
    id: '2',
    category: 'Food',
    amount: 75.5,
    date: formatISO(subDays(today, 3)),
    description: 'Groceries',
    isRecurring: false,
  },
  {
    id: '3',
    category: 'Transport',
    amount: 50,
    date: formatISO(subDays(today, 2)),
    description: 'Gasoline',
    isRecurring: false,
  },
  {
    id: '4',
    category: 'Entertainment',
    amount: 45,
    date: formatISO(subDays(today, 1)),
    description: 'Movie tickets',
    isRecurring: false,
  },
  {
    id: '5',
    category: 'Utilities',
    amount: 120,
    date: formatISO(subDays(today, 10)),
    description: 'Electricity Bill',
    isRecurring: true,
  },
  {
    id: '6',
    category: 'Shopping',
    amount: 200,
    date: formatISO(subDays(today, 7)),
    description: 'New clothes',
    isRecurring: false,
  },
  {
    id: '7',
    category: 'Health',
    amount: 60,
    date: formatISO(subDays(today, 12)),
    description: 'Pharmacy',
    isRecurring: false,
  },
  {
    id: '8',
    category: 'Food',
    amount: 30,
    date: formatISO(subDays(today, 1)),
    description: 'Lunch with colleagues',
    isRecurring: false,
  },
];

export const initialBudgets: Budget[] = [
  { id: '1', category: 'Food', limit: 500 },
  { id: '2', category: 'Transport', limit: 150 },
  { id: '3', category: 'Entertainment', limit: 200 },
  { id: '4', category: 'Shopping', limit: 300 },
];
