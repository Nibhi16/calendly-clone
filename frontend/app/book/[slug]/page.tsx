'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Calendar from '../../../components/Calendar';
import TimeSlotList from '../../../components/TimeSlotList';
import BookingForm from '../../../components/BookingForm';

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

type Slot = {
  startTime: string;
  endTime: string;
};

export default function PublicBookingPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState<string>();

  async function fetchSlots(date: Date) {
    const dateStr = date.toISOString().split('T')[0];
    setLoadingSlots(true);
    try {
      const url = `${apiBase}/slots?slug=${encodeURIComponent(
        slug
      )}&date=${encodeURIComponent(dateStr)}`;
      const res = await fetch(url);
      const data = await res.json();
      setSlots(data);
      setSelectedStartTime(undefined);
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    if (slug) {
      fetchSlots(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function handleDateChange(date: Date) {
    setSelectedDate(date);
    fetchSlots(date);
  }

  function handleBooked(b: any) {
    const title = b?.eventType?.title ?? 'Meeting';
    const startTime = b.startTime;
    const guestEmail = b.guestEmail;
    const search = new URLSearchParams({
      title,
      startTime,
      guestEmail,
      hostName: 'Demo User'
    }).toString();
    router.push(`/book/${slug}/confirm?${search}`);
  }

  if (!slug) {
    return <p className="text-xs text-slate-500">Missing event link.</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] gap-6 lg:gap-8 mt-14 md:mt-0">
      <div>
        <Calendar
          selectedDate={selectedDate}
          onSelectDate={handleDateChange}
        />
      </div>
      <div className="space-y-4">
        <div className="card p-4 space-y-2">
          <div>
            <h2 className="text-lg font-medium text-slate-900">
              Select a time
            </h2>
            <p className="text-sm text-muted">
              {format(selectedDate, 'EEEE, MMM d')}
            </p>
          </div>
          {loadingSlots ? (
            <div className="mt-2 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-9 rounded-lg bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <TimeSlotList
              slots={slots}
              selectedStartTime={selectedStartTime}
              onSelectSlot={(slot) => setSelectedStartTime(slot.startTime)}
            />
          )}
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-900 mb-3">
            Your details
          </h3>
          <BookingForm
            selectedDate={selectedDate}
            selectedStartTime={selectedStartTime}
            eventSlug={slug}
            onBooked={handleBooked}
          />
        </div>
      </div>
    </div>
  );
}

