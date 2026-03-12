import { useState } from 'react';

type Props = {
  selectedDate: Date;
  selectedStartTime?: string;
  eventSlug: string;
  onBooked: (booking: any) => void;
};

export default function BookingForm({
  selectedDate,
  selectedStartTime,
  eventSlug,
  onBooked
}: Props) {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStartTime) return;

    setSubmitting(true);
    setError(null);

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await fetch(`${apiBase}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventSlug,
          date: dateStr,
          startTime: selectedStartTime,
          guestName,
          guestEmail
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to create booking');
      }

      const booking = await res.json();
      onBooked(booking);
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Name
        </label>
        <input
          type="text"
          required
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Your full name"
          className="input"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          required
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          placeholder="you@example.com"
          className="input"
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      <button
        type="submit"
        disabled={!selectedStartTime || submitting}
        className="btn-primary w-full"
      >
        {submitting ? 'Booking...' : 'Confirm booking'}
      </button>
    </form>
  );
}

