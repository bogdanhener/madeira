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
import { ref, set, onValue, off, remove, onDisconnect } from 'firebase/database';

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

  // Start GPS watch for a given user — safe to call any time
  const startGPS = useCallback((userName: string) => {
    if (!navigator.geolocation || watchIdRef.current !== null) return;
    setGpsLoading(true);
    const id = navigator.geolocation.watchPosition(
      pos => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        setGpsLoading(false);
        set(ref(db, `locations/${userName}`), {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          ts:  Date.now(),
        });
      },
      () => setGpsLoading(false),
      // Low accuracy to save battery — good enough for "where is everyone" safety use.
      // maximumAge lets it reuse a recent fix instead of powering the GPS radio every time.
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 },
    );
    watchIdRef.current = id;
  }, []);

  // Stop GPS and remove from Firebase
  const stopGPS = useCallback((userName: string | null) => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setUserPosition(null);
    if (userName) remove(ref(db, `locations/${userName}`));
  }, []);

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

  // Auto-start GPS when the user is known (covers returning users stored in localStorage)
  useEffect(() => {
    if (currentUser) startGPS(currentUser);
  }, [currentUser, startGPS]);

  // Restart the GPS watch whenever the app comes back to the foreground.
  // Mobile browsers suspend watchPosition while backgrounded, so this re-arms it on return.
  useEffect(() => {
    if (!currentUser) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        startGPS(currentUser);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [currentUser, startGPS]);

  // Keep the screen awake while a user is active, so GPS keeps broadcasting
  // instead of the tab suspending on screen sleep. Re-acquire on foreground.
  useEffect(() => {
    if (!currentUser) return;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<any> } };
    if (!nav.wakeLock) return;
    let sentinel: any = null;
    let cancelled = false;

    const acquire = async () => {
      if (document.visibilityState !== 'visible' || sentinel) return;
      try {
        sentinel = await nav.wakeLock!.request('screen');
        if (cancelled) { sentinel.release?.(); sentinel = null; return; }
        sentinel.addEventListener?.('release', () => { sentinel = null; });
      } catch { /* denied or unsupported — harmless */ }
    };

    const onVisible = () => { if (document.visibilityState === 'visible') acquire(); };
    acquire();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      sentinel?.release?.();
      sentinel = null;
    };
  }, [currentUser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const handleNameSelect = useCallback((name: string) => {
    localStorage.setItem('madeira-user', name);
    setCurrentUser(name);
    // Mark name as taken; auto-release if browser closes/crashes
    const activeRef = ref(db, `activeUsers/${name}`);
    set(activeRef, true);
    onDisconnect(activeRef).remove();
    // Start GPS immediately, using the user gesture from tapping the name
    startGPS(name);
  }, [startGPS]);

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

  // GPS button manually toggles sharing on/off
  const handleGPSRequest = useCallback(() => {
    if (!navigator.geolocation) return;
    if (watchIdRef.current !== null) {
      stopGPS(currentUser);
    } else {
      if (currentUser) startGPS(currentUser);
    }
  }, [currentUser, startGPS, stopGPS]);

  // Open Google Maps directions to a friend's position
  const handleFriendClick = useCallback((name: string, pos: FriendPosition) => {
    const url = userPosition
      ? `https://www.google.com/maps/dir/${userPosition[0]},${userPosition[1]}/${pos.lat},${pos.lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${pos.lat},${pos.lng}`;
    window.open(url, '_blank');
  }, [userPosition]);

  const handleLogout = useCallback(() => {
    stopGPS(currentUser);
    if (currentUser) remove(ref(db, `activeUsers/${currentUser}`));
    localStorage.removeItem('madeira-user');
    setCurrentUser(null);
  }, [currentUser, stopGPS]);

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
        currentUser={currentUser}
        currentUserColor={currentUserColor}
        onLogout={handleLogout}
      />
    </main>
  );
}
