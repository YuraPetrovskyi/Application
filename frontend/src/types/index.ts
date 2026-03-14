export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type Visibility = "PUBLIC" | "PRIVATE";

export interface Tag {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  capacity: number | null;
  visibility: Visibility;
  createdAt: string;
  organizer: { id: string; name: string; email: string };
  participants: { id: string; name: string }[];
  tags: Tag[];
  participantCount: number;
  isFull: boolean;
  isJoined: boolean;
  isOrganizer: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
