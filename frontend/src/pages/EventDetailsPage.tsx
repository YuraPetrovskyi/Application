import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import {
  fetchEvent,
  joinEvent,
  leaveEvent,
  deleteEvent,
} from "../store/slices/eventsSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  User,
  Pencil,
  Trash2,
  Infinity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import TagChip from "../components/TagChip";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentEvent: event, loading } = useAppSelector((s) => s.events);
  const { user } = useAppSelector((s) => s.auth);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const PARTICIPANTS_PREVIEW = 6;

  useEffect(() => {
    if (id) dispatch(fetchEvent(id));
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await dispatch(joinEvent(id!)).unwrap();
      toast.success("Joined event!");
    } catch (err: any) {
      toast.error(err || "Failed");
    }
  };

  const handleLeave = async () => {
    try {
      await dispatch(leaveEvent(id!)).unwrap();
      toast.success("Left event");
    } catch (err: any) {
      toast.error(err || "Failed");
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteEvent(id!)).unwrap();
      toast.success("Event deleted");
      navigate("/");
    } catch (err: any) {
      toast.error(err || "Failed");
    }
  };

  if (loading || !event) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this event?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <button
        onClick={() => navigate(-1)}
        className="text-gray-500 hover:text-indigo-600 mb-6 flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-6 ">
          <div>
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-medium">
              {event.visibility}
            </span>
          </div>
          {event.isOrganizer && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => navigate(`/events/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
          {event.title}
        </h1>

        <p className="text-gray-600 leading-relaxed mb-6 text-lg font-medium break-words">
          {event.description}
        </p>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {event.tags.map((tag) => (
              <TagChip key={tag.id} tag={tag} size="md" />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1.5">
              <CalendarDays size={13} />
              Date & Time
            </p>
            <p className="text-gray-800 font-medium mt-1">
              {dayjs(event.dateTime).format("MMMM D, YYYY")}
            </p>
            <p className="text-gray-500 text-sm">
              {dayjs(event.dateTime).format("HH:mm")}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1.5">
              <MapPin size={13} />
              Location
            </p>
            <p className="text-gray-800 font-medium mt-1">{event.location}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1.5">
              <Users size={13} />
              Capacity
            </p>
            <p className="text-gray-800 font-medium mt-1 flex items-center gap-1">
              <span>{event.participantCount} /</span>
              {event.capacity ? (
                <span>{event.capacity}</span>
              ) : (
                <Infinity size={20} className="mt-1" />
              )}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1.5">
              <User size={13} />
              Organizer
            </p>
            <p className="text-gray-800 font-medium mt-1">
              {event.organizer.name}
            </p>
          </div>
        </div>

        {/* Join / Leave button */}
        {!event.isOrganizer && (
          <div className="mb-6">
            {event.isFull && !event.isJoined ? (
              <button
                disabled
                className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed"
              >
                Event is Full
              </button>
            ) : event.isJoined ? (
              <button
                onClick={handleLeave}
                className="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition-colors"
              >
                Leave Event
              </button>
            ) : (
              <button
                onClick={handleJoin}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Join Event
              </button>
            )}
          </div>
        )}

        {/* Participants */}
        <div>
          <button
            onClick={() => setShowAllParticipants((v) => !v)}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Participants ({event.participantCount})
            </h2>
            {event.participants.length > PARTICIPANTS_PREVIEW && (
              <span className="flex items-center gap-1 text-sm text-indigo-600 group-hover:text-indigo-800 transition-colors">
                {showAllParticipants ? (
                  <>
                    <ChevronUp size={16} /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} /> Show all {event.participantCount}
                  </>
                )}
              </span>
            )}
          </button>
          {event.participants.length === 0 ? (
            <p className="text-gray-400 text-sm">No participants yet</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {(showAllParticipants
                  ? event.participants
                  : event.participants.slice(0, PARTICIPANTS_PREVIEW)
                ).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-semibold">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{p.name}</span>
                  </div>
                ))}
              </div>
              {!showAllParticipants &&
                event.participants.length > PARTICIPANTS_PREVIEW && (
                  <p className="text-xs text-gray-400 mt-2">
                    +{event.participants.length - PARTICIPANTS_PREVIEW} more
                    participants
                  </p>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
