import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay
} from 'date-fns';

type Props = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

export default function Calendar({ selectedDate, onSelectDate }: Props) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const rows: JSX.Element[] = [];
  let days: JSX.Element[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = isSameDay(day, selectedDate);

      days.push(
        <button
          type="button"
          key={day.toISOString()}
          onClick={() => onSelectDate(cloneDay)}
          className={`flex items-center justify-center h-9 w-9 rounded-full text-xs
            ${
              isCurrentMonth
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-400 dark:text-gray-500'
            }
            ${
              isSelected
                ? 'bg-primary text-white shadow-sm'
                : 'hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
            }`}
        >
          {format(day, 'd')}
        </button>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1" key={day.toISOString()}>
        {days}
      </div>
    );
    days = [];
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted uppercase tracking-wide">
            Select a date
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {format(selectedDate, 'MMMM yyyy')}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1 text-[10px] text-gray-400 dark:text-gray-500">
        {weekDays.map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="space-y-1">{rows}</div>
    </div>
  );
}

