'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import { AppShell } from '@/components/app-shell';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <title>TrackWise</title>
        <meta name="description" content="A modern budget and expense tracking application." />
      </head>
      <body className="font-body antialiased">
        {isAuthPage ? (
          <>
            {children}
          </>
        ) : (
          <AppShell>{children}</AppShell>
        )}
        <Toaster />
      </body>
    </html>
  );
}
