'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { initialExpenses, initialBudgets } from '@/lib/data';
import { useStore } from '@/lib/store';
import type { Budget, Expense } from '@/lib/types';
import { expenseCategories, ExpenseCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const budgetSchema = z.object({
  limit: z.coerce.number().positive('Limit must be a positive number.'),
  category: z.enum(expenseCategories),
});

export default function BudgetsPage() {
  const { budgets, setBudgets, expenses } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { limit: 100, category: 'Food' },
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const onSubmit = (values: z.infer<typeof budgetSchema>) => {
    const existingBudget = budgets.find(b => b.category === values.category);
    if(existingBudget) {
        setBudgets(budgets.map(b => b.category === values.category ? {...b, limit: values.limit} : b));
        toast({ title: `Budget for ${values.category} updated!` });
    } else {
        const newBudget: Budget = {
            id: new Date().getTime().toString(),
            category: values.category,
            limit: values.limit,
        };
        setBudgets([...budgets, newBudget]);
        toast({ title: `Budget for ${values.category} created!` });
    }
    setIsDialogOpen(false);
    form.reset({ limit: 100, category: 'Food' });
  };
  
  const getBudgetStatus = (category: ExpenseCategory) => {
    const budget = budgets.find((b) => b.category === category);
    const spent = expenses
      .filter((e) => e.category === category)
      .reduce((acc, e) => acc + e.amount, 0);

    if (!budget) return { spent, limit: 0, percentage: 0, remaining: 0, overspent: spent > 0 ? spent : 0 };
    
    const remaining = budget.limit - spent;
    return {
      spent,
      limit: budget.limit,
      percentage: budget.limit > 0 ? (spent / budget.limit) * 100 : 100,
      remaining,
      overspent: spent - budget.limit,
    };
  };
  
  const handleDelete = (category: ExpenseCategory) => {
    setBudgets(budgets.filter(b => b.category !== category));
    toast({ title: `Budget for ${category} removed.`, variant: 'destructive' });
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Category Budgets</CardTitle>
            <CardDescription>Set and manage your monthly spending limits.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add/Edit Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Budget</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {expenseCategories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Limit</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit">Save Budget</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
            {budgets.length === 0 ? (
                <p className="text-muted-foreground">You haven't set any budgets yet.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {budgets.map((budget) => {
                        const { spent, limit, percentage, remaining } = getBudgetStatus(budget.category);
                        const isOver = percentage > 100;
                        const isNearing = percentage >= 80 && !isOver;
                        
                        return (
                            <Card key={budget.id} className="flex flex-col">
                                <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-medium">{budget.category}</CardTitle>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(budget.category)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="text-2xl font-bold">{formatCurrency(limit)}</div>
                                    <p className="text-xs text-muted-foreground">Budget Limit</p>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Spent</span>
                                            <span>{formatCurrency(spent)}</span>
                                        </div>
                                        <Progress value={Math.min(percentage, 100)} className={cn(isOver && 'bg-destructive/20 [&>div]:bg-destructive', isNearing && 'bg-yellow-500/20 [&>div]:bg-yellow-500')} />
                                        {isOver ? (
                                            <Alert variant="destructive" className="mt-2">
                                                <AlertTitle>Over Budget!</AlertTitle>
                                                <AlertDescription>You've overspent by {formatCurrency(Math.abs(remaining))}.</AlertDescription>
                                            </Alert>
                                        ) : (
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>Remaining</span>
                                                <span>{formatCurrency(remaining)}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
