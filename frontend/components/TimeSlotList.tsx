type Slot = {
  startTime: string;
  endTime: string;
};

type Props = {
  slots: Slot[];
  selectedStartTime?: string;
  onSelectSlot: (slot: Slot) => void;
};

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function TimeSlotList({
  slots,
  selectedStartTime,
  onSelectSlot
}: Props) {
  if (!slots.length) {
    return (
      <p className="text-sm text-muted">
        No slots available for this date.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {slots.map((slot) => {
        const label = `${formatTime(slot.startTime)} – ${formatTime(
          slot.endTime
        )}`;
        const selected = selectedStartTime === slot.startTime;
        return (
          <button
            key={slot.startTime}
            type="button"
            onClick={() => onSelectSlot(slot)}
            className={`w-full text-left px-3 py-2 text-xs rounded-lg border transition ${
              selected
                ? 'border-blue-500 bg-primary-soft text-blue-700 shadow-sm dark:bg-slate-700 dark:text-blue-100'
                : 'border-border bg-white hover:border-blue-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

