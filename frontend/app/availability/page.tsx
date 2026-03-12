'use client';

import { useEffect, useState } from 'react';

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

type Availability = {
  id: string;
  dayOfWeek: string;
  startTime: number;
  endTime: number;
  timeZone: string;
};

const dayOptions = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY'
];

function minutesToLabel(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}`;
}

export default function AvailabilityPage() {
  const [items, setItems] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dayOfWeek, setDayOfWeek] = useState('MONDAY');
  const [startTime, setStartTime] = useState(9 * 60);
  const [endTime, setEndTime] = useState(17 * 60);
  const [timeZone, setTimeZone] = useState('UTC');

  async function fetchAvailability() {
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/availability`);
      const data = await res.json();

      // Ensure we always store an array
      const safeData = Array.isArray(data) ? data : data?.data || [];

      setItems(safeData);

    } catch (err) {
      console.error('Failed to fetch availability:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAvailability();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (endTime <= startTime) {
      setError('End time must be after start time.');
      return;
    }

    const overlaps = items.some((a) => {
      if (a.dayOfWeek !== dayOfWeek) return false;
      return !(a.endTime <= startTime || a.startTime >= endTime);
    });

    if (overlaps) {
      setError('This window overlaps with an existing one for that day.');
      return;
    }

    try {
      const res = await fetch(`${apiBase}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek,
          startTime,
          endTime,
          timeZone
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || 'Failed to create availability window.');
        return;
      }

      const created = await res.json();
      setItems((prev) => [...prev, created]);

    } catch (err) {
      console.error(err);
      setError('Failed to create availability window.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`${apiBase}/availability/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  return (
    <div className="space-y-8">

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Availability
        </h1>

        <p className="text-sm text-muted">
          Define your weekly working hours. MeetFlow generates slots from
          these windows.
        </p>
      </div>

      {/* CREATE FORM */}

      <form
        className="card p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        onSubmit={handleCreate}
      >

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Day of week
          </label>

          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="input bg-white text-sm"
          >
            {dayOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Start time
          </label>

          <input
            type="time"
            value={minutesToLabel(startTime)}
            onChange={(e) => {
              const [h, m] = e.target.value.split(':').map(Number);
              setStartTime(h * 60 + m);
            }}
            className="input"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            End time
          </label>

          <input
            type="time"
            value={minutesToLabel(endTime)}
            onChange={(e) => {
              const [h, m] = e.target.value.split(':').map(Number);
              setEndTime(h * 60 + m);
            }}
            className="input"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Timezone
          </label>

          <input
            type="text"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            placeholder="e.g. America/New_York"
            className="input"
          />
        </div>

        <div>
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Add window
          </button>
        </div>

      </form>

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {/* LIST */}

      <div className="space-y-3">

        {loading ? (
          <p className="text-sm text-muted">
            Loading availability...
          </p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted">
            No availability windows defined yet.
          </p>
        ) : (

          <div className="grid gap-3 md:grid-cols-2">

            {Array.isArray(items) &&
              items.map((a) => (

                <div
                  key={a.id}
                  className="card px-5 py-4 flex items-center justify-between text-sm"
                >

                  <div>
                    <p className="font-medium text-slate-900">
                      {a.dayOfWeek} • {minutesToLabel(a.startTime)}–
                      {minutesToLabel(a.endTime)}
                    </p>

                    <p className="text-xs text-muted mt-1">
                      {a.timeZone}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    className="btn-danger"
                    aria-label="Delete availability window"
                  >
                    🗑️
                  </button>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}