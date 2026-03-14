import dayjs from "dayjs";
import type { CalendarEvent } from "./types";

interface Props {
  events: CalendarEvent[];
  currentDate: Date;
  onSelectEvent: (e: CalendarEvent) => void;
}

export default function AgendaView({
  events,
  currentDate,
  onSelectEvent,
}: Props) {
  const rangeStart = dayjs(currentDate).startOf("day");
  const rangeEnd = rangeStart.add(30, "day");

  const filtered = events
    .filter((e) => {
      const d = dayjs(e.start);
      return !d.isBefore(rangeStart) && d.isBefore(rangeEnd);
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const grouped = filtered.reduce<Record<string, CalendarEvent[]>>((acc, e) => {
    const key = dayjs(e.start).format("YYYY-MM-DD");
    (acc[key] ??= []).push(e);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort();

  if (dates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 text-center py-16">
        <p className="text-gray-400">No events in this period.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden divide-y-2 divide-gray-200">
      {dates.map((dateStr) => {
        const date = dayjs(dateStr);
        const isToday = dateStr === dayjs().format("YYYY-MM-DD");
        return (
          <div key={dateStr}>
            <div
              className={`px-5 py-2.5 flex items-center gap-3 border-b-2 border-gray-300 ${isToday ? "bg-indigo-100" : "bg-gray-100"}`}
            >
              <span
                className={`text-2xl font-bold w-8 text-center ${isToday ? "text-indigo-600" : "text-gray-700"}`}
              >
                {date.format("D")}
              </span>
              <div>
                <p
                  className={`text-[11px] font-semibold uppercase tracking-wide ${isToday ? "text-indigo-500" : "text-gray-500"}`}
                >
                  {date.format("ddd")}
                </p>
                <p className="text-xs text-gray-500">
                  {date.format("MMMM YYYY")}
                </p>
              </div>
            </div>

            <div className="divide-y-2 divide-gray-200">
              {grouped[dateStr].map((e) => (
                <button
                  key={e.id}
                  onClick={() => onSelectEvent(e)}
                  className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-gray-200 transition-colors"
                >
                  <span className="text-sm text-gray-500 w-12 shrink-0 font-medium">
                    {dayjs(e.start).format("H:mm")}
                  </span>
                  <div className="w-0.5 h-9 bg-indigo-200 rounded-full shrink-0" />

                  <span className="flex-1 min-w-0 text-sm font-medium text-gray-700 truncate">
                    {e.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
