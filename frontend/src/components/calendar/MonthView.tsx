import dayjs from "dayjs";
import type { CalendarEvent, AppView } from "./types";

interface Props {
  events: CalendarEvent[];
  currentDate: Date;
  onSelectEvent: (e: CalendarEvent) => void;
  onNavigate: (date: Date) => void;
  onViewChange: (view: AppView) => void;
}

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE = 3;

export default function MonthView({
  events,
  currentDate,
  onSelectEvent,
  onNavigate,
  onViewChange,
}: Props) {
  const today = dayjs();
  const selectedStr = dayjs(currentDate).format("YYYY-MM-DD");
  const monthStart = dayjs(currentDate).startOf("month");
  const gridStart = monthStart.startOf("week");

  const weeks = Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => gridStart.add(w * 7 + d, "day")),
  );

  const getEventsForDay = (day: dayjs.Dayjs) =>
    events
      .filter(
        (e) => dayjs(e.start).format("YYYY-MM-DD") === day.format("YYYY-MM-DD"),
      )
      .sort((a, b) => a.start.getTime() - b.start.getTime());

  const openDay = (day: dayjs.Dayjs) => {
    onNavigate(day.toDate());
    onViewChange("day");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className="bg-gray-50 py-2.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="divide-y divide-gray-100">
        {weeks.map((week, wi) => {
          const hasCurrentMonth = week.some(
            (d) => d.month() === monthStart.month(),
          );
          if (wi === 5 && !hasCurrentMonth) return null;

          return (
            <div
              key={wi}
              className="grid grid-cols-7 divide-x divide-gray-100 min-h-[110px]"
            >
              {week.map((day) => {
                const isCurrentMonth = day.month() === monthStart.month();
                const isToday =
                  day.format("YYYY-MM-DD") === today.format("YYYY-MM-DD");
                const isSelected = day.format("YYYY-MM-DD") === selectedStr;
                const dayEvents = getEventsForDay(day);
                const visible = dayEvents.slice(0, MAX_VISIBLE);
                const overflow = dayEvents.length - MAX_VISIBLE;

                return (
                  <div
                    key={day.toString()}
                    className={`p-1.5 flex flex-col transition-colors ${
                      !isCurrentMonth
                        ? "bg-gray-50/60"
                        : isToday
                          ? "bg-green-50"
                          : isSelected
                            ? "bg-indigo-50"
                            : ""
                    }`}
                  >
                    <button
                      onClick={() => {
                        if (!isCurrentMonth) return;
                        onNavigate(day.toDate());
                        onViewChange("day");
                      }}
                      className={`self-start w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1 transition-colors ${
                        isToday
                          ? "bg-indigo-600 text-white font-bold"
                          : isSelected && isCurrentMonth
                            ? "bg-indigo-200 text-indigo-800 font-semibold"
                            : isCurrentMonth
                              ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
                              : "text-gray-300 cursor-default"
                      }`}
                    >
                      {day.format("D")}
                    </button>

                    <div className="space-y-0.5">
                      {visible.map((e) => (
                        <button
                          key={e.id}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            onSelectEvent(e);
                          }}
                          className="w-full text-left bg-indigo-50 border border-indigo-200 rounded px-1.5 py-0.5 text-[11px] font-medium text-indigo-800 truncate hover:bg-indigo-100 transition-colors"
                        >
                          {dayjs(e.start).format("H:mm")} {e.title}
                        </button>
                      ))}
                      {overflow > 0 && (
                        <button
                          onClick={() => openDay(day)}
                          className="text-[11px] text-indigo-500 font-semibold hover:text-indigo-700 pl-1"
                        >
                          +{overflow} more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
