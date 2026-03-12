import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-page">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-8 py-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

