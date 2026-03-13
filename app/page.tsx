'use client';
// app/page.tsx
import { useState } from 'react';
import { Tab } from '@/types';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import LogTab from '@/components/LogTab';
import HistoryTab from '@/components/HistoryTab';
import InsightsTab from '@/components/InsightsTab';
import ProfileTab from '@/components/ProfileTab';

export default function Home() {
  const [tab, setTab] = useState<Tab>('log');

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <Header activeTab={tab} />
      <main style={{ padding: '0 16px' }}>
        {tab === 'log' && <LogTab />}
        {tab === 'history' && <HistoryTab />}
        {tab === 'insights' && <InsightsTab />}
        {tab === 'profile' && <ProfileTab />}
      </main>
      <BottomNav activeTab={tab} onTabChange={setTab} />
    </div>
  );
}
