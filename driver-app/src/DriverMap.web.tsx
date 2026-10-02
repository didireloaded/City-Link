import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './driver-map.css';

export default function DriverMap() {
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
    if (!container.current || !token) { setError('Map unavailable. Ride addresses remain accessible.'); return; }
    let map: mapboxgl.Map | undefined;
    let observer: ResizeObserver | undefined;
    try {
      map = new mapboxgl.Map({ container: container.current, accessToken: token, style: 'mapbox://styles/mapbox/streets-v12', center: [17.0832, -22.5609], zoom: 12 });
      map.on('error', () => setError('Map connection unavailable. Use the ride address.'));
      map.on('load', () => setError(''));
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      observer = new ResizeObserver(() => map?.resize());
      observer.observe(container.current);
    } catch { setError('Map unavailable on this device. Ride addresses remain accessible.'); }
    return () => { observer?.disconnect(); map?.remove(); };
  }, []);
  return <><div ref={container} className="citycab-driver-map" aria-label="Interactive Windhoek map" style={{ position: 'absolute', inset: 0, height: '100%', width: '100%' }} />{error && <div role="status" style={{ position: 'absolute', top: 180, left: 20, right: 20, background: 'white', padding: 12, borderRadius: 8, fontSize: 13 }}>{error}</div>}</>;
}
