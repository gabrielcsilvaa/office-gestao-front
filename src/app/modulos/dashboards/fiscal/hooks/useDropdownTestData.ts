import { useMemo } from 'react';

export const useDropdownTestData = () => {
  // Gera uma lista grande de clientes para testar a virtualização
  const generateLargeClientList = useMemo(() => {
    const clients = [];
    const empresas = [
      'Empresa Alpha Ltda',
      'Beta Corporation S.A.',
      'Gamma Industries Inc.',
      'Delta Solutions Ltda',
      'Epsilon Technology S.A.',
      'Zeta Consulting Group',
      'Eta Manufacturing Co.',
      'Theta Services Ltda',
      'Iota Logistics S.A.',
      'Kappa Innovations Inc.'
    ];

    const suffixes = [
      'Comércio e Serviços',
      'Indústria e Comércio',
      'Tecnologia e Inovação',
      'Consultoria Empresarial',
      'Soluções Integradas',
      'Desenvolvimento',
      'Gestão e Administração',
      'Importação e Exportação',
      'Serviços Especializados',
      'Engenharia e Projetos'
    ];

    // Gera 500 clientes para teste
    for (let i = 1; i <= 500; i++) {
      const empresa = empresas[i % empresas.length];
      const suffix = suffixes[i % suffixes.length];
      const numero = String(i).padStart(3, '0');
      
      clients.push(`${empresa} ${numero} - ${suffix}`);
    }

    return clients.sort();
  }, []);

  // Gera uma lista grande de fornecedores para testar a virtualização
  const generateLargeFornecedorList = useMemo(() => {
    const fornecedores = [];
    const tipos = [
      'Materiais de Escritório',
      'Equipamentos de TI',
      'Serviços de Limpeza',
      'Consultoria Jurídica',
      'Material de Construção',
      'Componentes Eletrônicos',
      'Produtos Químicos',
      'Transporte e Logística',
      'Energia e Telecomunicações',
      'Alimentação e Bebidas'
    ];

    const nomes = [
      'Fornecedora Central',
      'Distribuidora Regional',
      'Suprimentos Nacional',
      'Atacadista Premium',
      'Comércio Especializado',
      'Indústria Matriz',
      'Grupo Comercial',
      'Rede de Distribuição',
      'Casa de Suprimentos',
      'Mercado Atacadista'
    ];

    // Gera 300 fornecedores para teste
    for (let i = 1; i <= 300; i++) {
      const nome = nomes[i % nomes.length];
      const tipo = tipos[i % tipos.length];
      const numero = String(i).padStart(3, '0');
      
      fornecedores.push(`${nome} ${numero} - ${tipo}`);
    }

    return fornecedores.sort();
  }, []);

  return {
    largeClientList: generateLargeClientList,
    largeFornecedorList: generateLargeFornecedorList,
    clientCount: generateLargeClientList.length,
    fornecedorCount: generateLargeFornecedorList.length
  };
};
