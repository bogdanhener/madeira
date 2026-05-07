'use client';

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Location, CATEGORY_LABELS } from '@/data/locations';

interface LocationDrawerProps {
  location: Location | null;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SectionHeader({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-base leading-none">{emoji}</span>
      <h3 className="text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">{label}</h3>
    </div>
  );
}

function ModalContent({ location, onClose }: { location: Location; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Backdrop — rendered into body so it's always on top */}
      <motion.div
        key="modal-backdrop"
        className="fixed inset-0"
        style={{ background: 'rgba(0,0,0,0.55)', zIndex: 99998 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Modal card */}
      <motion.div
        key={`modal-${location.id}`}
        className="fixed left-0 right-0 bottom-0 mx-auto rounded-t-[28px] overflow-hidden"
        style={{
          zIndex: 99999,
          maxWidth: '480px',
          maxHeight: '82vh',
          background: 'rgba(12, 14, 24, 0.98)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderTop: '1px solid rgba(255,255,255,0.09)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        initial={{ y: '100%', opacity: 0.8 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0.8 }}
        transition={{ type: 'spring', damping: 32, stiffness: 260, mass: 0.8 }}
      >
        {/* Colored gradient wash */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '150px',
            background: `linear-gradient(180deg, ${location.pinColor}22 0%, transparent 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-[3px] rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-2 pb-4 relative">
          <div className="flex-1 pr-3">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[10px] font-bold tracking-[0.14em] mb-2"
              style={{
                background: `${location.pinColor}20`,
                color: location.pinColor,
                border: `1px solid ${location.pinColor}38`,
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: location.pinColor,
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              {CATEGORY_LABELS[location.category].toUpperCase()}
            </div>
            <h2 className="text-[26px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
              {location.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-white/90 active:scale-95 transition-all mt-1 flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.09)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/[0.07]" />

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="overflow-y-auto overscroll-contain pb-10"
          style={{ maxHeight: 'calc(82vh - 148px)' }}
        >
          <div className="px-5 pt-4 space-y-5">
            {/* Description */}
            <p className="text-[13.5px] text-white/55 leading-[1.65]">{location.description}</p>

            {/* Highlights */}
            <section>
              <SectionHeader emoji="🏛" label="Highlights" />
              <ul className="space-y-[9px]">
                {location.attractions.map((attr, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-white/75 leading-[1.5]">
                    <span className="mt-[5px] flex-shrink-0 text-[8px]" style={{ color: location.pinColor }}>
                      ●
                    </span>
                    {attr}
                  </li>
                ))}
              </ul>
            </section>

            <div className="h-px bg-white/[0.07]" />

            {/* Food */}
            <section>
              <SectionHeader emoji="🍽" label="Food & Dining" />
              <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                {location.food.map((item, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-44 rounded-2xl p-3.5"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <span
                      className="inline-block text-[10px] font-semibold px-2 py-[3px] rounded-full mb-2"
                      style={{
                        background: `${location.pinColor}1C`,
                        color: location.pinColor,
                        border: `1px solid ${location.pinColor}2A`,
                      }}
                    >
                      {item.type}
                    </span>
                    <p className="text-[13px] font-semibold text-white mb-1 leading-tight">{item.name}</p>
                    <p className="text-[11.5px] text-white/45 leading-[1.5] line-clamp-3">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Nightlife */}
            {location.nightlife.length > 0 && (
              <section>
                <SectionHeader emoji="🍸" label="Bars & Nightlife" />
                <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                  {location.nightlife.map((item, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-44 rounded-2xl p-3.5"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <span
                        className="inline-block text-[10px] font-semibold px-2 py-[3px] rounded-full mb-2"
                        style={{
                          background: `${location.pinColor}1C`,
                          color: location.pinColor,
                          border: `1px solid ${location.pinColor}2A`,
                        }}
                      >
                        {item.type}
                      </span>
                      <p className="text-[13px] font-semibold text-white mb-1 leading-tight">{item.name}</p>
                      <p className="text-[11.5px] text-white/45 leading-[1.5] line-clamp-3">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tips */}
            {location.tips && location.tips.length > 0 && (
              <section>
                <SectionHeader emoji="💡" label="Travel Tips" />
                <ul className="space-y-2">
                  {location.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[13px] text-white/65 leading-[1.55] rounded-xl p-3"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <span className="flex-shrink-0 mt-[2px] text-[11px] font-bold" style={{ color: location.pinColor }}>
                        →
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function LocationDrawer({ location, onClose }: LocationDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {location && <ModalContent key={location.id} location={location} onClose={onClose} />}
    </AnimatePresence>,
    document.body
  );
}
