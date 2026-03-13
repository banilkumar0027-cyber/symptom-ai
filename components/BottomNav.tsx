'use client';
// components/BottomNav.tsx
import { Tab } from '@/types';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'log', label: 'Log', icon: '📝' },
  { id: 'history', label: 'History', icon: '📅' },
  { id: 'insights', label: 'Insights', icon: '🧠' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: 'rgba(10, 15, 30, 0.9)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        zIndex: 100,
      }}
    >
      {TABS.map(({ id, label, icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              flex: 1,
              padding: '12px 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.3,
                color: active ? 'var(--accent)' : 'var(--muted)',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
            >
              {label}
            </span>
            {active && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: 24,
                  height: 2,
                  background: 'var(--accent)',
                  borderRadius: 99,
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
