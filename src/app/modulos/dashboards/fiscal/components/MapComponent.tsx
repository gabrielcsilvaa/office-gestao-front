'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Log inicial para verificar se as bibliotecas foram carregadas
console.log('📚 Bibliotecas carregadas:');
console.log('- React Leaflet:', !!MapContainer && !!TileLayer && !!Marker);
console.log('- Leaflet Core:', !!L && L.version);
console.log('- CSS do Leaflet: Verificar se os estilos foram aplicados');

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

// Componente interno para acessar o mapa e fazer logs
const MapLogger = () => {
  const map = useMap();
  
  useEffect(() => {
    console.log('🗺️ Leaflet Map: Instância do mapa acessada!', map);
    console.log('📐 Zoom atual:', map.getZoom());
    console.log('📍 Centro atual:', map.getCenter());
    console.log('🎯 Bounds:', map.getBounds());
  }, [map]);
  
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ locations, viewType }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log('🗺️ MapComponent: Iniciando montagem do componente');
    console.log('📦 Leaflet versão:', L.version);
    console.log('📍 Localizações recebidas:', locations.length);
    console.log('👁️ Tipo de visualização:', viewType);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      console.log('✅ MapComponent: Componente montado com sucesso!');
      console.log('🔧 React Leaflet: Componentes importados corretamente');
    }
  }, [isMounted]);

  if (!isMounted) {
    console.log('⏳ MapComponent: Aguardando montagem...');
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-500">Carregando mapa...</div>
      </div>
    );
  }

  // Centro do Brasil (aproximadamente)
  const center: [number, number] = [-15.7942, -47.8825];

  console.log('🎯 MapComponent: Renderizando mapa com centro:', center);

  return (
    <div 
      className="w-full h-full relative rounded-lg overflow-hidden bg-gray-100"
      style={{ minHeight: '300px', border: '2px solid #e5e7eb' }}
    >
      <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs z-50">
        Mapa Leaflet - Zoom: 5 | Centro: Brasil
      </div>
      
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: '100%', width: '100%', minHeight: '300px', backgroundColor: '#f0f0f0' }}
        className="z-0 leaflet-container"
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={true}
      >
        <MapLogger />
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
      
      {/* Legenda e indicadores visuais */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-50 text-xs border-2 border-blue-500">
        <div className="font-semibold mb-2 text-gray-800">🗺️ Mapa Interativo</div>
        <div className="text-gray-600 mb-1">
          Visualizando: {viewType === 'quantidade' ? 'Quantidades' : 'Valores'} por região
        </div>
        <div className="text-xs text-blue-600">
          {locations.length} localizações carregadas
        </div>
      </div>
      
      {/* Indicador de status no canto superior direito */}
      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs z-50">
        ✅ Mapa Ativo
      </div>
    </div>
  );
};

export default MapComponent;