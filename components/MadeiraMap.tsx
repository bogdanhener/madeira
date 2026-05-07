'use client';

import 'leaflet/dist/leaflet.css';
import { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Location, locations, MADEIRA_CENTER, DEFAULT_ZOOM } from '@/data/locations';

function createPinIcon(
  color: string,
  isSelected: boolean,
  isHiddenGem = false,
  isVisited = false,
  routeIndex?: number,
): L.DivIcon {
  const outerSize = isSelected ? 72 : 60;
  const dotSize   = isSelected ? 20 : 16;
  const opacity   = isVisited && !isSelected ? 0.45 : 1;

  const shape = isHiddenGem
    ? `<div style="width:${dotSize}px;height:${dotSize}px;background:${color};transform:rotate(45deg);border:2.5px solid rgba(255,255,255,0.95);box-shadow:0 3px 16px ${color}80,0 1px 6px rgba(0,0,0,0.6);border-radius:3px;${isSelected ? `filter:brightness(1.3) drop-shadow(0 0 12px ${color});` : ''}"></div>`
    : `<div style="width:${dotSize}px;height:${dotSize}px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid rgba(255,255,255,0.95);box-shadow:0 3px 16px ${color}60,0 1px 6px rgba(0,0,0,0.6);${isSelected ? `filter:brightness(1.25) drop-shadow(0 0 10px ${color});` : ''}"></div>`;

  const visitedBadge = isVisited
    ? `<div style="position:absolute;top:3px;right:3px;width:14px;height:14px;background:#00b894;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:8px;color:white;font-weight:700;line-height:1;z-index:2;pointer-events:none;">✓</div>`
    : '';

  const routeBadge = routeIndex !== undefined
    ? `<div style="position:absolute;top:-3px;left:-3px;width:18px;height:18px;background:#2d3436;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:white;line-height:1;z-index:2;pointer-events:none;">${routeIndex + 1}</div>`
    : '';

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:${outerSize}px;height:${outerSize}px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:${opacity};">
        <div style="position:absolute;width:100%;height:100%;background:${color}30;border-radius:50%;animation:pinPulse 2.8s ease-in-out infinite;pointer-events:none;"></div>
        <div style="position:absolute;width:${outerSize*0.6}px;height:${outerSize*0.6}px;background:${color}45;border-radius:50%;animation:pinPulse 2.8s ease-in-out infinite 0.4s;pointer-events:none;"></div>
        <div style="position:relative;display:flex;align-items:center;justify-content:center;pointer-events:none;">${shape}</div>
        ${visitedBadge}
        ${routeBadge}
      </div>
    `,
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize * 0.78],
  });
}

interface LocationMarkerProps {
  location: Location;
  onSelect: (loc: Location) => void;
  isSelected: boolean;
  isVisited: boolean;
  routeIndex?: number;
  isRouteMode: boolean;
}

function LocationMarker({ location, onSelect, isSelected, isVisited, routeIndex, isRouteMode }: LocationMarkerProps) {
  const icon = useMemo(
    () => createPinIcon(location.pinColor, isSelected, location.category === 'hidden_gem', isVisited, routeIndex),
    [location.pinColor, location.category, isSelected, isVisited, routeIndex]
  );
  return (
    <Marker
      position={location.coordinates}
      icon={icon}
      eventHandlers={{ click: () => onSelect(location) }}
    />
  );
}

interface MapControllerProps {
  selectedLocation: Location | null;
  userPosition: [number, number] | null;
}

function MapController({ selectedLocation, userPosition }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.flyTo(
        [selectedLocation.coordinates[0] - 0.025, selectedLocation.coordinates[1]],
        Math.max(map.getZoom(), 13),
        { duration: 1.4, easeLinearity: 0.2 }
      );
    }
  }, [selectedLocation, map]);

  useEffect(() => {
    if (userPosition) {
      map.flyTo(userPosition, 14, { duration: 1.5, easeLinearity: 0.2 });
    }
  }, [userPosition, map]);

  return null;
}

interface MadeiraMapProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
  visitedIds: Set<string>;
  routeIds: string[];
  isRouteMode: boolean;
  userPosition: [number, number] | null;
}

export default function MadeiraMap({
  onLocationSelect, selectedLocation, visitedIds, routeIds, isRouteMode, userPosition,
}: MadeiraMapProps) {
  const routeCoords = routeIds
    .map(id => locations.find(l => l.id === id))
    .filter(Boolean)
    .map(l => l!.coordinates) as [number, number][];

  return (
    <MapContainer
      center={MADEIRA_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      attributionControl={true}
    >
      <ZoomControl position="bottomleft" />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={19}
        subdomains="abcd"
      />

      {/* Route polyline */}
      {routeCoords.length >= 2 && (
        <Polyline
          positions={routeCoords}
          pathOptions={{ color: '#A29BFE', weight: 3, opacity: 0.85, dashArray: '10 6' }}
        />
      )}

      {/* Location markers */}
      {locations.map(location => (
        <LocationMarker
          key={location.id}
          location={location}
          onSelect={onLocationSelect}
          isSelected={selectedLocation?.id === location.id}
          isVisited={visitedIds.has(location.id)}
          routeIndex={routeIds.includes(location.id) ? routeIds.indexOf(location.id) : undefined}
          isRouteMode={isRouteMode}
        />
      ))}

      {/* User GPS position */}
      {userPosition && (
        <>
          <CircleMarker
            center={userPosition}
            radius={18}
            pathOptions={{ color: '#4285f4', weight: 0, fillColor: '#4285f4', fillOpacity: 0.15 }}
          />
          <CircleMarker
            center={userPosition}
            radius={8}
            pathOptions={{ color: '#fff', weight: 3, fillColor: '#4285f4', fillOpacity: 1 }}
          />
        </>
      )}

      <MapController selectedLocation={selectedLocation} userPosition={userPosition} />
    </MapContainer>
  );
}
