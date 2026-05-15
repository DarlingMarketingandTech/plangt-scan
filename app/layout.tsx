import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'FloraScan - AI Garden Assistant',
  description: 'Identify plants, diagnose diseases, and track your garden health with AI.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#F7F9F5] text-[#1A2E1A] font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
