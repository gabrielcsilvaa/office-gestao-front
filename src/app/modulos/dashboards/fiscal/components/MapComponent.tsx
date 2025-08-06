'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getKpiConfig, calculateMarkerRadius } from '@/utils/mapDataProcessor';

// Fix para os ícones do Leaflet em Next.js - necessário para funcionar corretamente
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
  uf: string;
  nome: string;
  lat: number;
  lng: number;
  value: number;
  quantity: number;
}

interface MapComponentProps {
  locations: LocationData[];
  viewType?: 'quantidade' | 'valor'; // Agora é opcional - padrão será 'valor'
  kpiSelecionado?: string;
  isLoading?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  locations, 
  viewType = 'valor', // Padrão é 'valor' para focar nos valores dos KPIs
  kpiSelecionado = "Receita Bruta Total",
  isLoading = false 
}) => {
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

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-gray-500 mb-2">🌎 Processando dados geográficos...</div>
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  // Centro do Brasil (aproximadamente)
  const center: [number, number] = [-15.7942, -47.8825];

  // Calcular tamanhos dos marcadores baseado nos dados reais
  const getMarkerSize = () => {
    if (locations.length === 0) return { min: 5, max: 30 };
    
    const values = locations.map(loc => viewType === 'valor' ? loc.value : loc.quantity);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    // Se todos os valores são iguais, usar tamanho padrão
    if (maxValue === minValue) {
      return { min: 15, max: 15, range: 0 };
    }
    
    return { min: 8, max: 35, range: maxValue - minValue };
  };

  const { min: markerMinRadius, max: markerMaxRadius, range } = getMarkerSize();

  const calculateRadius = (location: LocationData): number => {
    if (locations.length === 0) return 15;
    
    const values = locations.map(loc => viewType === 'valor' ? loc.value : loc.quantity);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    const currentValue = viewType === 'valor' ? location.value : location.quantity;
    
    // 📊 Usar a função utilitária para cálculo proporcional
    return calculateMarkerRadius(currentValue, minValue, maxValue, 8, 35);
  };

  const getMarkerColor = (location: LocationData): string => {
    // 🎨 Usar cores dinâmicas baseadas no KPI ativo
    const config = getKpiConfig(kpiSelecionado);
    return config?.color || "#6b7280"; // Cinza padrão se KPI não reconhecido
  };

  const formatValue = (value: number): string => {
    if (viewType === 'valor') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } else {
      return value.toLocaleString('pt-BR') + ' transações';
    }
  };
  const estadosBrasileiros = [
    { nome: "Acre", capital: "Rio Branco", lat: -9.9749, lon: -67.8243, area_km2: 164123.040 },
    { nome: "Alagoas", capital: "Maceió", lat: -9.6659, lon: -35.7352, area_km2: 27778.506 },
    { nome: "Amapá", capital: "Macapá", lat: 0.0389, lon: -51.0664, area_km2: 142814.585 },
    { nome: "Amazonas", capital: "Manaus", lat: -3.1190, lon: -60.0217, area_km2: 1559159.148 },
    { nome: "Bahia", capital: "Salvador", lat: -12.9714, lon: -38.5014, area_km2: 564733.177 },
    { nome: "Ceará", capital: "Fortaleza", lat: -3.7172, lon: -38.5433, area_km2: 148920.472 },
    { nome: "Distrito Federal", capital: "Brasília", lat: -15.7797, lon: -47.9297, area_km2: 5779.999 },
    { nome: "Espírito Santo", capital: "Vitória", lat: -20.3194, lon: -40.3378, area_km2: 46095.583 },
    { nome: "Goiás", capital: "Goiânia", lat: -16.6869, lon: -49.2648, area_km2: 340111.783 },
    { nome: "Maranhão", capital: "São Luís", lat: -2.5307, lon: -44.3068, area_km2: 331937.450 },
    { nome: "Mato Grosso", capital: "Cuiabá", lat: -15.6014, lon: -56.0977, area_km2: 903357.908 },
    { nome: "Mato Grosso do Sul", capital: "Campo Grande", lat: -20.4486, lon: -54.6295, area_km2: 357145.532 },
    { nome: "Minas Gerais", capital: "Belo Horizonte", lat: -19.9167, lon: -43.9345, area_km2: 586522.122 },
    { nome: "Pará", capital: "Belém", lat: -1.4558, lon: -48.5044, area_km2: 1247954.666 },
    { nome: "Paraíba", capital: "João Pessoa", lat: -7.1195, lon: -34.8631, area_km2: 56469.778 },
    { nome: "Paraná", capital: "Curitiba", lat: -25.4284, lon: -49.2733, area_km2: 199307.922 },
    { nome: "Pernambuco", capital: "Recife", lat: -8.0578, lon: -34.8829, area_km2: 98148.323 },
    { nome: "Piauí", capital: "Teresina", lat: -5.0949, lon: -42.8041, area_km2: 251577.738 },
    { nome: "Rio de Janeiro", capital: "Rio de Janeiro", lat: -22.9068, lon: -43.1729, area_km2: 43780.172 },
    { nome: "Rio Grande do Norte", capital: "Natal", lat: -5.7945, lon: -35.2094, area_km2: 52811.047 },
    { nome: "Rio Grande do Sul", capital: "Porto Alegre", lat: -30.0346, lon: -51.2177, area_km2: 281730.223 },
    { nome: "Rondônia", capital: "Porto Velho", lat: -8.7619, lon: -63.9039, area_km2: 237590.547 },
    { nome: "Roraima", capital: "Boa Vista", lat: 2.8235, lon: -60.6753, area_km2: 224300.506 },
    { nome: "Santa Catarina", capital: "Florianópolis", lat: -27.5954, lon: -48.5480, area_km2: 95736.165 },
    { nome: "São Paulo", capital: "São Paulo", lat: -23.5505, lon: -46.6333, area_km2: 248222.853 },
    { nome: "Sergipe", capital: "Aracaju", lat: -10.9472, lon: -37.0731, area_km2: 21915.116 },
    { nome: "Tocantins", capital: "Palmas", lat: -10.2128, lon: -48.3603, area_km2: 277720.520 }
  ];
  const areas = estadosBrasileiros.map(e => e.area_km2);
  const minArea = Math.min(...areas);
  const maxArea = Math.max(...areas);
  const minRadius = 5;
  const maxRadius = 40;
  const calcularRaio = (area: number) =>
    minRadius + ((area - minArea) / (maxArea - minArea)) * (maxRadius - minRadius);

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
        {/* Renderizar marcadores baseados nos dados reais processados */}
        {locations.map(location => (
          <CircleMarker
            key={location.uf}
            center={[location.lat, location.lng]}
            radius={calculateRadius(location)}
            pathOptions={{
              fillColor: getMarkerColor(location),
              color: getMarkerColor(location),
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.6
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold text-lg mb-2">{location.nome} ({location.uf})</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transações:</span>
                    <span className="font-medium">{location.quantity.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor Total:</span>
                    <span className="font-medium">{formatValue(location.value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">KPI:</span>
                    <span className="font-medium text-xs">{kpiSelecionado}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        
        {/* Mostrar mensagem se não houver dados */}
        {locations.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="text-gray-600">
              📍 Nenhum dado geográfico disponível
              <br />
              <span className="text-sm">Selecione um período para visualizar os dados no mapa</span>
            </div>
          </div>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;