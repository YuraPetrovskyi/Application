import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { Event } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { joinEvent, leaveEvent } from "../store/slices/eventsSlice";
import toast from "react-hot-toast";

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await dispatch(joinEvent(event.id)).unwrap();
      toast.success("Joined event!");
    } catch (err: any) {
      toast.error(err || "Failed to join");
    }
  };

  const handleLeave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await dispatch(leaveEvent(event.id)).unwrap();
      toast.success("Left event");
    } catch (err: any) {
      toast.error(err || "Failed to leave");
    }
  };

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
          {event.title}
        </h3>
        <span className="shrink-0 text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">
          {event.visibility}
        </span>
      </div>

      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
        {event.description}
      </p>

      <div className="mt-4 space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{dayjs(event.dateTime).format("MMM D, YYYY · HH:mm")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>👥</span>
          <span>
            {event.participantCount}
            {event.capacity ? ` / ${event.capacity}` : ""} participants
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">by {event.organizer.name}</span>
        {!event.isOrganizer &&
          (event.isFull && !event.isJoined ? (
            <span className="text-xs bg-gray-100 text-gray-400 px-3 py-1.5 rounded-lg font-medium cursor-not-allowed">
              Full
            </span>
          ) : event.isJoined ? (
            <button
              onClick={handleLeave}
              className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Leave
            </button>
          ) : (
            <button
              onClick={handleJoin}
              className="text-xs bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Join
            </button>
          ))}
      </div>
    </div>
  );
}
