import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { fetchEvent, updateEvent } from "../store/slices/eventsSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  visibility: "PUBLIC" | "PRIVATE";
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentEvent: event, loading } = useAppSelector((s) => s.events);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ mode: "onTouched" });

  useEffect(() => {
    if (id) dispatch(fetchEvent(id));
  }, [id]);

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        date: dayjs(event.dateTime).format("YYYY-MM-DD"),
        time: dayjs(event.dateTime).format("HH:mm"),
        location: event.location,
        capacity: event.capacity?.toString() || "",
        visibility: event.visibility,
      });
    }
  }, [event]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        dateTime: new Date(`${data.date}T${data.time}`).toISOString(),
        location: data.location,
        capacity: data.capacity !== "" ? Number(data.capacity) : null,
        visibility: data.visibility,
      };
      await dispatch(updateEvent({ id: id!, data: payload })).unwrap();
      toast.success("Event updated!");
      navigate(`/events/${id}`);
    } catch (err: any) {
      toast.error(err || "Failed to update event");
    }
  };

  if (loading && !event) return <LoadingSpinner />;

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        <p className="text-gray-500 mt-1">Update event details</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className={labelClass}>Event Title *</label>
            <input
              {...register("title", { required: "Title is required" })}
              className={inputClass}
            />
            {errors.title && (
              <p className={errorClass}>{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date *</label>
              <input
                {...register("date", { required: "Date is required" })}
                type="date"
                className={inputClass}
              />
              {errors.date && (
                <p className={errorClass}>{errors.date.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Time *</label>
              <input
                {...register("time", { required: "Time is required" })}
                type="time"
                className={inputClass}
              />
              {errors.time && (
                <p className={errorClass}>{errors.time.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Capacity (optional)</label>
            <input
              {...register("capacity", {
                validate: (v) =>
                  !v || Number(v) >= 1
                    ? true
                    : "Leave empty for unlimited, or enter a whole number ≥ 1",
              })}
              type="number"
              min="1"
              placeholder="Unlimited if empty"
              className={inputClass}
            />
            {errors.capacity && (
              <p className={errorClass}>{errors.capacity.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Location *</label>
            <input
              {...register("location", { required: "Location is required" })}
              className={inputClass}
            />
            {errors.location && (
              <p className={errorClass}>{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Visibility</label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("visibility")}
                  type="radio"
                  value="PUBLIC"
                />
                <span className="text-sm text-gray-700">Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("visibility")}
                  type="radio"
                  value="PRIVATE"
                />
                <span className="text-sm text-gray-700">Private</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
