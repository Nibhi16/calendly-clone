'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { EventType } from './EventTypeCard';

type Props = {
  open: boolean;
  eventType: EventType;
  onClose: () => void;
  onSave: (update: Pick<EventType, 'id' | 'title' | 'durationMinutes' | 'slug'>) => Promise<void> | void;
};

export default function EventTypeEditModal({
  open,
  eventType,
  onClose,
  onSave
}: Props) {
  const [title, setTitle] = useState(eventType.title);
  const [durationMinutes, setDurationMinutes] = useState(eventType.durationMinutes);
  const [slug, setSlug] = useState(eventType.slug);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(eventType.title);
    setDurationMinutes(eventType.durationMinutes);
    setSlug(eventType.slug);
  }, [open, eventType]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ id: eventType.id, title, durationMinutes, slug });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg card p-6 dark:bg-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Edit event type
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Update the name, duration, and booking URL slug.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Title
            </label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={15}
              step={15}
              className="input"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Slug
            </label>
            <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This becomes your public link: <span className="font-mono">/book/{slug || '...'}</span>
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

