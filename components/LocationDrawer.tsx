'use client';

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Location, CATEGORY_LABELS } from '@/data/locations';

interface LocationDrawerProps {
  location: Location | null;
  onClose: () => void;
}

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}

function mapsCoords(lat: number, lng: number) {
  return `https://www.google.com/maps/@${lat},${lng},15z`;
}

function ExternalIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ display: 'inline', marginLeft: '3px', verticalAlign: 'middle' }}>
      <path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
      <h3 className="text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.32)' }}>
        {label}
      </h3>
    </div>
  );
}

function ModalContent({ location, onClose }: { location: Location; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lat, lng] = location.coordinates;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="modal-backdrop"
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 99998 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Modal — left/right anchored so no transform conflicts with Framer Motion */}
      <motion.div
        key={`modal-${location.id}`}
        style={{
          position: 'fixed',
          bottom: '12px',
          left: '14px',
          right: '14px',
          maxHeight: '84vh',
          zIndex: 99999,
          background: 'rgba(12, 14, 24, 0.98)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 260, mass: 0.8 }}
      >
        {/* Colored gradient wash */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '160px',
            background: `linear-gradient(180deg, ${location.pinColor}22 0%, transparent 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '4px' }}>
          <div style={{ width: '36px', height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '8px 20px 16px', position: 'relative' }}>
          <div style={{ flex: 1, paddingRight: '12px' }}>
            {/* Category badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '99px',
                background: `${location.pinColor}20`,
                color: location.pinColor,
                border: `1px solid ${location.pinColor}38`,
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                marginBottom: '8px',
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: location.pinColor, flexShrink: 0 }} />
              {CATEGORY_LABELS[location.category].toUpperCase()}
            </div>

            {/* Title */}
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>
              {location.name}
            </h2>

            {/* Google Maps link */}
            <a
              href={mapsCoords(lat, lng)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '8px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: location.pinColor,
                textDecoration: 'none',
                padding: '5px 10px',
                borderRadius: '99px',
                background: `${location.pinColor}18`,
                border: `1px solid ${location.pinColor}30`,
              }}
            >
              📍 Open in Google Maps
              <ExternalIcon />
            </a>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.09)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.55)',
              cursor: 'pointer',
              flexShrink: 0,
              marginTop: '4px',
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '0 20px' }} />

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          style={{ overflowY: 'auto', maxHeight: 'calc(84vh - 170px)', overscrollBehavior: 'contain' }}
        >
          <div style={{ padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Description */}
            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>
              {location.description}
            </p>

            {/* Highlights */}
            <section>
              <SectionHeader emoji="🏛" label="Highlights" />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {location.attractions.map((attr, i) => (
                  <li key={i}>
                    <a
                      href={mapsSearch(`${attr} ${location.name} Madeira`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.78)',
                        textDecoration: 'none',
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: location.pinColor, marginTop: '5px', flexShrink: 0, fontSize: '8px' }}>●</span>
                      <span>
                        {attr}
                        <ExternalIcon />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

            {/* Food */}
            <section>
              <SectionHeader emoji="🍽" label="Food & Dining" />
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginLeft: '-20px', marginRight: '-20px', padding: '0 20px 8px' }}>
                {location.food.map((item, i) => (
                  <a
                    key={i}
                    href={mapsSearch(`${item.name} ${location.name} Madeira`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flexShrink: 0,
                      width: '172px',
                      borderRadius: '16px',
                      padding: '14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      textDecoration: 'none',
                      display: 'block',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '99px',
                        marginBottom: '8px',
                        background: `${location.pinColor}1C`,
                        color: location.pinColor,
                        border: `1px solid ${location.pinColor}2A`,
                      }}
                    >
                      {item.type}
                    </span>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>
                      {item.name} <ExternalIcon />
                    </p>
                    <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  </a>
                ))}
              </div>
            </section>

            {/* Nightlife */}
            {location.nightlife.length > 0 && (
              <section>
                <SectionHeader emoji="🍸" label="Bars & Nightlife" />
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginLeft: '-20px', marginRight: '-20px', padding: '0 20px 8px' }}>
                  {location.nightlife.map((item, i) => (
                    <a
                      key={i}
                      href={mapsSearch(`${item.name} ${location.name} Madeira`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flexShrink: 0,
                        width: '172px',
                        borderRadius: '16px',
                        padding: '14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '99px',
                          marginBottom: '8px',
                          background: `${location.pinColor}1C`,
                          color: location.pinColor,
                          border: `1px solid ${location.pinColor}2A`,
                        }}
                      >
                        {item.type}
                      </span>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>
                        {item.name} <ExternalIcon />
                      </p>
                      <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Tips */}
            {location.tips && location.tips.length > 0 && (
              <section>
                <SectionHeader emoji="💡" label="Travel Tips" />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {location.tips.map((tip, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.65)',
                        lineHeight: 1.55,
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <span style={{ flexShrink: 0, marginTop: '2px', fontSize: '11px', fontWeight: 700, color: location.pinColor }}>
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
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {location && <ModalContent key={location.id} location={location} onClose={onClose} />}
    </AnimatePresence>,
    document.body
  );
}
