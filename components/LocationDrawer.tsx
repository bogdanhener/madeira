'use client';

import { useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate, PanInfo } from 'framer-motion';
import { Location, CATEGORY_LABELS } from '@/data/locations';

interface LocationDrawerProps {
  location: Location | null;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L12 12M12 1L1 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

export default function LocationDrawer({ location, onClose }: LocationDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 550) {
      onClose();
    } else {
      animate(y, 0, { type: 'spring', damping: 30, stiffness: 240 });
    }
  };

  return (
    <AnimatePresence>
      {location && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key={`drawer-${location.id}`}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] overflow-hidden"
            style={{
              y,
              background: 'rgba(8, 10, 18, 0.97)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              maxHeight: '84vh',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%', transition: { duration: 0.28, ease: [0.32, 0, 0.67, 0] } }}
            transition={{ type: 'spring', damping: 30, stiffness: 230 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.18 }}
            onDragEnd={handleDragEnd}
          >
            {/* Colored gradient wash */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '140px',
                background: `linear-gradient(180deg, ${location.pinColor}1A 0%, transparent 100%)`,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Drag handle */}
            <div className="relative z-10 flex justify-center pt-3 pb-1 touch-none">
              <div className="w-9 h-[3.5px] rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between px-5 pt-1 pb-4">
              <div className="flex-1 pr-10">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[10px] font-bold tracking-[0.15em] mb-2"
                  style={{
                    background: `${location.pinColor}1E`,
                    color: location.pinColor,
                    border: `1px solid ${location.pinColor}35`,
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
                <h2 className="text-[26px] font-bold text-white leading-[1.1] tracking-[-0.01em]">
                  {location.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-white/80 transition-colors mt-[2px] flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-white/[0.07] relative z-10" />

            {/* Scrollable content — stopPropagation prevents drawer drag from this area */}
            <div
              ref={scrollRef}
              className="relative z-10 overflow-y-auto overscroll-contain pb-10"
              style={{ maxHeight: 'calc(84vh - 150px)' }}
              onPointerDownCapture={(e) => e.stopPropagation()}
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
                        <span
                          className="mt-[5px] flex-shrink-0 text-[8px] leading-none"
                          style={{ color: location.pinColor }}
                        >
                          ●
                        </span>
                        {attr}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Divider */}
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
                          <span
                            className="flex-shrink-0 mt-[2px] text-[11px] font-bold"
                            style={{ color: location.pinColor }}
                          >
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
      )}
    </AnimatePresence>
  );
}
