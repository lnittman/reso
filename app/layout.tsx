import React from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import MainLayout from '@/src/components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';
import { AuthSync } from '@/src/components/auth/AuthSync';
import NextAuthProvider from '@/src/components/auth/NextAuthProvider';

export const metadata: Metadata = {
  title: 'reso - Social Music Discovery',
  description: 'AI-powered music discovery platform connecting people through shared musical interests',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <AuthSync />
          
          <MainLayout>
            {children}
          </MainLayout>
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
} 