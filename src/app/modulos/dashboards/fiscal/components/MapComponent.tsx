'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix para os ícones do Leaflet em Next.js - necessário para funcionar corretamente
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  value: number;
  quantity: number;
}

interface MapComponentProps {
  locations: LocationData[];
  viewType: 'quantidade' | 'valor';
}

const MapComponent: React.FC<MapComponentProps> = ({ locations, viewType }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-500">Carregando mapa...</div>
      </div>
    );
  }

  // Centro do Brasil (aproximadamente)
  const center: [number, number] = [-15.7942, -47.8825];

  return (
    <div 
      className="w-full h-full relative rounded-lg overflow-hidden"
      style={{ minHeight: '420px', height: '420px' }}
    >
      <MapContainer
        center={center}
        zoom={4}
        style={{ height: '100%', width: '100%', minHeight: '420px' }}
        className="z-0 leaflet-container"
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          minZoom={1}
        />
        
        {locations.map((location) => (
          <Marker 
            key={location.id} 
            position={[location.lat, location.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 mb-1">{location.name}</h3>
                <div className="text-sm text-gray-600">
                  <div>
                    <strong>Quantidade:</strong> {location.quantity.toLocaleString('pt-BR')}
                  </div>
                  <div>
                    <strong>Valor:</strong> R$ {location.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="mt-2 px-2 py-1 bg-blue-100 rounded text-xs">
                    <strong>Visualizando:</strong> {viewType === 'quantidade' ? 'Quantidade' : 'Valor'}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;