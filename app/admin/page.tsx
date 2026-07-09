'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import { USERS } from '@/components/NamePicker';
import type { AdminMarker } from '@/components/AdminMap';

const ACCESS_CODE = 'bruno1985';
const STALE_MS = 5 * 60 * 1000; // GPS considered stale after 5 min

const AdminMap = dynamic(() => import('@/components/AdminMap'), { ssr: false });

type Row = { name: string; lat: number; lng: number; ts: number; color: string };

function colorFor(name: string): string {
  return USERS.find(u => u.name === name)?.color ?? '#ffffff';
}

function timeAgo(ts: number, now: number): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const submit = () => {
    if (code === ACCESS_CODE) {
      sessionStorage.setItem('madeira-admin', '1');
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#080a12',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 20, padding: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🛡️</div>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>Admin Access</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '6px 0 0' }}>
          Enter the access code
        </p>
      </div>
      <input
        type="password"
        value={code}
        autoFocus
        onChange={e => { setCode(e.target.value); setError(false); }}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder="Access code"
        style={{
          width: '100%', maxWidth: 260, padding: '14px 16px', borderRadius: 14,
          background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 16,
          border: `1.5px solid ${error ? '#e17055' : 'rgba(255,255,255,0.12)'}`,
          outline: 'none', textAlign: 'center', letterSpacing: '0.1em',
        }}
      />
      {error && <p style={{ color: '#e17055', fontSize: 13, margin: 0 }}>Incorrect code</p>}
      <button
        onClick={submit}
        style={{
          width: '100%', maxWidth: 260, padding: 14, borderRadius: 14, cursor: 'pointer',
          background: '#4285f4', color: 'white', fontSize: 15, fontWeight: 700, border: 'none',
        }}
      >
        Unlock
      </button>
    </div>
  );
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (sessionStorage.getItem('madeira-admin') === '1') setUnlocked(true);
  }, []);

  // Tick every second so "last seen" stays live
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    const locRef = ref(db, 'locations');
    onValue(locRef, snapshot => {
      const data = snapshot.val() ?? {};
      const next: Row[] = Object.entries(data).map(([name, pos]: [string, any]) => ({
        name,
        lat: pos.lat,
        lng: pos.lng,
        ts: pos.ts ?? 0,
        color: colorFor(name),
      }));
      next.sort((a, b) => b.ts - a.ts);
      setRows(next);
    });
    return () => off(locRef);
  }, [unlocked]);

  const markers: AdminMarker[] = useMemo(
    () => rows.map(r => ({
      name: r.name, lat: r.lat, lng: r.lng, color: r.color,
      stale: now - r.ts > STALE_MS,
    })),
    [rows, now],
  );

  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />;

  return (
    <main style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#080a12' }}>
      <header style={{
        padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🛡️</span>
          <h1 style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0 }}>Admin — Live Locations</h1>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
          {rows.length} sharing
        </span>
      </header>

      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <AdminMap markers={markers} />
      </div>

      <div style={{
        maxHeight: '42vh', overflowY: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.08)', background: '#0b0e18',
      }}>
        {rows.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, textAlign: 'center', padding: 28 }}>
            No one is sharing their location right now.
          </p>
        )}
        {rows.map(r => {
          const stale = now - r.ts > STALE_MS;
          return (
            <a
              key={r.name}
              href={`https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none',
                opacity: stale ? 0.55 : 1,
              }}
            >
              <span style={{
                width: 11, height: 11, borderRadius: '50%', background: r.color, flexShrink: 0,
                boxShadow: `0 0 8px ${r.color}90`,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'white', fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
                  {r.lat.toFixed(5)}, {r.lng.toFixed(5)}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  color: stale ? '#e17055' : '#00b894', fontSize: 13, fontWeight: 600,
                }}>
                  {r.ts ? timeAgo(r.ts, now) : 'unknown'}
                </div>
                {stale && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>stale</div>}
              </div>
            </a>
          );
        })}
      </div>
    </main>
  );
}
