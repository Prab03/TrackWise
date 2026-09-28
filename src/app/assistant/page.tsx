'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Construction } from 'lucide-react';

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI Budgeting Assistant
          </CardTitle>
          <CardDescription>
            This feature is currently under construction.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
          <Construction className="h-16 w-16 text-muted-foreground" />
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Coming Soon!</h3>
            <p className="text-muted-foreground">
              We're working hard to bring this feature to you.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
