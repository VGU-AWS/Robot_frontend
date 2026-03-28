import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Robot Frontend',
  description: 'A Next.js + Tailwind starter app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
