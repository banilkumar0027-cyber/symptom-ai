// types/index.ts

export interface SymptomEntry {
  id: string;
  date: string; // ISO date string
  symptoms: string[];
  severity: number; // 1-10
  sleepHours: number;
  stressLevel: number; // 1-10
  foods: string[];
  mood: string;
  notes?: string;
  aiInsight?: string;
  createdAt: string;
}

export interface Pattern {
  trigger: string;
  outcome: string;
  confidence: number; // 0-100
  occurrences: number;
  dates: string[];
}

export interface UserProfile {
  name: string;
  conditions: string[];
  medications: string[];
  streak: number;
  totalEntries: number;
  joinedAt: string;
}

export type Tab = 'log' | 'history' | 'insights' | 'profile';

export type LogStep = 'symptoms' | 'lifestyle' | 'food' | 'mood' | 'notes';

export const SYMPTOM_OPTIONS = [
  'Headache', 'Migraine', 'Fatigue', 'Nausea', 'Bloating',
  'Joint Pain', 'Muscle Ache', 'Brain Fog', 'Anxiety',
  'Insomnia', 'Dizziness', 'Shortness of Breath', 'Heart Palpitations', 'Rash'
];

export const FOOD_OPTIONS = [
  'Gluten', 'Dairy', 'Sugar', 'Alcohol', 'Caffeine',
  'Processed Food', 'Red Meat', 'Shellfish', 'Nuts',
  'Eggs', 'Soy', 'Vegetables', 'Fruits', 'Fast Food'
];

export const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Good', value: 'good' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😔', label: 'Low', value: 'low' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '😤', label: 'Irritable', value: 'irritable' },
  { emoji: '😴', label: 'Exhausted', value: 'exhausted' },
];

export const CONDITION_OPTIONS = [
  'Migraine', 'IBS / Crohn\'s', 'Fibromyalgia', 'Lupus',
  'Rheumatoid Arthritis', 'Chronic Fatigue', 'Anxiety / Depression',
  'Diabetes', 'Hypertension', 'Asthma', 'Other'
];
