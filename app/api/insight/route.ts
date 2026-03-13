// app/api/insight/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { entry, recentHistory, patterns } = await req.json();

    const historyText = recentHistory
      .slice(0, 5)
      .map((e: any) =>
        `- ${e.date}: Symptoms: ${e.symptoms.join(', ') || 'None'}, Severity ${e.severity}/10, Sleep ${e.sleepHours}h, Stress ${e.stressLevel}/10, Foods: ${e.foods.join(', ') || 'None'}`
      )
      .join('\n');

    const patternText = patterns
      .slice(0, 3)
      .map((p: any) => `- "${p.trigger}" → ${p.outcome} (${p.confidence}% confidence, ${p.occurrences} times)`)
      .join('\n');

    const prompt = `You are a compassionate health pattern analyst helping someone manage a chronic condition. Analyze today's health log and provide a warm, specific, actionable insight.

TODAY'S ENTRY:
- Symptoms: ${entry.symptoms.join(', ') || 'None'}
- Severity: ${entry.severity}/10
- Sleep: ${entry.sleepHours} hours
- Stress: ${entry.stressLevel}/10
- Foods: ${entry.foods.join(', ') || 'None logged'}
- Mood: ${entry.mood || 'Not logged'}
- Notes: ${entry.notes || 'None'}

RECENT HISTORY (last 5 days):
${historyText || 'No previous entries'}

DETECTED PATTERNS:
${patternText || 'Not enough data yet for pattern detection'}

Write a SHORT insight (3-5 sentences) that:
1. Acknowledges today specifically (mention actual symptoms/numbers)
2. Connects to 1-2 patterns from their history if relevant
3. Ends with ONE concrete, specific action for tomorrow

Tone: warm, like a knowledgeable friend — not clinical or preachy. Be direct and specific, not vague.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const insight = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ insight });
  } catch (error) {
    console.error('AI insight error:', error);
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 });
  }
}
