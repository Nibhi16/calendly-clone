'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function InviteUserModal({ open, onClose }: Props) {
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState<'Viewer' | 'Editor' | 'Admin'>('Viewer');
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSuccess(null);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const hasEmail = emails.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasEmail) return;
    // In a real app you would call an invite API here.
    setSuccess('Invitations sent successfully.');
  }

  function stop(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 p-6 dark:bg-slate-800 dark:border-slate-700 transform transition-all scale-100"
        onClick={stop}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-slate-700 pb-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Invite collaborators
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Invite teammates to collaborate on scheduling and manage meetings together in MeetFlow.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Close invite modal"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
            </button>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-gray-800">
            <p className="font-semibold mb-1">Why invite collaborators?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Share event types with your team</li>
              <li>Coordinate meetings across multiple people</li>
              <li>Manage schedules from a single dashboard</li>
            </ul>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Email addresses
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You can invite one or multiple collaborators.
              </p>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100"
                placeholder="name@company.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
              <div className="sm:w-1/2 space-y-1">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Access level
                </label>
                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as 'Viewer' | 'Editor' | 'Admin')
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="sm:flex-1 flex justify-end">
                <button
                  type="submit"
                  disabled={!hasEmail}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Send invitation
                </button>
              </div>
            </div>

            {success && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {success}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

