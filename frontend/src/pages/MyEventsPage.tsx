import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { fetchMyEvents } from "../store/slices/eventsSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Event } from "../types";

const localizer = dayjsLocalizer(dayjs);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Event;
}

const VIEWS: { key: View; label: string }[] = [
  { key: "month", label: "Month" },
  { key: "week", label: "Week" },
  { key: "agenda", label: "Agenda" },
];

export default function MyEventsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { myEvents, loading } = useAppSelector((s) => s.events);
  const [view, setView] = useState<View>(
    () => (localStorage.getItem("calendarView") as View | null) ?? "month",
  );

  const handleSetView = (v: View) => {
    localStorage.setItem("calendarView", v);
    setView(v);
  };
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchMyEvents());
  }, []);

  const calendarEvents: CalendarEvent[] = myEvents.map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(event.dateTime),
    end: new Date(new Date(event.dateTime).getTime() + 60 * 60 * 1000),
    resource: event,
  }));

  const handleSelectEvent = (calEvent: CalendarEvent) => {
    navigate(`/events/${calEvent.id}`);
  };

  const goBack = () => {
    setCurrentDate(
      view === "month"
        ? dayjs(currentDate).subtract(1, "month").toDate()
        : view === "agenda"
          ? dayjs(currentDate).subtract(30, "day").toDate()
          : dayjs(currentDate).subtract(1, "week").toDate(),
    );
  };

  const goNext = () => {
    setCurrentDate(
      view === "month"
        ? dayjs(currentDate).add(1, "month").toDate()
        : view === "agenda"
          ? dayjs(currentDate).add(30, "day").toDate()
          : dayjs(currentDate).add(1, "week").toDate(),
    );
  };

  const navLabel =
    view === "month"
      ? dayjs(currentDate).format("MMMM YYYY")
      : view === "agenda"
        ? `${dayjs(currentDate).format("MMM D")} – ${dayjs(currentDate).add(29, "day").format("MMM D, YYYY")}`
        : (() => {
            const start = dayjs(currentDate).startOf("week");
            const end = dayjs(currentDate).endOf("week");
            return `${start.format("MMM D")} – ${end.format("MMM D, YYYY")}`;
          })();

  // Week view helpers
  const weekStart = dayjs(currentDate).startOf("week");
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));

  const getEventsForDay = (day: dayjs.Dayjs) =>
    calendarEvents
      .filter(
        (e) => dayjs(e.start).format("YYYY-MM-DD") === day.format("YYYY-MM-DD"),
      )
      .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <p className="text-gray-500 mt-1">
          View and manage your event calendar
        </p>
      </div>

      {/* Navigation toolbar */}
      <div className="mb-4 flex items-center justify-between bg-white rounded-xl px-8 py-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600 text-lg"
          >
            <span className="h-8">‹</span>
          </button>
          <span className="text-lg font-semibold text-gray-800 min-w-[130px] text-center">
            {navLabel}
          </span>
          <button
            onClick={goNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600 text-lg"
          >
            <span className="h-8">›</span>
          </button>
        </div>

        <div className="flex gap-2">
          {VIEWS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSetView(key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === key
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {myEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-red-200">
          <p className="text-xl text-gray-400">
            You are not part of any events yet.
          </p>
          <p className="text-gray-400 mt-2">Explore public events and join.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      ) : view === "week" ? (
        /* ── Custom week view ── */
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-gray-200">
            {weekDays.map((day) => {
              const isToday =
                day.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
              const events = getEventsForDay(day);
              return (
                <div
                  key={day.toString()}
                  className="min-h-[240px] flex flex-col"
                >
                  {/* Day header */}
                  <div
                    className={`px-2 py-3 text-center border-b border-gray-200 ${
                      isToday ? "bg-indigo-50" : "bg-gray-50"
                    }`}
                  >
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
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

                  {/* Events */}
                  <div className="flex-1 p-1.5 space-y-1 overflow-y-auto">
                    {events.length === 0 ? (
                      <p className="text-xs text-gray-300 text-center mt-6">
                        No Events
                      </p>
                    ) : (
                      events.map((e) => (
                        <div
                          key={e.id}
                          onClick={() => navigate(`/events/${e.id}`)}
                          title={e.title}
                          className="bg-indigo-50 border border-indigo-200 rounded px-1.5 py-1 cursor-pointer hover:bg-indigo-100 transition-colors"
                        >
                          <p className="text-[10px] text-indigo-400 font-semibold">
                            {dayjs(e.start).format("H:mm")}
                          </p>
                          <p className="text-xs text-indigo-800 font-medium truncate">
                            {e.title}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── Month / Agenda view via react-big-calendar ── */
        <div className="bg-white rounded-2xl p-4" style={{ height: 650 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            view={view}
            onView={handleSetView}
            date={currentDate}
            onNavigate={setCurrentDate}
            onSelectEvent={handleSelectEvent}
            toolbar={false}
            style={{ height: "100%" }}
            components={{
              event: ({ event }: { event: CalendarEvent }) => (
                <span className="flex items-baseline gap-1 truncate">
                  <span className="font-semibold shrink-0">
                    {dayjs(event.start).format("H:mm")}
                  </span>
                  <span className="truncate">{event.title}</span>
                </span>
              ),
            }}
            eventPropGetter={() => ({
              style: {
                backgroundColor: "#4f46e5",
                borderRadius: "6px",
                border: "none",
                color: "#fff",
                fontSize: "12px",
                overflow: "hidden",
                padding: "4px",
              },
            })}
          />
        </div>
      )}
    </div>
  );
}
