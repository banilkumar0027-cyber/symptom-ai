'use client';
// components/LogTab.tsx
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { SYMPTOM_OPTIONS, FOOD_OPTIONS, MOOD_OPTIONS, SymptomEntry } from '@/types';
import { getTodayString, hasLoggedToday } from '@/lib/utils';
import toast from 'react-hot-toast';

const STEPS = ['Symptoms', 'Lifestyle', 'Food', 'Mood', 'Notes'];

interface DraftEntry {
  symptoms: string[];
  severity: number;
  sleepHours: number;
  stressLevel: number;
  foods: string[];
  mood: string;
  notes: string;
}

const defaultDraft: DraftEntry = {
  symptoms: [],
  severity: 4,
  sleepHours: 7,
  stressLevel: 4,
  foods: [],
  mood: '',
  notes: '',
};

export default function LogTab() {
  const { entries, addEntry, updateEntryInsight, patterns } = useStore();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<DraftEntry>(defaultDraft);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const alreadyLogged = hasLoggedToday(entries);

  const toggle = (arr: string[], item: string, key: keyof DraftEntry) => {
    setDraft((d) => ({
      ...d,
      [key]: (d[key] as string[]).includes(item)
        ? (d[key] as string[]).filter((x) => x !== item)
        : [...(d[key] as string[]), item],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const today = getTodayString();
    const entryData = { ...draft, date: today };
    const id = addEntry(entryData);

    toast.success('Entry logged! Generating AI insight…');

    try {
      const res = await fetch('/api/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry: entryData,
          recentHistory: entries.slice(0, 5),
          patterns,
        }),
      });
      const data = await res.json();
      if (data.insight) {
        updateEntryInsight(id, data.insight);
      }
    } catch {
      toast.error('Could not fetch AI insight — entry saved.');
    }

    setSubmitting(false);
    setDone(true);
  };

  if (done || alreadyLogged) {
    return (
      <div style={{ paddingTop: 40, textAlign: 'center' }} className="fade-up">
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {alreadyLogged && !done ? '📋' : '✅'}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
          {alreadyLogged && !done ? 'Already logged today!' : "Today's entry saved!"}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          {alreadyLogged && !done
            ? 'Come back tomorrow to log again. Check your insights tab for AI analysis.'
            : 'Your AI insight is being generated. Check the Insights tab!'}
        </p>
        <div className="card" style={{ textAlign: 'left', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Today's Summary
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: '🤕 Symptoms', value: draft.symptoms.join(', ') || 'None' },
              { label: '😴 Sleep', value: `${draft.sleepHours}h` },
              { label: '⚡ Stress', value: `${draft.stressLevel}/10` },
              { label: '🍽️ Foods', value: draft.foods.join(', ') || 'None' },
              { label: '😊 Mood', value: draft.mood || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--muted)' }}>{label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-2)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        {!alreadyLogged && (
          <button
            className="btn-secondary"
            onClick={() => { setDone(false); setDraft(defaultDraft); setStep(0); }}
            style={{ width: '100%' }}
          >
            Edit & Re-log
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 24 }}>
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background: i <= step ? 'var(--accent)' : 'var(--border)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      <div style={{ marginBottom: 4, fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.2 }}>
        Step {step + 1} / {STEPS.length} · {STEPS[step]}
      </div>

      {/* Step content */}
      <div key={step} className="fade-up">
        {step === 0 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.5px' }}>
              How are you feeling?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
              Select all symptoms you're experiencing today
            </p>
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SYMPTOM_OPTIONS.map((s) => (
                  <button
                    key={s}
                    className={`tag ${draft.symptoms.includes(s) ? 'selected-red' : ''}`}
                    onClick={() => toggle([], s, 'symptoms')}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {draft.symptoms.length === 0 && (
                <div style={{ marginTop: 12, padding: '10px', background: 'var(--accent-dim)', borderRadius: 10, fontSize: 13, color: 'var(--accent)', textAlign: 'center' }}>
                  ✓ No symptoms selected — that's great!
                </div>
              )}
            </div>
            <div className="card">
              <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 10 }}>
                Overall severity:{' '}
                <span style={{ fontWeight: 800, color: draft.severity >= 7 ? 'var(--danger)' : draft.severity >= 4 ? 'var(--warn)' : 'var(--accent)' }}>
                  {draft.severity}/10
                </span>
              </label>
              <input
                type="range" min={1} max={10} value={draft.severity}
                onChange={(e) => setDraft((d) => ({ ...d, severity: +e.target.value }))}
                style={{ accentColor: 'var(--accent)' }}
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.5px' }}>
              Sleep & Stress
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
              These are the top pattern drivers — be honest!
            </p>
            <div className="card" style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 10 }}>
                Hours slept last night:{' '}
                <span style={{ fontWeight: 800, color: draft.sleepHours >= 7 ? 'var(--accent)' : draft.sleepHours >= 5 ? 'var(--warn)' : 'var(--danger)' }}>
                  {draft.sleepHours}h
                </span>
              </label>
              <input
                type="range" min={2} max={12} step={0.5} value={draft.sleepHours}
                onChange={(e) => setDraft((d) => ({ ...d, sleepHours: +e.target.value }))}
                style={{ accentColor: 'var(--blue)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                <span>2h</span><span>7h (ideal)</span><span>12h</span>
              </div>
            </div>
            <div className="card">
              <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 10 }}>
                Stress level today:{' '}
                <span style={{ fontWeight: 800, color: draft.stressLevel >= 7 ? 'var(--danger)' : draft.stressLevel >= 4 ? 'var(--warn)' : 'var(--accent)' }}>
                  {draft.stressLevel}/10
                </span>
              </label>
              <input
                type="range" min={1} max={10} value={draft.stressLevel}
                onChange={(e) => setDraft((d) => ({ ...d, stressLevel: +e.target.value }))}
                style={{ accentColor: 'var(--warn)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                <span>Calm</span><span>Moderate</span><span>Very High</span>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.5px' }}>
              What did you eat?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
              Tag anything notable — this feeds the pattern engine
            </p>
            <div className="card">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {FOOD_OPTIONS.map((f) => (
                  <button
                    key={f}
                    className={`tag ${draft.foods.includes(f) ? 'selected-purple' : ''}`}
                    onClick={() => toggle([], f, 'foods')}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.5px' }}>
              How's your mood?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
              Your emotional state is a key health signal
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MOOD_OPTIONS.map(({ emoji, label, value }) => (
                <button
                  key={value}
                  onClick={() => setDraft((d) => ({ ...d, mood: `${emoji} ${label}` }))}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 14,
                    border: `1.5px solid ${draft.mood.includes(label) ? 'var(--accent)' : 'var(--border)'}`,
                    background: draft.mood.includes(label) ? 'var(--accent-dim)' : 'var(--card)',
                    color: draft.mood.includes(label) ? 'var(--accent)' : 'var(--text-2)',
                    cursor: 'pointer',
                    fontSize: 16,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    transition: 'all 0.18s',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: 24 }}>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.5px' }}>
              Anything else?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
              Optional notes — medications taken, unusual events, etc.
            </p>
            <div className="card" style={{ marginBottom: 16 }}>
              <textarea
                value={draft.notes}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                placeholder="e.g. Took ibuprofen at 2pm. Very stressful meeting. Period started."
                rows={5}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text)',
                  fontSize: 14,
                  lineHeight: 1.7,
                  resize: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
            {/* Summary preview */}
            <div className="card-highlight" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                📋 Entry Summary
              </div>
              {[
                { label: '🤕 Symptoms', value: draft.symptoms.join(', ') || 'None' },
                { label: '😴 Sleep', value: `${draft.sleepHours}h` },
                { label: '⚡ Stress', value: `${draft.stressLevel}/10` },
                { label: '🍽️ Foods', value: draft.foods.join(', ') || 'None' },
                { label: '😊 Mood', value: draft.mood || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: 'var(--muted)' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-2)', maxWidth: '60%', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        {step > 0 && (
          <button className="btn-secondary" onClick={() => setStep((s) => s - 1)} style={{ flex: 1 }}>
            ← Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button className="btn-primary" onClick={() => setStep((s) => s + 1)} style={{ flex: 2 }}>
            Continue →
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ flex: 2 }}
          >
            {submitting ? '⏳ Saving…' : '✓ Submit & Analyze'}
          </button>
        )}
      </div>
    </div>
  );
}
