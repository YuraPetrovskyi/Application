import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import EventCard from "./EventCard";
import type { Event } from "../types";
import authReducer from "../store/slices/authSlice";
import eventsReducer from "../store/slices/eventsSlice";
import tagsReducer from "../store/slices/tagsSlice";

/** Minimal Redux store so EventCard's dispatch/selector calls don't crash. */
function makeStore(userId: string | null = "user-1") {
  return configureStore({
    reducer: {
      auth: authReducer,
      events: eventsReducer,
      tags: tagsReducer,
    },
    preloadedState: {
      auth: {
        user: userId
          ? {
              id: userId,
              name: "Alice",
              email: "alice@example.com",
              createdAt: "",
            }
          : null,
        token: userId ? "fake-token" : null,
        loading: false,
        error: null,
        initializing: false,
      },
    },
  });
}

const decorator =
  (userId: string | null = "user-1") =>
  (Story: React.ComponentType) => (
    <Provider store={makeStore(userId)}>
      <MemoryRouter>
        <div className="max-w-sm p-4">
          <Story />
        </div>
      </MemoryRouter>
    </Provider>
  );

const baseEvent: Event = {
  id: "evt-1",
  title: "Tech Conference 2026",
  description:
    "A two-day deep-dive into the latest in web development, AI tools, and open-source.",
  dateTime: "2026-06-15T10:00:00.000Z",
  location: "Kyiv, Ukraine",
  capacity: 100,
  visibility: "PUBLIC",
  createdAt: "2026-01-01T00:00:00Z",
  organizer: { id: "user-1", name: "Alice", email: "alice@example.com" },
  participants: [],
  tags: [
    { id: "1", name: "Tech" },
    { id: "2", name: "Education" },
  ],
  participantCount: 42,
  isFull: false,
  isJoined: false,
  isOrganizer: false,
};

const meta: Meta<typeof EventCard> = {
  title: "Components/EventCard",
  component: EventCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Card showing event summary (title, date, location, tags, capacity). Action button changes based on the user's relationship to the event.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EventCard>;

export const Joinable: Story = {
  decorators: [decorator()],
  args: { event: { ...baseEvent, isOrganizer: false, isJoined: false } },
};

export const Joined: Story = {
  decorators: [decorator()],
  args: { event: { ...baseEvent, isOrganizer: false, isJoined: true } },
};

export const OwnEvent: Story = {
  decorators: [decorator()],
  args: { event: { ...baseEvent, isOrganizer: true, isJoined: false } },
};

export const Full: Story = {
  decorators: [decorator()],
  args: {
    event: {
      ...baseEvent,
      isFull: true,
      isJoined: false,
      isOrganizer: false,
      participantCount: 100,
    },
  },
};

export const NoCapacity: Story = {
  name: "Unlimited capacity",
  decorators: [decorator()],
  args: {
    event: { ...baseEvent, capacity: null, isFull: false },
  },
};

export const NoTags: Story = {
  decorators: [decorator()],
  args: { event: { ...baseEvent, tags: [] } },
};

export const LoggedOut: Story = {
  name: "Logged out (no user)",
  decorators: [decorator(null)],
  args: { event: { ...baseEvent, isOrganizer: false, isJoined: false } },
};
