import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Event } from "../../types";

interface EventsState {
  events: Event[];
  myEvents: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  myEvents: [],
  currentEvent: null,
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk(
  "events/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<Event[]>("/events");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch events",
      );
    }
  },
);

export const fetchEvent = createAsyncThunk(
  "events/fetchOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get<Event>(`/events/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch event",
      );
    }
  },
);

export const createEvent = createAsyncThunk(
  "events/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.post<Event>("/events", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create event",
      );
    }
  },
);

export const updateEvent = createAsyncThunk(
  "events/update",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await api.patch<Event>(`/events/${id}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update event",
      );
    }
  },
);

export const deleteEvent = createAsyncThunk(
  "events/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete event",
      );
    }
  },
);

export const joinEvent = createAsyncThunk(
  "events/join",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.post<Event>(`/events/${id}/join`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to join event",
      );
    }
  },
);

export const leaveEvent = createAsyncThunk(
  "events/leave",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.post<Event>(`/events/${id}/leave`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to leave event",
      );
    }
  },
);

export const fetchMyEvents = createAsyncThunk(
  "events/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<Event[]>("/users/me/events");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch your events",
      );
    }
  },
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearCurrentEvent(state) {
      state.currentEvent = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEvents.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.loading = false;
          state.events = action.payload;
        },
      )
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events.unshift(action.payload);
        state.currentEvent = action.payload;
      })

      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.currentEvent = action.payload;
        const idx = state.events.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.events[idx] = action.payload;
      })

      .addCase(
        deleteEvent.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.events = state.events.filter((e) => e.id !== action.payload);
          state.currentEvent = null;
        },
      )

      .addCase(joinEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.currentEvent = action.payload;
        const idx = state.events.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.events[idx] = action.payload;
      })

      .addCase(leaveEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.currentEvent = action.payload;
        const idx = state.events.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.events[idx] = action.payload;
      })

      .addCase(fetchMyEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchMyEvents.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.loading = false;
          state.myEvents = action.payload;
        },
      )
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentEvent, clearError } = eventsSlice.actions;
export default eventsSlice.reducer;
