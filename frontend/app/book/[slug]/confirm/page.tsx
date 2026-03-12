'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle2, CalendarClock, Mail, User } from 'lucide-react';
import { format } from 'date-fns';

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get('title') ?? 'Meeting';
  const startTime = searchParams.get('startTime');
  const guestEmail = searchParams.get('guestEmail');
  const hostName = searchParams.get('hostName') ?? 'Demo User';

  if (!startTime || !guestEmail) {
    return (
      <div className="card p-6 max-w-xl space-y-4">
        <p className="text-base text-gray-900">
          This confirmation link is missing required information.
        </p>
      </div>
    );
  }

  const start = new Date(startTime);

  return (
    <div className="max-w-xl space-y-6 card p-6">
      <div className="flex items-start gap-4">
        <CheckCircle2 className="h-8 w-8 text-green-500" />
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            You&apos;re booked!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            We&apos;ve scheduled your <span className="font-medium">{title}</span>.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-800">
          <CalendarClock className="h-4 w-4 text-gray-500" />
          <span>{format(start, 'EEEE, MMMM d, yyyy • p')}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-800">
          <User className="h-4 w-4 text-gray-500" />
          <span>Host: {hostName}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-800">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>Invitee: {guestEmail}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        In a production environment, MeetFlow would now send calendar invites and
        email confirmations with reschedule and cancellation links.
      </p>
    </div>
  );
}

