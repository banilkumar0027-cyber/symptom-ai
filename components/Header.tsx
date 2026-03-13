'use client';
// components/Header.tsx
import { useStore } from '@/lib/store';
import { calculateStreak, getTodayString } from '@/lib/utils';
import { Tab } from '@/types';

const TAB_TITLES: Record<Tab, string> = {
  log: "Today's Log",
  history: 'History',
  insights: 'AI Insights',
  profile: 'Profile',
};

export default function Header({ activeTab }: { activeTab: Tab }) {
  const { entries } = useStore();
  const streak = calculateStreak(entries);
  const hasToday = entries.some((e) => e.date === getTodayString());

  return (
    <header
      style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        background: 'var(--bg)',
        zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ color: 'var(--accent)' }}>◉</span>
            SymptomAI
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>
            {TAB_TITLES[activeTab]}
          </div>
        </div>

        {streak > 0 && (
          <div
            style={{
              background: 'var(--warn-dim)',
              border: '1px solid color-mix(in srgb, var(--warn) 30%, transparent)',
              color: 'var(--warn)',
              borderRadius: 999,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            🔥 {streak}-day streak
          </div>
        )}

        {streak === 0 && hasToday && (
          <div
            style={{
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              borderRadius: 999,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            ✓ Logged today
          </div>
        )}
      </div>
    </header>
  );
}
