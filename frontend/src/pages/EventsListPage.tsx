import { useEffect } from "react";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { fetchEvents } from "../store/slices/eventsSlice";
import EventCard from "../components/EventCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EventsListPage() {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((s) => s.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, []);

  const todayStart = dayjs().startOf("day");
  const upcomingEvents = events.filter(
    (e) => !dayjs(e.dateTime).isBefore(todayStart),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover</h1>
        <p className="text-gray-500 mt-1">
          Find and join exciting events happening around you
        </p>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {!loading && upcomingEvents.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No events yet</p>
          <p className="mt-1">Be the first to create one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {upcomingEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
