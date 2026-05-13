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
      />
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
      />
    </main>
  );
}
