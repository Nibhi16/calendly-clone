'use client';

import { useEffect, useState } from 'react';
import EventTypeCard, { EventType } from '../../components/EventTypeCard';

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function fetchEventTypes() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/event-types`);
      const data = await res.json();

      // Ensure we always store an array
      const safeData = Array.isArray(data) ? data : data?.data || [];

      setEventTypes(safeData);
    } catch (err) {
      console.error('Failed to fetch event types:', err);
      setEventTypes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEventTypes();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${apiBase}/event-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          durationMinutes,
          slug,
          visibility: 'PUBLIC'
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || 'Failed to create event type.');
        return;
      }

      const created = await res.json();

      setEventTypes((prev) => [...prev, created]);

      setTitle('');
      setSlug('');
      setDurationMinutes(30);
    } catch (err) {
      console.error(err);
      setError('Failed to create event type.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`${apiBase}/event-types/${id}`, { method: 'DELETE' });
      setEventTypes((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  async function handleUpdate(
    update: Pick<EventType, 'id' | 'title' | 'durationMinutes' | 'slug'>
  ) {
    setError(null);

    try {
      const res = await fetch(`${apiBase}/event-types/${update.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: update.title,
          durationMinutes: update.durationMinutes,
          slug: update.slug
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || 'Failed to update event type.');
        return;
      }

      const updated = await res.json();

      setEventTypes((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to update event type.');
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Event types
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create MeetFlow booking links for different meeting lengths.
        </p>
      </div>

      <form
        className="card p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        onSubmit={handleCreate}
      >
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            min={15}
            step={15}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            Slug
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. 30-min-meeting"
            className="input"
          />
        </div>

        <div>
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Create
          </button>
        </div>
      </form>

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4">
        {loading ? (
          <p className="text-base text-gray-600 dark:text-gray-400">
            Loading event types...
          </p>
        ) : eventTypes.length === 0 ? (
          <div className="card p-6 text-center space-y-2">
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              No event types yet
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create your first event type to start sharing booking links.
            </p>
          </div>
        ) : (
          Array.isArray(eventTypes) &&
          eventTypes.map((et) => (
            <EventTypeCard
              key={et.id}
              eventType={et}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}