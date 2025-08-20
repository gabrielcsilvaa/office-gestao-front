#!/usr/bin/env bash
# Script para iniciar o Dashboard de Vendas

echo "🚀 Iniciando Dashboard de Vendas - Office Gestão"
echo "================================================="
echo ""

# Navegar para o diretório do projeto
cd "c:\Users\ADM\OneDrive\Documentos\GitHub\office-gestao-front"

echo "📦 Verificando dependências..."
npm install

echo ""
echo "🔧 Iniciando servidor de desenvolvimento..."
echo "Dashboard de Vendas disponível em: http://localhost:3000/modulos/dashboards/fiscal/vendas"
echo ""
echo "✨ Funcionalidades disponíveis:"
echo "   • 10 KPIs especializados de vendas"
echo "   • Visualização geográfica interativa"
echo "   • Rankings de produtos e clientes"
echo "   • Análises avançadas de concentração"
echo "   • Filtros dinâmicos por período"
echo ""

npm run dev
