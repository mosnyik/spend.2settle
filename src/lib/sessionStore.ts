// lib/sessionStore.ts

type SessionData = {
  [key: string]: any; 
};

const sessions: Record<string, SessionData> = {};

export const sessionStore = {
  get: (sessionId: string): SessionData => {
    console.log('sessions[sessionId]', sessions[sessionId])
    if (!sessions[sessionId]) {
      sessions[sessionId] = {};
    }
    return sessions[sessionId];
  },

  set: (sessionId: string, data: SessionData) => {
    sessions[sessionId] = { ...sessions[sessionId], ...data };

    console.log('working perfectly',sessions[sessionId])
  },

  reset: (sessionId: string) => {
    sessions[sessionId] = {};
  },
};


