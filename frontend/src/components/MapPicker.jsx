import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapPicker({ location, onChange }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: location ? [location.lng, location.lat] : [-0.1276, 51.5074], // Default to London
      zoom: 14
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('click', (e) => {
      const coords = e.lngLat;
      updateMarker(coords);
      onChange({ lat: coords.lat, lng: coords.lng });
    });

    if (location) {
      updateMarker(location);
    }
  }, []);

  const updateMarker = (coords) => {
    if (!marker.current) {
      marker.current = new maplibregl.Marker({ color: 'var(--accent-primary)' })
        .setLngLat(coords)
        .addTo(map.current);
    } else {
      marker.current.setLngLat(coords);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
        map.current.flyTo({ center: coords, zoom: 15 });
        updateMarker(coords);
        onChange(coords);
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <form onSubmit={handleSearch} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          placeholder="Search location..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--bg-panel)', background: 'var(--bg-surface)', color: 'white' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer' }}>
          Search
        </button>
      </form>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
