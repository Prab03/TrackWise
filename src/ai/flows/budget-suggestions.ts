'use server';

/**
 * @fileOverview AI-powered budget suggestion flow.
 *
 * This file defines a Genkit flow that analyzes user spending patterns and
 * provides personalized budgeting suggestions.
 *
 * @fileOverview A Genkit flow for providing budget suggestions
 * - budgetSuggestions - A function that handles the budget suggestion process.
 * - BudgetSuggestionsInput - The input type for the budgetSuggestions function.
 * - BudgetSuggestionsOutput - The return type for the budgetSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetSuggestionsInputSchema = z.object({
  income: z.number().describe('Total monthly income.'),
  expenses: z
    .array(
      z.object({
        category: z.string().describe('Expense category (e.g., food, rent).'),
        amount: z.number().describe('Amount spent in that category.'),
      })
    )
    .describe('Array of expenses with category and amount.'),
  financialGoals: z
    .string()
    .optional()
    .describe('Optional description of the user financial goals.'),
});
export type BudgetSuggestionsInput = z.infer<typeof BudgetSuggestionsInputSchema>;

const BudgetSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('Personalized budget suggestions based on spending patterns.'),
});
export type BudgetSuggestionsOutput = z.infer<typeof BudgetSuggestionsOutputSchema>;

export async function budgetSuggestions(input: BudgetSuggestionsInput): Promise<BudgetSuggestionsOutput> {
  return budgetSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetSuggestionsPrompt',
  input: {schema: BudgetSuggestionsInputSchema},
  output: {schema: BudgetSuggestionsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's income, expenses, and financial goals to provide personalized budgeting suggestions.

Income: {{{income}}}
Expenses:
{{#each expenses}}
- Category: {{{category}}}, Amount: {{{amount}}}
{{/each}}

{{#if financialGoals}}
Financial Goals: {{{financialGoals}}}
{{/if}}

Based on this information, provide a list of specific and actionable budgeting suggestions to help the user optimize their spending and achieve their financial goals. Be concise, clear and specific.
`,
});

const budgetSuggestionsFlow = ai.defineFlow(
  {
    name: 'budgetSuggestionsFlow',
    inputSchema: BudgetSuggestionsInputSchema,
    outputSchema: BudgetSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
