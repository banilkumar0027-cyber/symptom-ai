'use client';
// components/InsightsTab.tsx
import { useStore } from '@/lib/store';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { formatDate } from '@/lib/utils';

export default function InsightsTab() {
  const { entries, patterns } = useStore();
  const latestWithInsight = entries.find((e) => e.aiInsight);

  const chartData = [...entries]
    .reverse()
    .slice(-14)
    .map((e) => ({
      date: formatDate(e.date),
      severity: e.severity,
      sleep: e.sleepHours,
      stress: e.stressLevel,
    }));

  if (entries.length === 0) {
    return (
      <div style={{ paddingTop: 60, textAlign: 'center' }} className="fade-up">
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔬</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No data yet</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Log at least 3 days to unlock pattern detection and AI insights.
        </p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 24 }}>
      {/* Latest AI Insight */}
      {latestWithInsight?.aiInsight && (
        <div className="card-highlight fade-up" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            🧠 Latest AI Insight · {formatDate(latestWithInsight.date)}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-2)' }}>
            {latestWithInsight.aiInsight}
          </p>
        </div>
      )}

      {/* Severity trend chart */}
      {chartData.length >= 2 && (
        <div className="card fade-up-delay-1" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
            📈 Severity Trend (last {chartData.length} days)
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: 'var(--muted)', fontSize: 11 }} tickLine={false} axisLine={false} width={20} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }}
                labelStyle={{ color: 'var(--accent)', fontWeight: 700 }}
                itemStyle={{ color: 'var(--text-2)' }}
              />
              <Line type="monotone" dataKey="severity" stroke="var(--danger)" strokeWidth={2} dot={{ fill: 'var(--danger)', r: 3 }} name="Severity" />
              <Line type="monotone" dataKey="stress" stroke="var(--warn)" strokeWidth={2} dot={{ fill: 'var(--warn)', r: 3 }} name="Stress" />
              <Line type="monotone" dataKey="sleep" stroke="var(--blue)" strokeWidth={2} dot={{ fill: 'var(--blue)', r: 3 }} name="Sleep (h)" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10 }}>
            {[
              { color: 'var(--danger)', label: 'Severity' },
              { color: 'var(--warn)', label: 'Stress' },
              { color: 'var(--blue)', label: 'Sleep' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 99, background: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patterns */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>
          🔍 Detected Patterns
          <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>
            ({patterns.length} found)
          </span>
        </h2>

        {patterns.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔄</div>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>
              Keep logging daily. Patterns emerge after 3–5 similar entries.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {patterns.map((p, i) => (
              <div key={i} className="card fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>
                    {p.trigger}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: p.confidence >= 80 ? 'var(--danger)' : p.confidence >= 65 ? 'var(--warn)' : 'var(--accent)',
                      fontFamily: 'var(--font-display)',
                      marginLeft: 8,
                    }}
                  >
                    {p.confidence}%
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                  → Often leads to:{' '}
                  <span style={{ color: 'var(--warn)', fontWeight: 700 }}>{p.outcome}</span>
                  {' '}· {p.occurrences}× observed
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${p.confidence}%`,
                      background: `linear-gradient(90deg, var(--accent), var(--blue))`,
                      borderRadius: 99,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>📋 Doctor Report</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Export {entries.length}-entry summary as PDF
          </div>
        </div>
        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '9px 16px', fontSize: 13 }}
          onClick={() => alert('PDF export — connect react-pdf in production!')}
        >
          Export
        </button>
      </div>
    </div>
  );
}
