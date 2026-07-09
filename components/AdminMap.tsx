'use client';

import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { MADEIRA_CENTER, DEFAULT_ZOOM } from '@/data/locations';

export type AdminMarker = {
  name: string;
  lat: number;
  lng: number;
  color: string;
  stale: boolean;
};

function createPin(name: string, color: string, stale: boolean): L.DivIcon {
  const dim = stale ? 'filter:grayscale(0.7);opacity:0.5;' : '';
  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;pointer-events:none;${dim}">
        <div style="background:rgba(8,10,18,0.88);color:${color};font-size:11px;font-weight:800;padding:3px 10px;border-radius:99px;border:1.5px solid ${color}70;white-space:nowrap;backdrop-filter:blur(10px);box-shadow:0 2px 10px rgba(0,0,0,0.5);letter-spacing:0.05em;font-family:system-ui,sans-serif;">${name}</div>
        <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;width:32px;height:32px;background:${color}25;border-radius:50%;"></div>
          <div style="width:13px;height:13px;background:${color};border-radius:50%;border:2.5px solid white;box-shadow:0 2px 8px ${color}90;"></div>
        </div>
      </div>
    `,
    iconSize: [80, 50],
    iconAnchor: [40, 46],
  });
}

export default function AdminMap({ markers }: { markers: AdminMarker[] }) {
  const icons = useMemo(
    () => markers.map(m => createPin(m.name, m.color, m.stale)),
    [markers],
  );

  return (
    <MapContainer
      center={MADEIRA_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      {markers.map((m, i) => (
        <Marker key={m.name} position={[m.lat, m.lng]} icon={icons[i]} />
      ))}
    </MapContainer>
  );
}
