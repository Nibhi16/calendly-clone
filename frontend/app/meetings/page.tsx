'use client';

import { useEffect, useState } from 'react';
import MeetingCard from '../../components/MeetingCard';
import { CalendarClock, Clock3 } from 'lucide-react';

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

type Meeting = Parameters<typeof MeetingCard>[0]['meeting'];

type TabKey = 'upcoming' | 'past';

export default function MeetingsPage() {
  const [upcoming, setUpcoming] = useState<Meeting[]>([]);
  const [past, setPast] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');

  async function fetchMeetings() {
    setLoading(true);

    try {
      const [upRes, pastRes] = await Promise.all([
        fetch(`${apiBase}/bookings/upcoming`),
        fetch(`${apiBase}/bookings/past`)
      ]);

      const [upData, pastData] = await Promise.all([
        upRes.json(),
        pastRes.json()
      ]);

      // Ensure responses are always arrays
      const safeUpcoming = Array.isArray(upData)
        ? upData
        : upData?.data || [];

      const safePast = Array.isArray(pastData)
        ? pastData
        : pastData?.data || [];

      setUpcoming(safeUpcoming);
      setPast(safePast);

    } catch (error) {
      console.error('Failed to fetch meetings:', error);
      setUpcoming([]);
      setPast([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMeetings();
  }, []);

  async function handleCancel(id: string) {
    try {
      await fetch(`${apiBase}/bookings/${id}`, {
        method: 'DELETE'
      });

      fetchMeetings();
    } catch (error) {
      console.error('Failed to cancel meeting:', error);
    }
  }

  const currentList =
    activeTab === 'upcoming' ? upcoming : past;

  return (
    <div className="space-y-8">

      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-900">
          Meetings
        </h1>

        <p className="text-sm text-gray-600">
          Review upcoming and past meetings scheduled via MeetFlow.
        </p>
      </div>

      {/* Tabs */}
      <div className="card p-2">
        <div className="inline-flex rounded-lg bg-slate-50 p-1">

          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-base font-medium ${
              activeTab === 'upcoming'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <CalendarClock className="h-4 w-4" />
            Upcoming
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-base font-medium ${
              activeTab === 'past'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Clock3 className="h-4 w-4" />
            Past
          </button>

        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-base text-gray-600">
          Loading meetings...
        </p>
      ) : (
        <div className="space-y-4">

          {currentList.length === 0 ? (
            <div className="card p-6 flex flex-col items-center justify-center gap-3 text-center">

              <CalendarClock className="h-8 w-8 text-gray-400" />

              <p className="text-base font-medium text-gray-900">
                {activeTab === 'upcoming'
                  ? 'No upcoming meetings yet'
                  : 'No past meetings yet'}
              </p>

              <p className="text-sm text-gray-600 max-w-md">
                Share your MeetFlow booking link to start getting meetings
                on your calendar.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {Array.isArray(currentList) &&
                currentList.map((m) => (
                  <MeetingCard
                    key={m.id}
                    meeting={m}
                    onCancel={
                      activeTab === 'upcoming'
                        ? handleCancel
                        : undefined
                    }
                  />
                ))}

            </div>
          )}

        </div>
      )}
    </div>
  );
}