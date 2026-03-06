import dayjs from "dayjs";
import type { CalendarEvent } from "./types";

interface Props {
  events: CalendarEvent[];
  currentDate: Date;
  onSelectEvent: (e: CalendarEvent) => void;
}

export default function DayView({ events, currentDate, onSelectEvent }: Props) {
  const day = dayjs(currentDate);
  const dateStr = day.format("YYYY-MM-DD");
  const isToday = dateStr === dayjs().format("YYYY-MM-DD");

  const dayEvents = events
    .filter((e) => dayjs(e.start).format("YYYY-MM-DD") === dateStr)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div
        className={`px-6 py-4 border-b border-gray-100 ${isToday ? "bg-indigo-50" : "bg-gray-50"}`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${isToday ? "text-indigo-400" : "text-gray-400"}`}
        >
          {day.format("dddd")}
        </p>
        <p
          className={`text-2xl font-bold ${isToday ? "text-indigo-700" : "text-gray-800"}`}
        >
          {day.format("D MMMM YYYY")}
        </p>
      </div>

      {dayEvents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400">No events on this day.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {dayEvents.map((e) => (
            <button
              key={e.id}
              onClick={() => onSelectEvent(e)}
              className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="text-center shrink-0 w-14">
                <p className="text-base font-bold text-indigo-600">
                  {dayjs(e.start).format("H:mm")}
                </p>
                <p className="text-xs text-gray-400">
                  {dayjs(e.end).format("H:mm")}
                </p>
              </div>
              <div className="w-0.5 h-9 bg-indigo-200 rounded-full shrink-0" />
              <p className="flex-1 text-sm font-semibold text-gray-900 truncate">
                {e.title}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
