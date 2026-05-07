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

  return (
    <AnimatePresence>
      {weather && !isModalOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 'max(16px, env(safe-area-inset-top))',
            right: '14px',
            zIndex: 99996,
            background: 'rgba(8, 10, 18, 0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: '22px', lineHeight: 1 }}>{weatherEmoji(weather.code)}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
              {weather.temp}°C
            </span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>
              {weatherLabel(weather.code)} · {weather.wind} km/h
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function WeatherWidget({ isModalOpen }: { isModalOpen: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(<WidgetContent isModalOpen={isModalOpen} />, document.body);
}
