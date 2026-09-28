'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Book,
  CircleDollarSign,
  Home,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const navItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/income',
    icon: CircleDollarSign,
    label: 'Income',
  },
  {
    href: '/expenses',
    icon: ShoppingBag,
    label: 'Expenses',
  },
  {
    href: '/budgets',
    icon: Book,
    label: 'Budgets',
  },
  {
    href: '/reports',
    icon: TrendingUp,
    label: 'Reports',
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);

  React.useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('sidebar_state='))
      ?.split('=')[1];
    if (cookieValue !== undefined) {
      setIsSidebarExpanded(cookieValue === 'true');
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsSidebarExpanded(open);
  };
  
  const handleLogout = () => {
    router.push('/login');
  };

  const getPageTitle = () => {
    const currentNavItem = navItems.find((item) => pathname.startsWith(item.href));
    if (currentNavItem) return currentNavItem.label;
    if (pathname.startsWith('/profile')) return 'Profile';
    return 'TrackWise';
  }

  return (
    <SidebarProvider
      defaultOpen={isSidebarExpanded}
      onOpenChange={handleOpenChange}
    >
      <Sidebar>
        <SidebarHeader className="p-4">
          <div
            className={cn(
              'flex items-center gap-2',
              !isSidebarExpanded && 'justify-center'
            )}
          >
            <Home className="size-7 text-primary" />
            <span
              className={cn(
                'text-xl font-bold',
                !isSidebarExpanded && 'hidden'
              )}
            >
              TrackWise
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4" />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
          <div className="flex items-center gap-2">
            {isMobile && <SidebarTrigger />}
            <h1 className="text-lg font-semibold md:text-xl">
              {getPageTitle()}
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person" alt="@user" />
                  <AvatarFallback>LM</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Prabtej Singh</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Prabtejsingh2003@gmail.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
