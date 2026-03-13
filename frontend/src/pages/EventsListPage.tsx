import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { fetchEvents } from "../store/slices/eventsSlice";
import { fetchTags } from "../store/slices/tagsSlice";
import EventCard from "../components/EventCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import PerPageSelector from "../components/PerPageSelector";
import { useUIStore } from "../store/useUIStore";
import { getTagColor } from "../utils/tagColors";

export default function EventsListPage() {
  const dispatch = useAppDispatch();
  const { events, loading, error, pagination } = useAppSelector(
    (s) => s.events,
  );
  const { tags } = useAppSelector((s) => s.tags);
  const { eventsPerPage, setEventsPerPage } = useUIStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const setPage = (p: number) =>
    setSearchParams(
      (prev) => {
        prev.set("page", String(p));
        return prev;
      },
      { replace: true },
    );
  const setLimit = (l: number) => {
    setEventsPerPage(l);
    setPage(1);
  };
  const [query, setQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    if (tags.length === 0) dispatch(fetchTags());
  }, []);

  useEffect(() => {
    dispatch(
      fetchEvents({ page, limit: eventsPerPage, tagIds: selectedTagIds }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, eventsPerPage, selectedTagIds]);

  const handleTagToggle = (id: string) => {
    setPage(1);
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleClearTags = () => {
    setPage(1);
    setSelectedTagIds([]);
  };

  const filtered = query.trim()
    ? events.filter((e) =>
        [e.title, e.description, e.location].some((f) =>
          f.toLowerCase().includes(query.toLowerCase()),
        ),
      )
    : events;

  const hasActiveFilters = query.trim() || selectedTagIds.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover</h1>
        <p className="text-gray-500 mt-1">
          Find and join exciting events happening around you
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events..."
            className="bg-white w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
          />
        </div>
        <PerPageSelector value={eventsPerPage} onChange={setLimit} />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => {
            const active = selectedTagIds.includes(tag.id);
            const color = getTagColor(tag.name);
            return (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium border transition-colors ${
                  active
                    ? `${color.chipBg} ${color.chipText} ${color.chipBorder}`
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
          {selectedTagIds.length > 0 && (
            <button
              onClick={handleClearTags}
              className="px-3 py-1 text-sm text-gray-700 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">
            {hasActiveFilters
              ? "No events match the selected tags."
              : "No events yet"}
          </p>
          <p className="mt-1">
            {hasActiveFilters
              ? "Try clearing the filters."
              : "Be the first to create one!"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {!query.trim() && pagination && pagination.totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
          <p className="text-center text-xs text-gray-400 mt-3">
            {pagination.total} events total · page {pagination.page} of{" "}
            {pagination.totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
