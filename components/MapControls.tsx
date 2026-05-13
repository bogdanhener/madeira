'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { locations, Location } from '@/data/locations';

interface MapControlsProps {
  isRouteMode: boolean;
  onToggleRoute: () => void;
  routeIds: string[];
  onClearRoute: () => void;
  onGPSRequest: () => void;
  gpsLoading: boolean;
  gpsActive: boolean;
  currentUser: string | null;
  currentUserColor: string;
  onLogout: () => void;
}

function buildMapsUrl(routeLocations: Location[]): string {
  if (routeLocations.length < 2) return '';
  const coords = routeLocations.map(l => `${l.coordinates[0]},${l.coordinates[1]}`);
  return `https://www.google.com/maps/dir/${coords.join('/')}`;
}

function ControlsContent({
  isRouteMode, onToggleRoute, routeIds, onClearRoute, onGPSRequest, gpsLoading, gpsActive,
  currentUser, currentUserColor, onLogout,
}: MapControlsProps) {
  const routeLocations = routeIds.map(id => locations.find(l => l.id === id)).filter(Boolean) as Location[];
  const mapsUrl = buildMapsUrl(routeLocations);

  return (
    <div style={{
      position: 'fixed',
      bottom: '110px',
      right: '14px',
      zIndex: 99996,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '8px',
    }}>
      {/* Route info panel */}
      <AnimatePresence>
        {isRouteMode && routeLocations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            style={{
              background: 'rgba(8,10,18,0.94)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '12px 14px',
              minWidth: '180px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {routeLocations.length} stop{routeLocations.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={onClearRoute}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
                  fontSize: '10px', color: 'rgba(255,255,255,0.5)', padding: '3px 8px',
                  borderRadius: '99px', fontFamily: 'inherit',
                }}
              >Clear</button>
            </div>

            {routeLocations.map((loc, i) => (
              <div key={loc.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < routeLocations.length - 1 ? '6px' : '0' }}>
                <span style={{
                  width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                  background: loc.pinColor, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#000',
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.3, flex: 1 }}>
                  {loc.name}
                </span>
              </div>
            ))}

            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  marginTop: '12px', padding: '8px 12px', borderRadius: '12px',
                  background: '#A29BFE', color: '#fff', textDecoration: 'none',
                  fontSize: '12px', fontWeight: 700, fontFamily: 'inherit',
                }}
              >
                ↗ Navigate
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User badge / logout */}
      {currentUser && (
        <button
          onClick={onLogout}
          title="Switch user"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            height: '34px', padding: '0 13px',
            borderRadius: '99px', cursor: 'pointer',
            background: 'rgba(8,10,18,0.88)',
            border: `1.5px solid ${currentUserColor}55`,
            color: currentUserColor,
            fontSize: '12px', fontWeight: 700,
            fontFamily: 'inherit',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {currentUser}
          <span style={{ opacity: 0.45, fontSize: '10px' }}>✕</span>
        </button>
      )}

      {/* Route toggle button */}
      <button
        onClick={onToggleRoute}
        title={isRouteMode ? 'Exit route mode' : 'Plan a route'}
        style={{
          width: '44px', height: '44px', borderRadius: '14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
          background: isRouteMode ? '#A29BFE' : 'rgba(8,10,18,0.88)',
          border: `1px solid ${isRouteMode ? '#A29BFE' : 'rgba(255,255,255,0.12)'}`,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          transition: 'background 0.2s, border-color 0.2s',
        }}
      >
        🗺
      </button>

      {/* GPS button */}
      <button
        onClick={onGPSRequest}
        title="Centre on my location"
        style={{
          width: '44px', height: '44px', borderRadius: '14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
          background: gpsActive ? 'rgba(66,133,244,0.2)' : 'rgba(8,10,18,0.88)',
          border: `1px solid ${gpsActive ? 'rgba(66,133,244,0.6)' : 'rgba(255,255,255,0.12)'}`,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          transition: 'background 0.2s, border-color 0.2s',
        }}
      >
        {gpsLoading ? '⌛' : '📍'}
      </button>
    </div>
  );
}

export default function MapControls(props: MapControlsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(<ControlsContent {...props} />, document.body);
}
