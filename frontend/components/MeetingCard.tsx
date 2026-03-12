type Meeting = {
  id: string;
  startTime: string;
  endTime: string;
  guestName?: string | null;
  guestEmail: string;
  status: string;
  eventType?: {
    title: string;
  };
};

type Props = {
  meeting: Meeting;
  onCancel?: (id: string) => void;
};

function formatRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const date = start.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const startTime = start.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  const endTime = end.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${date} • ${startTime}–${endTime}`;
}

export default function MeetingCard({ meeting, onCancel }: Props) {
  const isCanceled = meeting.status === 'CANCELED';

  return (
    <div className="card p-6 flex items-start justify-between gap-4 hover:shadow-md transition-shadow">
      <div className="space-y-1">
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {meeting.eventType?.title ?? 'Meeting'}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formatRange(meeting.startTime, meeting.endTime)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          With {meeting.guestName || 'Guest'} ({meeting.guestEmail})
        </p>
        <span
          className={`inline-flex mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            meeting.status === 'CONFIRMED'
              ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-200'
              : meeting.status === 'CANCELED'
              ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200'
              : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200'
          }`}
        >
          {meeting.status}
        </span>
      </div>
      {onCancel && !isCanceled && (
        <button
          onClick={() => onCancel(meeting.id)}
          className="btn-danger"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

