'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';

export const USERS: { name: string; color: string }[] = [
  { name: 'Gabi',  color: '#FF6B6B' },
  { name: 'Daria', color: '#A29BFE' },
  { name: 'Nico',  color: '#4ECDC4' },
  { name: 'Mara',  color: '#FDCB6E' },
  { name: 'Michelle', color: '#00B4D8' },
];

interface NamePickerProps {
  onSelect: (name: string) => void;
}

export default function NamePicker({ onSelect }: NamePickerProps) {
  const [takenNames, setTakenNames] = useState<Set<string>>(new Set());

  useEffect(() => {
    const activeRef = ref(db, 'activeUsers');
    onValue(activeRef, snapshot => {
      setTakenNames(new Set(Object.keys(snapshot.val() ?? {})));
    });
    return () => off(activeRef);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(8,10,18,0.97)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '32px', padding: '24px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌺</div>
        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
          Welcome to Madeira
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '8px 0 0' }}>
          Who are you?
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '260px' }}>
        {USERS.map(user => {
          const taken = takenNames.has(user.name);
          return (
            <motion.button
              key={user.name}
              whileTap={taken ? {} : { scale: 0.97 }}
              onClick={() => !taken && onSelect(user.name)}
              style={{
                padding: '16px', borderRadius: '16px',
                cursor: taken ? 'not-allowed' : 'pointer',
                background: taken ? 'rgba(255,255,255,0.04)' : `${user.color}15`,
                border: `1.5px solid ${taken ? 'rgba(255,255,255,0.1)' : `${user.color}50`}`,
                color: taken ? 'rgba(255,255,255,0.2)' : user.color,
                fontSize: '17px', fontWeight: 700,
                fontFamily: 'inherit',
                letterSpacing: '0.01em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {user.name}
              {taken && (
                <span style={{ fontSize: '11px', fontWeight: 500, opacity: 0.6 }}>already online</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
