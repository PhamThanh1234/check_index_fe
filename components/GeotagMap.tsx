import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface GeotagMapProps {
  latitude: number;
  longitude: number;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
}

function GeotagMap({ latitude, longitude, setLatitude, setLongitude }: GeotagMapProps) {
  const [mounted, setMounted] = useState(false);

  // Chỉ render map sau khi component được mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Tránh render khi chưa mount
  }

  return (
    <div style={{ height: 300 }}> {/* Đảm bảo div có chiều cao */}
      <MapContainer center={[latitude, longitude]} zoom={2} style={{ height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[latitude, longitude]} icon={markerIcon} />
        <MapEvents setLatitude={setLatitude} setLongitude={setLongitude} />
      </MapContainer>
    </div>
  );
}

function MapEvents({ setLatitude, setLongitude }: { setLatitude: (lat: number) => void; setLongitude: (lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
    },
  });

  return null;
}

export default GeotagMap;
