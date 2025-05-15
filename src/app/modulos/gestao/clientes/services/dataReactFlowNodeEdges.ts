import { formatarCpfCnpj } from "@/utils/formatadores";
import type { Node, Edge } from "reactflow";

const nodeWidth = 180;
const nodeHeight = 80;

// Cores fixas por nível
const corEmpresaPrincipal = "#1C1C1C";
const corSocio = "#3b82f6";
const corEmpresaVinculada = "#10b981";

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

  const empresaToSociosMap: Record<string, string[]> = {};

  // Empresa principal
  const rootId = `empresa-${data.codi_emp}`;
  nodes.push({
    id: rootId,
    data: { label: `${data.nome_emp}\nCNPJ: ${formatarCpfCnpj(data.cnpj)}\n` },
    position: { x: 0, y: 0 },
    style: {
      width: nodeWidth,
      height: nodeHeight,
      borderRadius: 8,
      border: `2px solid ${corEmpresaPrincipal}`,
      padding: 10,
      backgroundColor: `${corEmpresaPrincipal}22`,
      textAlign: "center",
      whiteSpace: "pre-wrap",
      fontWeight: "600",
      color: "#1E293B",
    },
  });

  data.dados.forEach((socio, socioIndex) => {
    const socioId = `socio-${socioIndex}-${socio.CPF}`;

    // Sócio
    nodes.push({
      id: socioId,
      data: { label: `${socio.socio}\nCPF: ${formatarCpfCnpj(socio.CPF)}` },
      position: { x: 0, y: 0 },
      style: {
        width: nodeWidth,
        height: nodeHeight,
        borderRadius: 8,
        border: `2px solid ${corSocio}`,
        padding: 10,
        backgroundColor: `${corSocio}22`,
        textAlign: "center",
        whiteSpace: "pre-wrap",
        fontWeight: "600",
        color: "#1E293B",
      },
    });

    // Aresta empresa principal → sócio
    edges.push({
      id: `edge-${rootId}-${socioId}`,
      source: rootId,
      target: socioId,
      type: "smoothstep",
      animated: false,
      style: {
        stroke: corSocio,
        strokeWidth: 2.5,
      },
    });

    socio.empresas.forEach((empresa) => {
      const empresaId = `empresa-${empresa.codi_emp}`;

      if (!empresaToSociosMap[empresaId]) {
        empresaToSociosMap[empresaId] = [];
      }
      empresaToSociosMap[empresaId].push(socioId);

      // Empresa vinculada (se ainda não criada)
      if (!nodes.find((n) => n.id === empresaId)) {
        nodes.push({
          id: empresaId,
          data: {
            label: `${empresa.nome_emp}\nCNPJ: ${formatarCpfCnpj(empresa.cnpj)}`,
          },
          position: { x: 0, y: 0 },
          style: {
            width: nodeWidth,
            height: nodeHeight,
            borderRadius: 8,
            border: `2px solid ${corEmpresaVinculada}`,
            padding: 10,
            backgroundColor: `${corEmpresaVinculada}22`,
            textAlign: "center",
            whiteSpace: "pre-wrap",
            fontWeight: "600",
            color: "#1E293B",
          },
        });
      }

      // Aresta sócio → empresa vinculada
      edges.push({
        id: `edge-${socioId}-${empresaId}`,
        source: socioId,
        target: empresaId,
        type: "smoothstep",
        animated: false,
        style: {
          stroke: corEmpresaVinculada,
          strokeWidth: 2.5,
        },
      });
    });
  });

  // Ajuste lateral para empresas com múltiplos sócios
  const adjustedNodes = nodes.map((node) => {
    if (node.id.startsWith("empresa-") && node.id !== rootId) {
      const sociosDaEmpresa = empresaToSociosMap[node.id];
      if (sociosDaEmpresa && sociosDaEmpresa.length > 1) {
        const hash = node.id
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const offsetX = ((hash % 5) - 2) * 40;

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
