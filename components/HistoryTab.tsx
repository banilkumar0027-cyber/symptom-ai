'use client';
// components/HistoryTab.tsx
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatDate, severityColor, severityLabel } from '@/lib/utils';
import { SymptomEntry } from '@/types';

export default function HistoryTab() {
  const { entries } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div style={{ paddingTop: 60, textAlign: 'center' }} className="fade-up">
        <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No entries yet</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Start logging daily to build your health history.
        </p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>
          {entries.length} {entries.length === 1 ? 'Entry' : 'Entries'}
        </h2>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          Most recent first
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.map((entry, i) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            index={i}
            expanded={expanded === entry.id}
            onToggle={() => setExpanded(expanded === entry.id ? null : entry.id)}
          />
        ))}
      </div>
    </div>
  );
}

function EntryCard({
  entry,
  index,
  expanded,
  onToggle,
}: {
  entry: SymptomEntry;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const color = severityColor(entry.severity);

  return (
    <div
      className="card"
      style={{
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        borderColor: expanded ? 'var(--border-2)' : 'var(--border)',
        animationDelay: `${index * 0.04}s`,
      }}
      className={`card fade-up-delay-${Math.min(index + 1, 4)}`}
      onClick={onToggle}
    >
      {/* Row 1: Date + severity badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: 15, fontFamily: 'var(--font-display)' }}>
            {formatDate(entry.date)}
          </span>
          <span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 8 }}>
            {entry.mood}
          </span>
        </div>
        <span
          style={{
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            color,
            borderRadius: 999,
            padding: '3px 10px',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {severityLabel(entry.severity)} · {entry.severity}/10
        </span>
      </div>

      {/* Row 2: Lifestyle stats */}
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
        <span>😴 {entry.sleepHours}h sleep</span>
        <span>⚡ Stress {entry.stressLevel}/10</span>
      </div>

      {/* Symptom tags */}
      {entry.symptoms.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
          {entry.symptoms.map((s) => (
            <span
              key={s}
              style={{
                background: 'var(--danger-dim)',
                color: 'var(--danger)',
                borderRadius: 999,
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      ) : (
        <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600 }}>
          ✓ No symptoms
        </span>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          {entry.foods.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                Foods
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {entry.foods.map((f) => (
                  <span
                    key={f}
                    style={{
                      background: 'var(--purple-dim)',
                      color: 'var(--purple)',
                      borderRadius: 999,
                      padding: '3px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {entry.notes && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                Notes
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{entry.notes}</p>
            </div>
          )}

          {entry.aiInsight && (
            <div style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 6 }}>🧠 AI Insight</div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{entry.aiInsight}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
