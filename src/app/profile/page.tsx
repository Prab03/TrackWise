'use client';

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you'd clear session/token here
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person portrait" />
              <AvatarFallback>LM</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">Prabtej Singh</h2>
              <p className="text-muted-foreground">Prabtejsingh2003@gmail.com</p>
            </div>
          </div>
          <div className="grid gap-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Prabtej Singh" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="Prabtejsingh2003@gmail.com" readOnly />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" placeholder="Leave blank to keep the same" />
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <Button>Save Changes</Button>
            <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
