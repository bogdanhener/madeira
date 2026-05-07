'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Weather {
  temp: number;
  wind: number;
  code: number;
}

function weatherEmoji(code: number): string {
  if (code === 0)  return '☀️';
  if (code <= 3)   return '⛅';
  if (code <= 48)  return '🌫️';
  if (code <= 67)  return '🌧️';
  if (code <= 77)  return '❄️';
  if (code <= 82)  return '🌦️';
  return '⛈️';
}

function weatherLabel(code: number): string {
  if (code === 0)  return 'Clear';
  if (code <= 3)   return 'Partly cloudy';
  if (code <= 48)  return 'Foggy';
  if (code <= 67)  return 'Rainy';
  if (code <= 77)  return 'Snow';
  if (code <= 82)  return 'Showers';
  return 'Stormy';
}

function WidgetContent({ isModalOpen }: { isModalOpen: boolean }) {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=32.6669&longitude=-16.9241&current=temperature_2m,windspeed_10m,weathercode&timezone=Atlantic%2FMadeira'
    )
      .then(r => r.json())
      .then(data => {
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          wind: Math.round(data.current.windspeed_10m),
          code: data.current.weathercode,
        });
      })
      .catch(() => {});
  }, []);

  if (isModalOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: weather ? 1 : 0.4, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 'max(14px, env(safe-area-inset-top))',
        left: 'calc(50% + 4px)',
        right: '14px',
        zIndex: 99996,
        background: 'rgba(8,10,18,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '18px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        pointerEvents: 'none',
      }}
    >
      <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>
        {weather ? weatherEmoji(weather.code) : '—'}
      </span>
      <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
        {weather ? `${weather.temp}°C` : '…'}
      </span>
      {weather && (
        <>
          <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.42)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {weatherLabel(weather.code)} · {weather.wind} km/h
          </span>
        </>
      )}
    </motion.div>
  );
}

export default function WeatherWidget({ isModalOpen }: { isModalOpen: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(<WidgetContent isModalOpen={isModalOpen} />, document.body);
}
