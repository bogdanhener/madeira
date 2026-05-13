'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Location } from '@/data/locations';
import LocationDrawer from '@/components/LocationDrawer';
import WeatherWidget from '@/components/WeatherWidget';
import SearchBar from '@/components/SearchBar';
import MapControls from '@/components/MapControls';
import NamePicker, { USERS } from '@/components/NamePicker';
import { db } from '@/lib/firebase';
import { ref, set, onValue, off, remove } from 'firebase/database';

export type FriendPosition = { lat: number; lng: number; color: string };
export type ActiveRoute = {
  coordinates: [number, number][];
  color: string;
  name: string;
  distance: number;
  duration: number;
};

function formatDistance(m: number) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}
function formatDuration(s: number) {
  const mins = Math.round(s / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60), rem = mins % 60;
  return rem > 0 ? `${h}h ${rem}min` : `${h}h`;
}

const MadeiraMap = dynamic(() => import('@/components/MadeiraMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-[#080a12]">
      <div className="flex flex-col items-center gap-5">
        <div
          className="w-11 h-11 rounded-full animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, #FF6B6B, #A29BFE, #4ECDC4, #00B4D8, #FF6B6B)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)',
          }}
        />
        <div className="flex flex-col items-center gap-1">
          <p className="text-white/60 text-[13px] font-medium tracking-[0.15em] uppercase">Loading Madeira</p>
          <p className="text-white/25 text-[11px]">Pearl of the Atlantic</p>
        </div>
      </div>
    </div>
  ),
});

function getInitialVisited(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem('madeira-visited');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch { return new Set(); }
}

function getStoredUser(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('madeira-user');
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [visitedIds, setVisitedIds]             = useState<Set<string>>(getInitialVisited);
  const [routeIds, setRouteIds]                 = useState<string[]>([]);
  const [isRouteMode, setIsRouteMode]           = useState(false);
  const [userPosition, setUserPosition]         = useState<[number, number] | null>(null);
  const [gpsLoading, setGpsLoading]             = useState(false);
  const [currentUser, setCurrentUser]           = useState<string | null>(getStoredUser);
  const [friendPositions, setFriendPositions]   = useState<Record<string, FriendPosition>>({});
  const [activeRoute, setActiveRoute]           = useState<ActiveRoute | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const currentUserColor = USERS.find(u => u.name === currentUser)?.color ?? '#4285f4';

  // Listen to all friend positions in Firebase
  useEffect(() => {
    if (!currentUser) return;
    const locRef = ref(db, 'locations');
    onValue(locRef, snapshot => {
      const data = snapshot.val() ?? {};
      const friends: Record<string, FriendPosition> = {};
      Object.entries(data).forEach(([name, pos]: [string, any]) => {
        if (name !== currentUser) {
          const cfg = USERS.find(u => u.name === name);
          friends[name] = { lat: pos.lat, lng: pos.lng, color: cfg?.color ?? '#ffffff' };
        }
      });
      setFriendPositions(friends);
    });
    return () => off(locRef);
  }, [currentUser]);

  // Cleanup GPS watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const handleNameSelect = useCallback((name: string) => {
    localStorage.setItem('madeira-user', name);
    setCurrentUser(name);
  }, []);

  const markVisited = useCallback((id: string) => {
    setVisitedIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem('madeira-visited', JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const handleLocationSelect = useCallback((location: Location) => {
    if (isRouteMode) {
      setRouteIds(prev =>
        prev.includes(location.id)
          ? prev.filter(id => id !== location.id)
          : [...prev, location.id]
      );
    } else {
      setSelectedLocation(location);
      markVisited(location.id);
    }
  }, [isRouteMode, markVisited]);

  const handleClose        = useCallback(() => setSelectedLocation(null), []);
  const handleSearchSelect = useCallback((location: Location) => {
    setSelectedLocation(location);
    markVisited(location.id);
  }, [markVisited]);

  const handleGPSRequest = useCallback(() => {
    if (!navigator.geolocation) return;

    // Toggle off
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setUserPosition(null);
      if (currentUser) remove(ref(db, `locations/${currentUser}`));
      return;
    }

    // Toggle on
    setGpsLoading(true);
    const id = navigator.geolocation.watchPosition(
      pos => {
        const position: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(position);
        setGpsLoading(false);
        if (currentUser) {
          set(ref(db, `locations/${currentUser}`), {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            ts:  Date.now(),
          });
        }
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
    watchIdRef.current = id;
  }, [currentUser]);

  const handleFriendClick = useCallback(async (name: string, pos: FriendPosition) => {
    if (!userPosition) {
      setActiveRoute({ coordinates: [], color: pos.color, name, distance: -1, duration: -1 });
      return;
    }
    const [fromLat, fromLng] = userPosition;
    try {
      const res  = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${pos.lng},${pos.lat}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      if (data.routes?.length) {
        const r = data.routes[0];
        setActiveRoute({
          coordinates: r.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number]),
          color: pos.color,
          name,
          distance: r.distance,
          duration: r.duration,
        });
      }
    } catch { /* silently ignore network errors */ }
  }, [userPosition]);

  const handleLogout = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setUserPosition(null);
      if (currentUser) remove(ref(db, `locations/${currentUser}`));
    }
    localStorage.removeItem('madeira-user');
    setCurrentUser(null);
  }, [currentUser]);

  const handleToggleRoute = useCallback(() => {
    setIsRouteMode(prev => !prev);
    setSelectedLocation(null);
  }, []);

  const handleClearRoute = useCallback(() => setRouteIds([]), []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#080a12]">
      {!currentUser && <NamePicker onSelect={handleNameSelect} />}
      <MadeiraMap
        onLocationSelect={handleLocationSelect}
        selectedLocation={selectedLocation}
        visitedIds={visitedIds}
        routeIds={routeIds}
        isRouteMode={isRouteMode}
        userPosition={userPosition}
        currentUserName={currentUser}
        currentUserColor={currentUserColor}
        friendPositions={friendPositions}
        onFriendClick={handleFriendClick}
        activeRoute={activeRoute}
      />

      {/* Friend route info card */}
      {activeRoute && (
        <div style={{
          position: 'fixed', bottom: '110px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 99996,
          background: 'rgba(8,10,18,0.92)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${activeRoute.color}45`,
          borderRadius: '16px', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          minWidth: '220px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: activeRoute.color, fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em' }}>
              → {activeRoute.name}
            </div>
            {activeRoute.distance === -1 ? (
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '3px' }}>
                Enable your GPS first
              </div>
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', marginTop: '3px' }}>
                {formatDistance(activeRoute.distance)} · {formatDuration(activeRoute.duration)} drive
              </div>
            )}
          </div>
          <button
            onClick={() => setActiveRoute(null)}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)', borderRadius: '99px',
              padding: '4px 9px', fontSize: '11px', fontFamily: 'inherit',
            }}
          >✕</button>
        </div>
      )}
      <LocationDrawer location={selectedLocation} onClose={handleClose} />
      <WeatherWidget isModalOpen={!!selectedLocation} />
      <SearchBar onSelect={handleSearchSelect} isModalOpen={!!selectedLocation} />
      <MapControls
        isRouteMode={isRouteMode}
        onToggleRoute={handleToggleRoute}
        routeIds={routeIds}
        onClearRoute={handleClearRoute}
        onGPSRequest={handleGPSRequest}
        gpsLoading={gpsLoading}
        gpsActive={!!userPosition}
        currentUser={currentUser}
        currentUserColor={currentUserColor}
        onLogout={handleLogout}
      />
    </main>
  );
}
