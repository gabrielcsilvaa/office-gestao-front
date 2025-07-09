/**
 * 🧪 PÁGINA DE TESTE - Sistema de Análise Geoestratégica
 * 
 * Esta página fornece um ambiente completo para testar todas as funcionalidades
 * do sistema de análise geoestratégica implementado.
 * 
 * Acesse: /modulos/dashboards/fiscal/test
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Cairo } from "next/font/google";
import KpiSelectorTest from '../components/KpiSelectorTest';

const cairo = Cairo({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Dados de teste simulados
const DADOS_TESTE = {
  // Dados de saídas (vendas)
  saidas: [
    {
      cliente: 1,
      nome_cliente: "EMPRESA TESTE SP",
      empresa: 100,
      nome_empresa: "MINHA EMPRESA MATRIZ",
      cnpj: "11222333000144",
      UF: "SP", // UF explícita - Prioridade 1
      data: "2024-01-15",
      valor: "15000.00",
      cancelada: "N"
    },
    {
      cliente: 2,
      nome_cliente: "CLIENTE RJ",
      empresa: 100,
      nome_empresa: "MINHA EMPRESA MATRIZ",
      cnpj: "11222333000144",
      UF: "RJ", // UF explícita - Prioridade 1
      data: "2024-01-16",
      valor: "8500.50",
      cancelada: "N"
    },
    {
      cliente: 3,
      nome_cliente: "CLIENTE CANCELADO",
      empresa: 100,
      nome_empresa: "MINHA EMPRESA MATRIZ",
      cnpj: "11222333000144",
      UF: "MG", // UF explícita - Prioridade 1
      data: "2024-01-17",
      valor: "3200.00",
      cancelada: "S" // CANCELADA - só aparece no KPI "Notas Canceladas"
    }
  ],
  
  // Dados de serviços
  servicos: [
    {
      cliente: 10,
      nome_cliente: "CLIENTE SERVIÇO CE",
      empresa: 200,
      nome_empresa: "PRESTADORA DE SERVIÇOS LTDA",
      cnpj: "55666777000188",
      UF: "CE", // UF explícita - Prioridade 1
      data: "2024-01-20",
      valor: "2500.00",
      cancelada: "N"
    },
    {
      cliente: 11,
      nome_cliente: "SERVIÇO CANCELADO",
      empresa: 200,
      nome_empresa: "PRESTADORA DE SERVIÇOS LTDA",
      cnpj: "55666777000188",
      UF: "BA", // UF explícita - Prioridade 1
      data: "2024-01-21",
      valor: "1800.00",
      cancelada: "S" // CANCELADA - só aparece no KPI "Notas Canceladas"
    }
  ],
  
  // Dados de entradas (sem UF, mas com CNPJ para teste de enriquecimento)
  entradas: [
    {
      fornecedor: 50,
      nome_fornecedor: "FORNECEDOR PRINCIPAL",
      empresa: 300,
      nome_empresa: "COMPRADORA LTDA",
      cnpj: "04168887000182", // CNPJ real do Ceará - será enriquecido para UF=CE
      CEP: null,
      data: "2024-01-25",
      valor: "5500.00"
    },
    {
      fornecedor: 51,
      nome_fornecedor: "FORNECEDOR SECUNDÁRIO",
      empresa: 300,
      nome_empresa: "COMPRADORA LTDA",
      cnpj: "11008634000530", // CNPJ que será enriquecido via API
      CEP: null,
      data: "2024-01-26",
      valor: "3200.00"
    }
  ]
};

const TestPage: React.FC = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  // Simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoaded(true);
      addTestResult("✅ Dados de teste carregados com sucesso");
      addTestResult(`📊 ${DADOS_TESTE.saidas.length} saídas, ${DADOS_TESTE.servicos.length} serviços, ${DADOS_TESTE.entradas.length} entradas`);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${cairo.className}`}>
            🧪 Laboratório de Teste - Análise Geoestratégica
          </h1>
          <p className={`text-gray-600 ${cairo.className}`}>
            Ambiente completo para testar todas as funcionalidades do sistema de análise geoestratégica interativa.
          </p>
        </div>

        {/* Status dos Dados */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${cairo.className}`}>
            📊 Status dos Dados de Teste
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className={`text-sm text-blue-600 ${cairo.className}`}>Saídas (Vendas)</div>
              <div className={`text-2xl font-bold text-blue-800 ${cairo.className}`}>
                {DADOS_TESTE.saidas.length}
              </div>
              <div className={`text-xs text-blue-600 ${cairo.className}`}>
                2 normais + 1 cancelada
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className={`text-sm text-green-600 ${cairo.className}`}>Serviços</div>
              <div className={`text-2xl font-bold text-green-800 ${cairo.className}`}>
                {DADOS_TESTE.servicos.length}
              </div>
              <div className={`text-xs text-green-600 ${cairo.className}`}>
                1 normal + 1 cancelado
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className={`text-sm text-yellow-600 ${cairo.className}`}>Entradas (Compras)</div>
              <div className={`text-2xl font-bold text-yellow-800 ${cairo.className}`}>
                {DADOS_TESTE.entradas.length}
              </div>
              <div className={`text-xs text-yellow-600 ${cairo.className}`}>
                Sem UF - teste enriquecimento
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className={`text-sm text-gray-600 ${cairo.className}`}>Status</div>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${isDataLoaded ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <span className={`text-sm font-semibold ${cairo.className} ${isDataLoaded ? 'text-green-700' : 'text-yellow-700'}`}>
                  {isDataLoaded ? 'Pronto' : 'Carregando...'}
                </span>
              </div>
            </div>
          </div>

          {/* Log de Teste */}
          <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg max-h-40 overflow-y-auto">
            <div className="text-gray-400 mb-2">🔍 Log de Teste:</div>
            {testResults.map((result, index) => (
              <div key={index} className="mb-1">{result}</div>
            ))}
            {!isDataLoaded && (
              <div className="animate-pulse">⏳ Carregando dados de teste...</div>
            )}
          </div>
        </div>

        {/* Fluxos de Teste Sugeridos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${cairo.className}`}>
            🚀 Fluxos de Teste Sugeridos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold text-gray-800 ${cairo.className}`}>
                📋 Testes Básicos
              </h3>
              <ul className={`space-y-2 text-sm ${cairo.className}`}>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">1.</span>
                  <span><strong>Teste de Carregamento:</strong> Verifique se o mapa carrega com dados padrão</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">2.</span>
                  <span><strong>Troca de KPI:</strong> Clique em diferentes KPIs e veja cores mudando</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">3.</span>
                  <span><strong>Switch Quantidade/Valor:</strong> Alterne e veja raios mudando</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">4.</span>
                  <span><strong>Popups:</strong> Clique nos marcadores e veja informações</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold text-gray-800 ${cairo.className}`}>
                🔬 Testes Avançados
              </h3>
              <ul className={`space-y-2 text-sm ${cairo.className}`}>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 font-bold">A.</span>
                  <span><strong>Enriquecimento CNPJ:</strong> KPI "Compras" deve processar CNPJs para UF</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 font-bold">B.</span>
                  <span><strong>Filtro Canceladas:</strong> KPI "Notas Canceladas" deve mostrar apenas canceladas</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 font-bold">C.</span>
                  <span><strong>Logs Console:</strong> Abra DevTools e veja logs detalhados</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 font-bold">D.</span>
                  <span><strong>Performance:</strong> Observe tempo de processamento</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Componente Principal de Teste */}
        {isDataLoaded ? (
          <KpiSelectorTest data={DADOS_TESTE} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className={`text-gray-600 ${cairo.className}`}>Preparando ambiente de teste...</p>
          </div>
        )}

        {/* Guia de Interpretação */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${cairo.className}`}>
            📖 Como Interpretar os Resultados
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-semibold text-gray-800 mb-3 ${cairo.className}`}>
                🔵 Cores dos KPIs
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#0D6EFD'}}></div>
                  <span><strong>Receita Bruta Total:</strong> Azul - Saídas + Serviços</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#0B5ED7'}}></div>
                  <span><strong>Vendas de Produtos:</strong> Azul Escuro - Apenas Saídas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#198754'}}></div>
                  <span><strong>Serviços Prestados:</strong> Verde - Apenas Serviços</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#FFC107'}}></div>
                  <span><strong>Compras e Aquisições:</strong> Amarelo - Entradas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#DC3545'}}></div>
                  <span><strong>Notas Canceladas:</strong> Vermelho - Canceladas</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold text-gray-800 mb-3 ${cairo.className}`}>
                📊 Estados Esperados
              </h3>
              <div className="space-y-1 text-sm">
                <p><strong>SP:</strong> R$ 15.000 (Vendas)</p>
                <p><strong>RJ:</strong> R$ 8.500 (Vendas)</p>
                <p><strong>CE:</strong> R$ 2.500 (Serviços) + Compras via CNPJ</p>
                <p><strong>MG:</strong> R$ 3.200 (só em Canceladas)</p>
                <p><strong>BA:</strong> R$ 1.800 (só em Canceladas)</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TestPage;
