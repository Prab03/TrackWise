'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { budgetSuggestions } from '@/ai/flows/budget-suggestions';

export default function AssistantPage() {
  const { incomes, expenses } = useStore();
  const [financialGoals, setFinancialGoals] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSuggestions([]);
    try {
      const result = await budgetSuggestions({
        income: totalIncome,
        expenses: expenses.map((e) => ({ category: e.category, amount: e.amount })),
        financialGoals: financialGoals || undefined,
      });
      setSuggestions(result.suggestions);
    } catch (err) {
      console.error(err);
      setError('Something went wrong generating suggestions. Check that your API key is set correctly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> AI Budgeting Assistant
          </CardTitle>
          <CardDescription>
            Get personalized budgeting suggestions based on your income and spending.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Financial goals (optional)
            </label>
            <Textarea
              placeholder="e.g. Save ₹10,000 a month, pay off a loan, build an emergency fund..."
              value={financialGoals}
              onChange={(e) => setFinancialGoals(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              'Get Suggestions'
            )}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 list-disc pl-5">
              {suggestions.map((s, i) => (
                <li key={i} className="text-sm">{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}