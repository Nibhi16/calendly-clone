import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EventTypeEditModal from './EventTypeEditModal';

export type EventType = {
  id: string;
  title: string;
  description?: string | null;
  durationMinutes: number;
  slug: string;
};

type Props = {
  eventType: EventType;
  onDelete?: (id: string) => void;
  onUpdate?: (update: Pick<EventType, 'id' | 'title' | 'durationMinutes' | 'slug'>) => Promise<void> | void;
};

export default function EventTypeCard({ eventType, onDelete, onUpdate }: Props) {
  const publicLink = `/book/${eventType.slug}`;
  const [editing, setEditing] = useState(false);

  async function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${publicLink}`
      );
    } catch {
      await navigator.clipboard.writeText(publicLink);
    }
  }

  return (
    <>
      <div className="card p-6 flex items-start justify-between gap-4 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {eventType.title}
          </h3>
          <span className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-slate-700 dark:text-blue-200">
            {eventType.durationMinutes} min
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Public link:{' '}
          <span className="font-mono text-xs text-primary">
            {publicLink}
          </span>
        </p>
        {eventType.description && (
          <p className="text-base text-gray-600 dark:text-gray-400">
            {eventType.description}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="btn-secondary text-xs px-3 py-1.5"
        >
          Copy link
        </button>
        {onUpdate && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-2"
            aria-label="Edit event type"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(eventType.id)}
            className="btn-danger flex items-center gap-2"
            aria-label="Delete event type"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span>Delete</span>
          </button>
        )}
      </div>
      </div>

      {onUpdate && (
        <EventTypeEditModal
          open={editing}
          eventType={eventType}
          onClose={() => setEditing(false)}
          onSave={onUpdate}
        />
      )}
    </>
  );
}

