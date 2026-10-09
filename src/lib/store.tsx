'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Expense, Income, Budget } from './types';
import { initialExpenses, initialIncomes, initialBudgets } from './data';

type StoreContextType = {
  expenses: Expense[];
  incomes: Income[];
  budgets: Budget[];
  setExpenses: (expenses: Expense[]) => void;
  setIncomes: (incomes: Income[]) => void;
  setBudgets: (budgets: Budget[]) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpensesState] = useState<Expense[]>(initialExpenses);
  const [incomes, setIncomesState] = useState<Income[]>(initialIncomes);
  const [budgets, setBudgetsState] = useState<Budget[]>(initialBudgets);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setExpensesState(loadFromStorage('trackwise-expenses', initialExpenses));
    setIncomesState(loadFromStorage('trackwise-incomes', initialIncomes));
    setBudgetsState(loadFromStorage('trackwise-budgets', initialBudgets));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem('trackwise-expenses', JSON.stringify(expenses));
  }, [expenses, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem('trackwise-incomes', JSON.stringify(incomes));
  }, [incomes, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem('trackwise-budgets', JSON.stringify(budgets));
  }, [budgets, loaded]);

  return (
    <StoreContext.Provider
      value={{
        expenses, incomes, budgets,
        setExpenses: setExpensesState,
        setIncomes: setIncomesState,
        setBudgets: setBudgetsState,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}