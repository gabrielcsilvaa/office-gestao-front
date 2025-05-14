import type { Node, Edge } from "reactflow";

const nodeWidth = 180;
const nodeHeight = 80;

// Paleta neutra para linhas e sócios (cinzas azulados)
const coresNeutras = [
  "#7895B2", // azul acinzentado
  "#8CA6DB",
  "#627E99",
  "#94A3B8",
  "#6B8CA7",
];

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

  // Mapeia quais sócios têm cada empresa para posicionamento e cores
  const empresaToSociosMap: Record<string, string[]> = {};

  // Nó raiz (empresa principal)
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
      fontWeight: "600",
    },
  });

  data.dados.forEach((socio, socioIndex) => {
    const socioId = `socio-${socioIndex}-${socio.CPF}`;
    const corIndex = socioIndex % coresNeutras.length;
    const corDaLinha = coresNeutras[corIndex];

    // Nó do sócio com fundo da cor da linha para diferenciar
    nodes.push({
      id: socioId,
      data: { label: socio.socio },
      position: { x: 0, y: 0 },
      style: {
        width: nodeWidth,
        height: nodeHeight,
        borderRadius: 8,
        border: `1px solid ${corDaLinha}`,
        padding: 10,
        backgroundColor: corDaLinha + "33", // cor com transparência para fundo
        textAlign: "center",
        whiteSpace: "pre-wrap",
        fontWeight: "600",
        color: "#1E293B", // texto azul escuro para contraste
      },
    });

    edges.push({
      id: `edge-${rootId}-${socioId}`,
      source: rootId,
      target: socioId,
      type: "smoothstep",
      animated: true,
      style: {
        stroke: corDaLinha,
        strokeWidth: 3,
      },
    });

    socio.empresas.forEach((empresa) => {
      const empresaId = `empresa-${empresa.codi_emp}`;

      if (!empresaToSociosMap[empresaId]) {
        empresaToSociosMap[empresaId] = [];
      }
      empresaToSociosMap[empresaId].push(socioId);

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
            fontWeight: "600",
          },
        });
      }

      edges.push({
        id: `edge-${socioId}-${empresaId}`,
        source: socioId,
        target: empresaId,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: corDaLinha,
          strokeWidth: 3,
        },
      });
    });
  });

  // Ajuste de posição horizontal para empresas com múltiplos sócios
  const adjustedNodes = nodes.map((node) => {
    if (node.id.startsWith("empresa-") && node.id !== rootId) {
      const sociosDaEmpresa = empresaToSociosMap[node.id];
      if (sociosDaEmpresa && sociosDaEmpresa.length > 1) {
        // Offset lateral para evitar sobreposição das empresas com múltiplos sócios
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
