'use client';

import { motion } from 'framer-motion';

export const USERS: { name: string; color: string }[] = [
  { name: 'Gabi',  color: '#FF6B6B' },
  { name: 'Daria', color: '#A29BFE' },
  { name: 'Nico',  color: '#4ECDC4' },
  { name: 'Mara',  color: '#FDCB6E' },
];

interface NamePickerProps {
  onSelect: (name: string) => void;
}

export default function NamePicker({ onSelect }: NamePickerProps) {
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
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '8px', margin: '8px 0 0' }}>
          Who are you?
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '260px' }}>
        {USERS.map(user => (
          <motion.button
            key={user.name}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(user.name)}
            style={{
              padding: '16px', borderRadius: '16px', cursor: 'pointer',
              background: `${user.color}15`,
              border: `1.5px solid ${user.color}50`,
              color: user.color,
              fontSize: '17px', fontWeight: 700,
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
            }}
          >
            {user.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
