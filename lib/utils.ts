// lib/utils.ts
import { SymptomEntry, Pattern } from '@/types';

export const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

export const severityColor = (severity: number): string => {
  if (severity >= 7) return '#ef4444';
  if (severity >= 4) return '#f59e0b';
  return '#06d6a0';
};

export const severityLabel = (severity: number): string => {
  if (severity >= 8) return 'Severe';
  if (severity >= 6) return 'Moderate';
  if (severity >= 4) return 'Mild';
  return 'Minimal';
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const hasLoggedToday = (entries: SymptomEntry[]): boolean => {
  const today = getTodayString();
  return entries.some((e) => e.date === today);
};

export const calculateStreak = (entries: SymptomEntry[]): number => {
  if (entries.length === 0) return 0;
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const entry of sorted) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    const diff = Math.round(
      (current.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff <= 1) {
      streak++;
      current = entryDate;
    } else {
      break;
    }
  }
  return streak;
};

// Simple pattern detection: find combos that frequently precede symptoms
export const detectPatterns = (entries: SymptomEntry[]): Pattern[] => {
  if (entries.length < 3) return [];

  const patterns: Pattern[] = [];
  const triggerMap: Record<string, { symptomCounts: Record<string, number>; total: number; dates: string[] }> = {};

  for (const entry of entries) {
    const triggers: string[] = [];
    if (entry.sleepHours <= 6) triggers.push('Poor Sleep (<6h)');
    if (entry.stressLevel >= 7) triggers.push('High Stress');
    triggers.push(...entry.foods);

    // Single and pair triggers
    const combos = [...triggers];
    for (let i = 0; i < triggers.length; i++) {
      for (let j = i + 1; j < triggers.length; j++) {
        combos.push(`${triggers[i]} + ${triggers[j]}`);
      }
    }

    for (const combo of combos) {
      if (!triggerMap[combo]) {
        triggerMap[combo] = { symptomCounts: {}, total: 0, dates: [] };
      }
      triggerMap[combo].total++;
      triggerMap[combo].dates.push(entry.date);
      for (const symptom of entry.symptoms) {
        triggerMap[combo].symptomCounts[symptom] =
          (triggerMap[combo].symptomCounts[symptom] || 0) + 1;
      }
    }
  }

  for (const [trigger, data] of Object.entries(triggerMap)) {
    if (data.total < 2) continue;
    for (const [symptom, count] of Object.entries(data.symptomCounts)) {
      const confidence = Math.round((count / data.total) * 100);
      if (confidence >= 60 && count >= 2) {
        patterns.push({
          trigger,
          outcome: symptom,
          confidence,
          occurrences: count,
          dates: data.dates,
        });
      }
    }
  }

  return patterns
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6);
};

export const clsx = (...classes: (string | boolean | undefined | null)[]): string =>
  classes.filter(Boolean).join(' ');
