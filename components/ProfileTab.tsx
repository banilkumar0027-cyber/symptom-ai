'use client';
// components/ProfileTab.tsx
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { CONDITION_OPTIONS } from '@/types';
import { calculateStreak } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProfileTab() {
  const { profile, entries, updateProfile } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [conditions, setConditions] = useState<string[]>(profile.conditions);
  const streak = calculateStreak(entries);

  const toggleCondition = (c: string) => {
    setConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const save = () => {
    updateProfile({ name, conditions });
    setEditing(false);
    toast.success('Profile updated!');
  };

  const stats = [
    { label: 'Total Entries', value: entries.length, icon: '📝' },
    { label: 'Current Streak', value: `${streak} days`, icon: '🔥' },
    { label: 'Conditions Tracked', value: profile.conditions.length, icon: '🩺' },
    {
      label: 'Symptom-Free Days',
      value: entries.filter((e) => e.symptoms.length === 0).length,
      icon: '✅',
    },
  ];

  return (
    <div style={{ paddingTop: 24 }}>
      {/* Avatar + name */}
      <div className="card-highlight fade-up" style={{ textAlign: 'center', marginBottom: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 99,
            background: 'var(--accent-soft)',
            border: '2px solid var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 12px',
          }}
        >
          🧬
        </div>
        {editing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '8px 16px',
              color: 'var(--text)',
              fontSize: 18,
              fontWeight: 700,
              textAlign: 'center',
              outline: 'none',
              width: '80%',
              fontFamily: 'var(--font-display)',
            }}
          />
        ) : (
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            {profile.name}
          </div>
        )}
        <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>
          Tracking since {new Date(profile.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="card fade-up-delay-1" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
              {value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Conditions */}
      <div className="card fade-up-delay-2" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          My Conditions
        </div>
        {editing ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CONDITION_OPTIONS.map((c) => (
              <button
                key={c}
                className={`tag ${conditions.includes(c) ? 'selected-green' : ''}`}
                onClick={() => toggleCondition(c)}
              >
                {c}
              </button>
            ))}
          </div>
        ) : profile.conditions.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {profile.conditions.map((c) => (
              <span key={c} className="tag selected-green">{c}</span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            No conditions added — tap Edit to add yours.
          </p>
        )}
      </div>

      {/* Edit / Save */}
      {editing ? (
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={() => setEditing(false)} style={{ flex: 1 }}>
            Cancel
          </button>
          <button className="btn-primary" onClick={save} style={{ flex: 2 }}>
            Save Changes
          </button>
        </div>
      ) : (
        <button className="btn-secondary" onClick={() => setEditing(true)} style={{ width: '100%' }}>
          ✏️ Edit Profile
        </button>
      )}

      {/* Data privacy note */}
      <div style={{ marginTop: 20, padding: 14, background: 'var(--accent-dim)', borderRadius: 12, fontSize: 12, color: 'var(--accent)', lineHeight: 1.6, textAlign: 'center' }}>
        🔒 All your health data is stored locally on your device. Nothing is uploaded without your permission.
      </div>
    </div>
  );
}
