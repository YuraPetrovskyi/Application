import dayjs from "dayjs";
import type { CalendarEvent, AppView } from "./types";

interface Props {
  events: CalendarEvent[];
  currentDate: Date;
  onNavigate: (date: Date) => void;
  onViewChange: (view: AppView) => void;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function YearView({
  events,
  currentDate,
  onNavigate,
  onViewChange,
}: Props) {
  const currentYear = dayjs(currentDate).year();
  const eventDays = new Set(
    events.map((e) => dayjs(e.start).format("YYYY-MM-DD")),
  );
  const todayStr = dayjs().format("YYYY-MM-DD");
  const currentMonthIndex = dayjs().month();
  const currentYearNow = dayjs().year();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }, (_, m) => {
        const monthStart = dayjs(new Date(currentYear, m, 1));
        const daysInMonth = monthStart.daysInMonth();
        const offset = monthStart.day();
        const isCurrentMonth =
          m === currentMonthIndex && currentYear === currentYearNow;
        return (
          <div
            key={m}
            className={`rounded-xl border-2 p-3 ${isCurrentMonth ? "bg-green-50 border-green-300" : "bg-white border-gray-300"}`}
          >
            <button
              onClick={() => {
                onNavigate(monthStart.toDate());
                onViewChange("month");
              }}
              className="w-full text-sm font-semibold text-gray-800 mb-2 text-center hover:text-indigo-600 transition-colors"
            >
              {monthStart.format("MMMM")}
            </button>
            <div className="grid grid-cols-7 mb-1">
              {DAY_LABELS.map((d, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium text-gray-400 text-center"
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: offset }, (_, i) => (
                <span key={`o-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = dayjs(new Date(currentYear, m, day)).format(
                  "YYYY-MM-DD",
                );
                const isToday = dateStr === todayStr;
                const hasEvent = eventDays.has(dateStr);
                return (
                  <button
                    key={day}
                    onClick={() => {
                      onNavigate(new Date(currentYear, m, day));
                      onViewChange("day");
                    }}
                    className={`text-[11px] w-5 h-5 mx-auto rounded-full flex items-center justify-center leading-none transition-colors ${
                      isToday
                        ? "bg-indigo-600 text-white font-bold"
                        : hasEvent
                          ? "bg-indigo-100 text-indigo-800 font-semibold hover:bg-indigo-200"
                          : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
