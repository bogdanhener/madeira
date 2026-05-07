'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { locations } from '@/data/locations';

function HeaderContent() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 px-4"
      style={{
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        pointerEvents: 'none',
        zIndex: 99997,
      }}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="flex items-center justify-between rounded-2xl px-4 py-3"
        style={{
          pointerEvents: 'auto',
          background: 'rgba(8, 10, 18, 0.82)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[18px]"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,107,0.9) 0%, rgba(162,155,254,0.9) 100%)',
              boxShadow: '0 2px 12px rgba(255,107,107,0.4)',
            }}
          >
            🏝
          </div>
          <div>
            <h1 className="text-[14px] font-bold text-white leading-tight tracking-[-0.01em]">
              Madeira Explorer
            </h1>
            <p className="text-[11px] leading-tight" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Pearl of the Atlantic
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.09)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <span
            className="w-[6px] h-[6px] rounded-full animate-pulse"
            style={{ background: 'linear-gradient(135deg, #FF6B6B, #A29BFE)' }}
          />
          <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {locations.length} places
          </span>
        </div>
      </div>
    </motion.header>
  );
}

export default function FloatingHeader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(<HeaderContent />, document.body);
}
