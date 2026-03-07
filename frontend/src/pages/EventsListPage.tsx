import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { fetchEvents } from "../store/slices/eventsSlice";
import EventCard from "../components/EventCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EventsListPage() {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((s) => s.events);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchEvents());
  }, []);

  const todayStart = dayjs().startOf("day");
  const upcomingEvents = events.filter(
    (e) => !dayjs(e.dateTime).isBefore(todayStart),
  );

  const filtered = query.trim()
    ? upcomingEvents.filter((e) =>
        [e.title, e.description, e.location].some((f) =>
          f.toLowerCase().includes(query.toLowerCase()),
        ),
      )
    : upcomingEvents;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover</h1>
        <p className="text-gray-500 mt-1">
          Find and join exciting events happening around you
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
        />
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">
            {query ? "No events found" : "No events yet"}
          </p>
          <p className="mt-1">
            {query ? "Try a different search" : "Be the first to create one!"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
