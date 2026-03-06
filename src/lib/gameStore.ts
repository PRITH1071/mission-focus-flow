import { create } from 'zustand';

// Simple localStorage-based store for gamification state

export interface Mission {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
  createdAt: string;
}

export interface StudySession {
  date: string;
  minutes: number;
}

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string | null;
  missions: Mission[];
  studySessions: StudySession[];
  totalFocusMinutes: number;
  addXP: (amount: number) => void;
  addMission: (title: string, xpReward?: number) => void;
  completeMission: (id: string) => void;
  deleteMission: (id: string) => void;
  addFocusSession: (minutes: number) => void;
  updateStreak: () => void;
}

const XP_PER_LEVEL = 500;

function loadState() {
  try {
    const raw = localStorage.getItem('studyos-state');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(state: Partial<GameState>) {
  const { xp, level, streak, lastStudyDate, missions, studySessions, totalFocusMinutes } = state as GameState;
  localStorage.setItem('studyos-state', JSON.stringify({ xp, level, streak, lastStudyDate, missions, studySessions, totalFocusMinutes }));
}

const saved = loadState();

export const useGameStore = create<GameState>((set, get) => ({
  xp: saved?.xp ?? 0,
  level: saved?.level ?? 1,
  streak: saved?.streak ?? 0,
  lastStudyDate: saved?.lastStudyDate ?? null,
  missions: saved?.missions ?? [],
  studySessions: saved?.studySessions ?? [],
  totalFocusMinutes: saved?.totalFocusMinutes ?? 0,

  addXP: (amount) => {
    set((s) => {
      let newXP = s.xp + amount;
      let newLevel = s.level;
      while (newXP >= XP_PER_LEVEL) {
        newXP -= XP_PER_LEVEL;
        newLevel++;
      }
      const next = { ...s, xp: newXP, level: newLevel };
      saveState(next);
      return next;
    });
  },

  addMission: (title, xpReward = 50) => {
    set((s) => {
      const mission: Mission = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        xpReward,
        createdAt: new Date().toISOString(),
      };
      const next = { ...s, missions: [...s.missions, mission] };
      saveState(next);
      return next;
    });
  },

  completeMission: (id) => {
    const state = get();
    const mission = state.missions.find((m) => m.id === id);
    if (!mission || mission.completed) return;
    set((s) => {
      const missions = s.missions.map((m) => m.id === id ? { ...m, completed: true } : m);
      let newXP = s.xp + mission.xpReward;
      let newLevel = s.level;
      while (newXP >= XP_PER_LEVEL) {
        newXP -= XP_PER_LEVEL;
        newLevel++;
      }
      const next = { ...s, missions, xp: newXP, level: newLevel };
      saveState(next);
      return next;
    });
    state.updateStreak();
  },

  deleteMission: (id) => {
    set((s) => {
      const next = { ...s, missions: s.missions.filter((m) => m.id !== id) };
      saveState(next);
      return next;
    });
  },

  addFocusSession: (minutes) => {
    set((s) => {
      const today = new Date().toISOString().slice(0, 10);
      const existing = s.studySessions.find((ss) => ss.date === today);
      let studySessions;
      if (existing) {
        studySessions = s.studySessions.map((ss) => ss.date === today ? { ...ss, minutes: ss.minutes + minutes } : ss);
      } else {
        studySessions = [...s.studySessions, { date: today, minutes }];
      }
      const next = { ...s, studySessions, totalFocusMinutes: s.totalFocusMinutes + minutes };
      saveState(next);
      return next;
    });
    get().updateStreak();
  },

  updateStreak: () => {
    set((s) => {
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      let streak = s.streak;
      if (s.lastStudyDate === today) {
        // already counted
      } else if (s.lastStudyDate === yesterday) {
        streak++;
      } else if (s.lastStudyDate !== today) {
        streak = 1;
      }
      const next = { ...s, streak, lastStudyDate: today };
      saveState(next);
      return next;
    });
  },
}));
