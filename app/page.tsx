'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Location } from '@/data/locations';
import LocationDrawer from '@/components/LocationDrawer';

const MadeiraMap = dynamic(() => import('@/components/MadeiraMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-[#080a12]">
      <div className="flex flex-col items-center gap-5">
        <div
          className="w-11 h-11 rounded-full animate-spin"
          style={{
            background:
              'conic-gradient(from 0deg, #FF6B6B, #A29BFE, #4ECDC4, #00B4D8, #FF6B6B)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)',
          }}
        />
        <div className="flex flex-col items-center gap-1">
          <p className="text-white/60 text-[13px] font-medium tracking-[0.15em] uppercase">
            Loading Madeira
          </p>
          <p className="text-white/25 text-[11px]">Pearl of the Atlantic</p>
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#080a12]">
      <MadeiraMap
        onLocationSelect={setSelectedLocation}
        selectedLocation={selectedLocation}
      />
      <LocationDrawer
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </main>
  );
}
