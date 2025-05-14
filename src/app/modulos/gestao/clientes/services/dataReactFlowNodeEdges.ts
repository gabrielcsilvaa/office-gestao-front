import type { Node, Edge } from "reactflow";

const nodeWidth = 180;
const nodeHeight = 80;

export interface SocioEmpresa {
  codi_emp: number;
  nome_emp: string;
  cnpj: string;
}

export interface DadoSocio {
  socio: string;
  CPF: string;
  empresas: SocioEmpresa[];
}

export interface SocioEmpresaCompleta {
  codi_emp: number;
  nome_emp: string;
  cnpj: string;
  socios: string[];
  dados: DadoSocio[];
}

export function convertDataToReactFlowNodesEdges(data: SocioEmpresaCompleta): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Guarda quais empresas já foram criadas e os sócios que têm
  const empresaToSociosMap: Record<string, string[]> = {};

  // Nó raiz
  const rootId = `empresa-${data.codi_emp}`;
  nodes.push({
    id: rootId,
    data: { label: data.nome_emp },
    position: { x: 0, y: 0 },
    style: {
      width: nodeWidth,
      height: nodeHeight,
      borderRadius: 8,
      border: "1px solid #333",
      padding: 10,
      backgroundColor: "#eee",
      textAlign: "center",
      whiteSpace: "pre-wrap",
    },
  });

  data.dados.forEach((socio, socioIndex) => {
    const socioId = `socio-${socioIndex}-${socio.CPF}`;

    nodes.push({
      id: socioId,
      data: { label: socio.socio },
      position: { x: 0, y: 0 },
      style: {
        width: nodeWidth,
        height: nodeHeight,
        borderRadius: 8,
        border: "1px solid #555",
        padding: 10,
        backgroundColor: "#cce5ff",
        textAlign: "center",
        whiteSpace: "pre-wrap",
      },
    });

    edges.push({
      id: `edge-${rootId}-${socioId}`,
      source: rootId,
      target: socioId,
      type: "smoothstep",
    });

    socio.empresas.forEach((empresa) => {
      const empresaId = `empresa-${empresa.codi_emp}`;

      // Inicializa array de sócios da empresa
      if (!empresaToSociosMap[empresaId]) {
        empresaToSociosMap[empresaId] = [];
      }
      empresaToSociosMap[empresaId].push(socioId);

      // Só cria o node da empresa se ainda não existir
      if (!nodes.find((n) => n.id === empresaId)) {
        nodes.push({
          id: empresaId,
          data: { label: empresa.nome_emp },
          position: { x: 0, y: 0 },
          style: {
            width: nodeWidth,
            height: nodeHeight,
            borderRadius: 8,
            border: "1px solid #999",
            padding: 10,
            backgroundColor: "#d4edda",
            textAlign: "center",
            whiteSpace: "pre-wrap",
          },
        });
      }

      edges.push({
        id: `edge-${socioId}-${empresaId}`,
        source: socioId,
        target: empresaId,
        type: "smoothstep",
      });
    });
  });

  // Após criar todos nodes e edges, podemos ajustar posição horizontal das empresas que têm múltiplos pais
  // Por exemplo, deslocar as empresas no eixo X proporcionalmente ao índice do sócio na lista de sócios daquela empresa

  const adjustedNodes = nodes.map((node) => {
    if (node.id.startsWith("empresa-") && node.id !== rootId) {
      const sociosDaEmpresa = empresaToSociosMap[node.id];
      if (sociosDaEmpresa && sociosDaEmpresa.length > 1) {
        // Para múltiplos sócios, vamos deslocar no eixo X para cada sócio diferente
        // Mas o node só existe uma vez, então vamos posicionar entre o primeiro e último sócio (média)
        // Como não temos a posição dos sócios ainda, só aplicamos um deslocamento fixo lateral (exemplo)
        // Para simplificar, vamos deslocar por índice arbitrário baseado no hash do id para espalhar nodes duplicados

        // Gerar offset pseudo-aleatório baseado no id para espalhar nodes:
        const hash = node.id
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);

        const offsetX = ((hash % 5) - 2) * 40; // desloca entre -80 e +80 px

        return {
          ...node,
          position: {
            x: node.position.x + offsetX,
            y: node.position.y,
          },
        };
      }
    }
    return node;
  });

  return { nodes: adjustedNodes, edges };
}
