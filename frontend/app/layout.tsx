import './globals.css';
import Layout from '../components/Layout';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-page text-slate-900 font-sans">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

