// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SymptomEntry, UserProfile, Pattern } from '@/types';
import { generateId, detectPatterns } from './utils';

interface AppState {
  entries: SymptomEntry[];
  profile: UserProfile;
  patterns: Pattern[];
  addEntry: (entry: Omit<SymptomEntry, 'id' | 'createdAt'>) => string;
  updateEntryInsight: (id: string, insight: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  recomputePatterns: () => void;
}

const defaultProfile: UserProfile = {
  name: 'You',
  conditions: [],
  medications: [],
  streak: 0,
  totalEntries: 0,
  joinedAt: new Date().toISOString(),
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      entries: [],
      profile: defaultProfile,
      patterns: [],

      addEntry: (entryData) => {
        const id = generateId();
        const newEntry: SymptomEntry = {
          ...entryData,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          entries: [newEntry, ...state.entries],
          profile: {
            ...state.profile,
            totalEntries: state.profile.totalEntries + 1,
          },
        }));
        get().recomputePatterns();
        return id;
      },

      updateEntryInsight: (id, insight) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, aiInsight: insight } : e
          ),
        }));
      },

      updateProfile: (profileData) => {
        set((state) => ({
          profile: { ...state.profile, ...profileData },
        }));
      },

      recomputePatterns: () => {
        const { entries } = get();
        const patterns = detectPatterns(entries);
        set({ patterns });
      },
    }),
    {
      name: 'symptom-ai-storage',
    }
  )
);
