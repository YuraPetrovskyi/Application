import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { createEvent } from "../store/slices/eventsSlice";
import { fetchTags } from "../store/slices/tagsSlice";
import TagSelector from "../components/TagSelector";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  visibility: "PUBLIC" | "PRIVATE";
}

export default function CreateEventPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((s) => s.events);
  const { tags } = useAppSelector((s) => s.tags);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    if (tags.length === 0) dispatch(fetchTags());
  }, [dispatch, tags.length]);

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { visibility: "PUBLIC" },
    mode: "onTouched",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        dateTime: new Date(`${data.date}T${data.time}`).toISOString(),
        location: data.location,
        capacity: data.capacity ? Number(data.capacity) : undefined,
        visibility: data.visibility,
        tagIds: selectedTagIds,
      };
      const event = await dispatch(createEvent(payload)).unwrap();
      toast.success("Event created!");
      navigate(`/events/${event.id}`);
    } catch (err: any) {
      toast.error(err || "Failed to create event");
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelClass = "block text-sm font-bold text-gray-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 mb-6 text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-500 mt-1">
            Fill in the details for your new event
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className={labelClass}>
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="e.g. Tech Conference 2026"
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
              placeholder="Describe what makes your event special..."
              rows={4}
              className={inputClass + " resize-y"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register("date", {
                  required: "Date is required",
                  validate: (v) =>
                    !v || new Date(v) >= new Date(new Date().toDateString())
                      ? true
                      : "Cannot create events in the past",
                  onChange: () => trigger("time"),
                })}
                type="date"
                className={inputClass}
              />
              {errors.date && (
                <p className={errorClass}>{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                Time <span className="text-red-500">*</span>
              </label>
              <input
                {...register("time", {
                  required: "Time is required",
                  validate: (v) => {
                    const date = getValues("date");
                    if (!date || !v) return true;
                    return new Date(`${date}T${v}`) > new Date()
                      ? true
                      : "Cannot create events in the past";
                  },
                })}
                type="time"
                className={inputClass}
              />
              {errors.time && (
                <p className={errorClass}>{errors.time.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Location <span className="text-red-500">*</span>
            </label>
            <input
              {...register("location", { required: "Location is required" })}
              placeholder="e.g. Convention Center, San Francisco"
              className={inputClass}
            />
            {errors.location && (
              <p className={errorClass}>{errors.location.message}</p>
            )}
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
              placeholder="Leave empty for unlimited"
              className={inputClass}
            />
            <p className="text-sm text-gray-400 mt-1">
              Maximum number of participants. Leave empty for unlimited
              capacity.
            </p>
            {errors.capacity && (
              <p className={errorClass}>{errors.capacity.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Visibility</label>
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("visibility")}
                  type="radio"
                  value="PUBLIC"
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Public - Anyone can see and join this event
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("visibility")}
                  type="radio"
                  value="PRIVATE"
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Private - Only invited people can see this event
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Tags{" "}
              <span className="text-gray-400 font-normal">
                (optional, max 5)
              </span>
            </label>
            <TagSelector
              tags={tags}
              selectedIds={selectedTagIds}
              onChange={setSelectedTagIds}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
