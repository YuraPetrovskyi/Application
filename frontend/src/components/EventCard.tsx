import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { Event } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { joinEvent, leaveEvent } from "../store/slices/eventsSlice";
import toast from "react-hot-toast";
import { Calendar, MapPin, Users, Clock4 } from "lucide-react";
import { getTagColor } from "../utils/tagColors";

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

  const renderAction = () => {
    if (event.isOrganizer) {
      return (
        <div className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg font-medium text-center">
          Your Event
        </div>
      );
    }

    if (event.isFull && !event.isJoined) {
      return (
        <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg font-medium text-center">
          Event is Full
        </div>
      );
    }

    if (event.isJoined) {
      return (
        <button
          onClick={handleLeave}
          className="w-full bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg font-medium transition-colors"
        >
          Leave Event
        </button>
      );
    }

    return (
      <button
        onClick={handleJoin}
        className="w-full bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-lg font-medium transition-colors"
      >
        Join Event
      </button>
    );
  };

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="flex flex-col gap-3 justify-between rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:shadow-indigo-100 hover:border-indigo-300 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-1">
          {event.title}
        </h3>
      </div>

      <p className="text-gray-500 text-sm line-clamp-2">{event.description}</p>

      <div className="mt-4 space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400 shrink-0" />
          <span>{dayjs(event.dateTime).format("MMM D, YYYY")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock4 size={14} className="text-gray-400 shrink-0" />
          <span>{dayjs(event.dateTime).format("HH:mm")}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-400 shrink-0" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gray-400 shrink-0" />
          <span>
            {event.participantCount}
            {event.capacity ? ` / ${event.capacity}` : ""} participants
          </span>
        </div>
      </div>

      <div className="h-[1px] bg-gray-200"></div>

      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {event.tags.map((tag) => {
            const color = getTagColor(tag.name);
            return (
              <span
                key={tag.id}
                className={`px-2 py-0.5 text-xs font-medium ${color.chipBg} ${color.chipText} rounded-lg border ${color.chipBorder}`}
              >
                {tag.name}
              </span>
            );
          })}
        </div>
      )}

      <div>{renderAction()}</div>
    </div>
  );
}
