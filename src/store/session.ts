import { create } from "zustand";

interface UserSession {
  email: string;
  fullName?: string;
}

interface SessionState {
  user: UserSession | null;
  signIn: (session: UserSession) => void;
  signOut: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  signIn: (session) => set({ user: session }),
  signOut: () => set({ user: null })
}));


