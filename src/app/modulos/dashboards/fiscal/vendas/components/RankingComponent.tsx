/**
 * COMPONENTE: RANKING DE PRODUTOS E CLIENTES
 * 
 * Componente para exibir rankings de produtos ou clientes
 * com visualização detalhada e interativa
 */

"use client";
import React, { useState } from 'react';
import { RankingProduto, RankingCliente } from '../types';

interface RankingComponentProps {
  tipo: 'produtos' | 'clientes';
  dados: RankingProduto[] | RankingCliente[];
  limite?: number;
  loading?: boolean;
  titulo?: string;
}

const RankingComponent: React.FC<RankingComponentProps> = ({
  tipo,
  dados,
  limite = 10,
  loading = false,
  titulo
}) => {
  const [visualizacao, setVisualizacao] = useState<'lista' | 'barras'>('lista');
  const [ordenacao, setOrdenacao] = useState<'valor' | 'quantidade' | 'participacao'>('valor');

  if (loading) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dados || dados.length === 0) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {titulo || `Ranking de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`}
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">
            {tipo === 'produtos' ? '📦' : '👥'}
          </div>
          <div className="text-gray-500">
            Nenhum dado disponível para ranking
          </div>
        </div>
      </div>
    );
  }

  // Função para ordenar os dados
  const dadosOrdenados = [...dados].sort((a, b) => {
    switch (ordenacao) {
      case 'quantidade':
        if (tipo === 'produtos') {
          return (b as RankingProduto).quantidadeVendida - (a as RankingProduto).quantidadeVendida;
        } else {
          return (b as RankingCliente).quantidadeCompras - (a as RankingCliente).quantidadeCompras;
        }
      case 'participacao':
        return b.participacao - a.participacao;
      case 'valor':
      default:
        if (tipo === 'produtos') {
          return (b as RankingProduto).totalVendido - (a as RankingProduto).totalVendido;
        } else {
          return (b as RankingCliente).totalComprado - (a as RankingCliente).totalComprado;
        }
    }
  }).slice(0, limite);

  const valorMaximo = dadosOrdenados.length > 0 
    ? Math.max(...dadosOrdenados.map(item => 
        tipo === 'produtos' 
          ? (item as RankingProduto).totalVendido 
          : (item as RankingCliente).totalComprado
      ))
    : 0;

  const formatarValor = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatarQuantidade = (quantidade: number): string => {
    return quantidade.toLocaleString('pt-BR');
  };

  const obterCorCategoria = (categoria: string): string => {
    if (tipo === 'clientes') {
      const cores: Record<string, string> = {
        'VIP': 'bg-purple-100 text-purple-800',
        'Frequente': 'bg-blue-100 text-blue-800',
        'Ocasional': 'bg-green-100 text-green-800',
        'Novo': 'bg-gray-100 text-gray-800'
      };
      return cores[categoria] || 'bg-gray-100 text-gray-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {titulo || `Top ${limite} ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {/* Controle de visualização */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setVisualizacao('lista')}
                className={`px-3 py-1 text-sm font-medium ${
                  visualizacao === 'lista'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setVisualizacao('barras')}
                className={`px-3 py-1 text-sm font-medium ${
                  visualizacao === 'barras'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Barras
              </button>
            </div>

            {/* Controle de ordenação */}
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="valor">Por Valor</option>
              <option value="quantidade">Por Quantidade</option>
              <option value="participacao">Por Participação</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {visualizacao === 'lista' ? (
          <div className="space-y-3">
            {dadosOrdenados.map((item, index) => {
              const isProduto = tipo === 'produtos';
              const produto = item as RankingProduto;
              const cliente = item as RankingCliente;
              
              return (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  {/* Posição */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-gray-300'}
                  `}>
                    {index + 1}
                  </div>

                  {/* Nome */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">
                      {isProduto ? produto.produto : cliente.cliente}
                    </h4>
                    
                    {isProduto && produto.categoria && (
                      <p className="text-xs text-gray-500 mt-1">
                        {produto.categoria}
                      </p>
                    )}
                    
                    {!isProduto && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${obterCorCategoria(cliente.categoria)}
                        `}>
                          {cliente.categoria}
                        </span>
                        <span className="text-xs text-gray-500">
                          Última compra: {new Date(cliente.ultimaCompra).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Métricas */}
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      {formatarValor(isProduto ? produto.totalVendido : cliente.totalComprado)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatarQuantidade(isProduto ? produto.quantidadeVendida : cliente.quantidadeCompras)} 
                      {isProduto ? ' vendidos' : ' compras'}
                    </div>
                    <div className="text-xs text-blue-600">
                      {item.participacao.toFixed(1)}% do total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {dadosOrdenados.map((item, index) => {
              const isProduto = tipo === 'produtos';
              const produto = item as RankingProduto;
              const cliente = item as RankingCliente;
              const valor = isProduto ? produto.totalVendido : cliente.totalComprado;
              const larguraBarra = valorMaximo > 0 ? (valor / valorMaximo) * 100 : 0;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {isProduto ? produto.produto : cliente.cliente}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatarValor(valor)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-blue-400' : 
                        index === 2 ? 'bg-blue-300' : 'bg-gray-400'
                      }`}
                      style={{ width: `${larguraBarra}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingComponent;
