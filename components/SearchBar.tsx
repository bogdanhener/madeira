'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Location, locations, CATEGORY_LABELS } from '@/data/locations';

interface SearchBarProps {
  onSelect: (location: Location) => void;
  isModalOpen: boolean;
}

const PIN_COLORS: Record<string, string> = Object.fromEntries(
  locations.map(l => [l.id, l.pinColor])
);

function SearchContent({ onSelect, isModalOpen }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? locations.filter(l =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        CATEGORY_LABELS[l.category].toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (location: Location) => {
    onSelect(location);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  if (isModalOpen) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 'max(14px, env(safe-area-inset-top))',
        left: '14px',
        right: '14px',
        zIndex: 99996,
      }}
    >
      {/* Input row */}
      <div style={{
        background: 'rgba(8,10,18,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: open && results.length > 0 ? '18px 18px 0 0' : '18px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
          <circle cx="6.5" cy="6.5" r="5" stroke="white" strokeWidth="1.8" />
          <path d="M11 11L14 14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search locations…"
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: '#fff', fontSize: '14px', flex: 1, fontFamily: 'inherit',
          }}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => { setQuery(''); setOpen(false); }}
              style={{
                background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
                width: '22px', height: '22px', borderRadius: '50%',
                color: 'rgba(255,255,255,0.7)', fontSize: '11px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              background: 'rgba(8,10,18,0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderTop: 'none',
              borderRadius: '0 0 18px 18px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            {results.map((location, i) => (
              <button
                key={location.id}
                onClick={() => handleSelect(location)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '11px 14px',
                  display: 'flex', alignItems: 'center', gap: '11px',
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: location.pinColor, flexShrink: 0,
                  boxShadow: `0 0 6px ${location.pinColor}80`,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                    {location.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.3 }}>
                    {CATEGORY_LABELS[location.category]} · {location.duration}
                  </p>
                </div>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
                  <path d="M3 2L7 5L3 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SearchBar(props: SearchBarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(<SearchContent {...props} />, document.body);
}
