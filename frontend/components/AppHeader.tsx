'use client';

import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import InviteUserModal from './InviteUserModal';

type Props = {
  title?: string;
  description?: string;
};

export default function AppHeader({ title, description }: Props) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-border bg-card/60 backdrop-blur-sm px-8 py-4 dark:bg-slate-900/40 dark:border-slate-700">
        
        <div className="space-y-1">
          {title && (
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
          )}

          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Invite user"
          >
            <UserPlus className="h-5 w-5 text-gray-600 dark:text-gray-200" />
          </button>
        </div>

      </header>

      {/* IMPORTANT: Modal moved outside header */}
      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </>
  );
}