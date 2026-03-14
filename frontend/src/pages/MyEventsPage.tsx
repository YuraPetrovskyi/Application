import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { fetchMyEvents } from "../store/slices/eventsSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import { Plus, ChevronRight, ChevronLeft } from "lucide-react";
import type { AppView, CalendarEvent } from "../components/calendar/types";
import MonthView from "../components/calendar/MonthView";
import WeekView from "../components/calendar/WeekView";
import DayView from "../components/calendar/DayView";
import AgendaView from "../components/calendar/AgendaView";
import YearView from "../components/calendar/YearView";

const VIEWS: { key: AppView; label: string }[] = [
  { key: "month", label: "Month" },
  { key: "week", label: "Week" },
  { key: "day", label: "Day" },
  { key: "agenda", label: "Agenda" },
  { key: "year", label: "Year" },
];

export default function MyEventsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { myEvents, loading } = useAppSelector((s) => s.events);
  const [view, setView] = useState<AppView>(
    () => (localStorage.getItem("calendarView") as AppView | null) ?? "month",
  );

  const handleSetView = (v: AppView) => {
    localStorage.setItem("calendarView", v);
    setView(v);
  };
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const saved = localStorage.getItem("calendarDate");
    return saved ? new Date(saved) : new Date();
  });

  const handleDateChange = (date: Date) => {
    localStorage.setItem("calendarDate", date.toISOString());
    setCurrentDate(date);
  };

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
    handleDateChange(
      view === "month"
        ? dayjs(currentDate).subtract(1, "month").toDate()
        : view === "agenda"
          ? dayjs(currentDate).subtract(30, "day").toDate()
          : view === "day"
            ? dayjs(currentDate).subtract(1, "day").toDate()
            : view === "year"
              ? dayjs(currentDate).subtract(1, "year").toDate()
              : dayjs(currentDate).subtract(1, "week").toDate(),
    );
  };

  const goNext = () => {
    handleDateChange(
      view === "month"
        ? dayjs(currentDate).add(1, "month").toDate()
        : view === "agenda"
          ? dayjs(currentDate).add(30, "day").toDate()
          : view === "day"
            ? dayjs(currentDate).add(1, "day").toDate()
            : view === "year"
              ? dayjs(currentDate).add(1, "year").toDate()
              : dayjs(currentDate).add(1, "week").toDate(),
    );
  };

  const navLabel =
    view === "month"
      ? dayjs(currentDate).format("MMMM YYYY")
      : view === "agenda"
        ? `${dayjs(currentDate).format("MMM D")} - ${dayjs(currentDate).add(29, "day").format("MMM D, YYYY")}`
        : view === "day"
          ? dayjs(currentDate).format("ddd, MMM D, YYYY")
          : view === "year"
            ? String(dayjs(currentDate).year())
            : (() => {
                const start = dayjs(currentDate).startOf("week");
                const end = dayjs(currentDate).endOf("week");
                return `${start.format("MMM D")} - ${end.format("MMM D, YYYY")}`;
              })();

  if (loading) return <LoadingSpinner />;

  const sharedProps = {
    events: calendarEvents,
    currentDate,
    onSelectEvent: handleSelectEvent,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <Link
            to="/events/create"
            className="flex items-center text-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Create Event
          </Link>
        </div>
        <p className="text-gray-500 mt-1">
          View and manage your event calendar
        </p>
      </div>

      {/* Navigation toolbar */}
      <div className="mb-4 flex items-center justify-center sm:justify-between rounded-xl px-2 py-3 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600 text-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-lg font-semibold text-gray-800 min-w-[130px] text-center">
            {navLabel}
          </span>
          <button
            onClick={goNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600 text-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          {VIEWS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSetView(key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-xl text-gray-400">
            You are not part of any events yet.
          </p>
          <p className="text-gray-400 mt-2">Explore public events and join.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      ) : view === "month" ? (
        <MonthView
          {...sharedProps}
          onNavigate={handleDateChange}
          onViewChange={handleSetView}
        />
      ) : view === "week" ? (
        <WeekView {...sharedProps} />
      ) : view === "day" ? (
        <DayView {...sharedProps} />
      ) : view === "agenda" ? (
        <AgendaView {...sharedProps} />
      ) : (
        <YearView
          {...sharedProps}
          onNavigate={handleDateChange}
          onViewChange={handleSetView}
        />
      )}
    </div>
  );
}
