'use client';

import 'leaflet/dist/leaflet.css';
import { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Location, locations, MADEIRA_CENTER, DEFAULT_ZOOM } from '@/data/locations';

function createPinIcon(color: string, isSelected: boolean, isHiddenGem = false): L.DivIcon {
  const outerSize = isSelected ? 72 : 60;
  const dotSize = isSelected ? 20 : 16;

  // Hidden gem pins use a diamond shape with a sparkle label
  const innerShape = isHiddenGem
    ? `<div style="width:${dotSize}px;height:${dotSize}px;background:${color};transform:rotate(45deg);border:2.5px solid rgba(255,255,255,0.95);box-shadow:0 3px 16px ${color}80,0 1px 6px rgba(0,0,0,0.6);border-radius:3px;${isSelected ? `filter:brightness(1.3) drop-shadow(0 0 12px ${color});` : ''}"></div>`
    : `<div style="width:${dotSize}px;height:${dotSize}px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid rgba(255,255,255,0.95);box-shadow:0 3px 16px ${color}60,0 1px 6px rgba(0,0,0,0.6);${isSelected ? `filter:brightness(1.25) drop-shadow(0 0 10px ${color});` : ''}"></div>`;

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:${outerSize}px;height:${outerSize}px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <div style="position:absolute;width:100%;height:100%;background:${color}30;border-radius:50%;animation:pinPulse 2.8s ease-in-out infinite;pointer-events:none;"></div>
        <div style="position:absolute;width:${outerSize * 0.6}px;height:${outerSize * 0.6}px;background:${color}45;border-radius:50%;animation:pinPulse 2.8s ease-in-out infinite 0.4s;pointer-events:none;"></div>
        <div style="position:relative;display:flex;align-items:center;justify-content:center;pointer-events:none;">
          ${innerShape}
        </div>
      </div>
    `,
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize * 0.78],
  });
}

function LocationMarker({
  location,
  onSelect,
  isSelected,
}: {
  location: Location;
  onSelect: (loc: Location) => void;
  isSelected: boolean;
}) {
  const icon = useMemo(
    () => createPinIcon(location.pinColor, isSelected, location.category === 'hidden_gem'),
    [location.pinColor, isSelected, location.category]
  );

  return (
    <Marker
      position={location.coordinates}
      icon={icon}
      eventHandlers={{ click: () => onSelect(location) }}
    />
  );
}

function MapController({ selectedLocation }: { selectedLocation: Location | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      const currentZoom = map.getZoom();
      map.flyTo(
        [selectedLocation.coordinates[0] - 0.025, selectedLocation.coordinates[1]],
        Math.max(currentZoom, 13),
        { duration: 1.4, easeLinearity: 0.2 }
      );
    }
  }, [selectedLocation, map]);

  return null;
}

interface MadeiraMapProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
}

export default function MadeiraMap({ onLocationSelect, selectedLocation }: MadeiraMapProps) {
  return (
    <MapContainer
      center={MADEIRA_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={19}
        subdomains="abcd"
      />
      {locations.map((location) => (
        <LocationMarker
          key={location.id}
          location={location}
          onSelect={onLocationSelect}
          isSelected={selectedLocation?.id === location.id}
        />
      ))}
      <MapController selectedLocation={selectedLocation} />
    </MapContainer>
  );
}
