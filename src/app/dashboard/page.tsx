'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { initialExpenses, initialIncomes, initialBudgets } from '@/lib/data';
import type { Expense, Income, Budget } from '@/lib/types';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, description }: { title: string; value: string; icon: React.ElementType; description: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);

  const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const balance = totalIncome - totalExpenses;

  const transactions = [...incomes, ...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getBudgetStatus = (category: string) => {
    const budget = budgets.find(b => b.category === category);
    if (!budget) return { spent: 0, limit: 0, percentage: 0 };
    
    const spent = expenses
      .filter(e => e.category === category)
      .reduce((acc, e) => acc + e.amount, 0);

    return { spent, limit: budget.limit, percentage: (spent / budget.limit) * 100 };
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Balance" value={formatCurrency(balance)} icon={Wallet} description="Your current account balance" />
        <StatCard title="Income" value={formatCurrency(totalIncome)} icon={ArrowUpRight} description="Total income this month" />
        <StatCard title="Expenses" value={formatCurrency(totalExpenses)} icon={ArrowDownLeft} description="Total expenses this month" />
        <StatCard title="Budgets" value={`${budgets.length} Active`} icon={TrendingUp} description="Your spending limits" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your last 5 transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category/Source</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{'description' in t ? t.description : t.source}</TableCell>
                    <TableCell>
                      <Badge variant={'source' in t ? 'default' : 'secondary'}>{'source' in t ? 'Income' : t.category}</Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${'source' in t ? 'text-green-600' : 'text-red-600'}`}>
                      {'source' in t ? '+' : '-'}{formatCurrency(t.amount)}
                    </TableCell>
                    <TableCell>{format(new Date(t.date), 'dd MMM, yyyy')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>How you're tracking against your budgets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets.map(budget => {
              const { spent, limit, percentage } = getBudgetStatus(budget.category);
              let progressColor = "bg-primary";
              if (percentage > 80 && percentage <= 100) progressColor = "bg-yellow-500";
              if (percentage > 100) progressColor = "bg-destructive";

              return (
                <div key={budget.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{budget.category}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(spent)} / {formatCurrency(limit)}
                    </span>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-2 [&>div]:bg-primary" />
                </div>
              );
            })}
             {budgets.length === 0 && <p className="text-sm text-muted-foreground">No budgets set yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
