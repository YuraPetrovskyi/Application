import dayjs from "dayjs";
import type { CalendarEvent } from "./types";
import { getTagColor } from "../../utils/tagColors";

interface Props {
  events: CalendarEvent[];
  currentDate: Date;
  onSelectEvent: (e: CalendarEvent) => void;
}

export default function WeekView({
  events,
  currentDate,
  onSelectEvent,
}: Props) {
  const weekStart = dayjs(currentDate).startOf("week");
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));
  const todayStr = dayjs().format("YYYY-MM-DD");

  const getEventsForDay = (day: dayjs.Dayjs) =>
    events
      .filter(
        (e) => dayjs(e.start).format("YYYY-MM-DD") === day.format("YYYY-MM-DD"),
      )
      .sort((a, b) => a.start.getTime() - b.start.getTime());

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden">
      <div className="grid grid-cols-7 divide-x-2 divide-gray-300">
        {weekDays.map((day) => {
          const isToday = day.format("YYYY-MM-DD") === todayStr;
          const dayEvents = getEventsForDay(day);
          return (
            <div key={day.toString()} className="min-h-[240px] flex flex-col">
              <div
                className={`px-2 py-3 text-center border-b-2 border-gray-300 ${
                  isToday ? "bg-indigo-100" : "bg-gray-100"
                }`}
              >
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {day.format("ddd")}
                </p>
                <p
                  className={`text-xl font-bold mt-0.5 ${
                    isToday ? "text-indigo-600" : "text-gray-800"
                  }`}
                >
                  {day.format("D")}
                </p>
              </div>

              <div className="flex-1 p-1.5 space-y-1 overflow-y-auto">
                {dayEvents.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center mt-6">
                    No Events
                  </p>
                ) : (
                  dayEvents.map((e) => {
                    const color = getTagColor(e.resource.tags?.[0]?.name);
                    return (
                      <div
                        key={e.id}
                        onClick={() => onSelectEvent(e)}
                        title={e.title}
                        className={`${color.bg} border ${color.border} rounded px-1.5 py-1 cursor-pointer ${color.hoverBg} transition-colors`}
                      >
                        <p
                          className={`text-[10px] font-semibold ${color.text} opacity-60`}
                        >
                          {dayjs(e.start).format("H:mm")}
                        </p>
                        <p
                          className={`text-xs ${color.text} font-medium truncate`}
                        >
                          {e.title}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
