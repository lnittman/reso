import type { Metadata } from 'next';
import '@/app/globals.css';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from '@/components/auth/SessionProvider';

export const metadata: Metadata = {
  title: 'reso - Social Music Discovery',
  description: 'A social-first, AI-native music discovery platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
} 