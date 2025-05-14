import React, { useEffect, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MarkerType,
} from "reactflow";
import * as dagre from "dagre";
import "reactflow/dist/style.css";

import {
  SocioEmpresaCompleta,
  convertDataToReactFlowNodesEdges,
} from "../services/dataReactFlowNodeEdges";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 80;

// Paleta neutra para as edges destacadas
const coresNeutras = [
  "#7895B2",
  "#8CA6DB",
  "#627E99",
  "#94A3B8",
  "#6B8CA7",
];

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 150,
    ranksep: 150,
    marginx: 20,
    marginy: 20,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node, i) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    let yPos = nodeWithPosition.y - nodeHeight / 2;

    // Eleva/rebaixa alternadamente os nós das empresas para evitar cruzamento
    if (node.id.startsWith("empresa-")) {
      const offset = i % 2 === 0 ? -25 : 25;
      yPos += offset;
    }

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: yPos,
      },
      draggable: false,
    };
  });

  return { nodes: layoutedNodes, edges };
};

interface OrganogramaProps {
  data: SocioEmpresaCompleta;
}

export default function Organograma({ data }: OrganogramaProps) {
  // Converte os dados para nodes e edges
  const { nodes: initialNodes, edges: initialEdges } = convertDataToReactFlowNodesEdges(
    data
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clique no node para alternar destaque
  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
  };

  // Aplica estilo dinâmico nas edges baseado no node selecionado
  const styledEdges = edges.map((edge, index) => {
    const isConnected =
      edge.source === selectedNodeId || edge.target === selectedNodeId;

    return {
      ...edge,
      animated: isConnected,
      style: {
        stroke: isConnected
          ? coresNeutras[index % coresNeutras.length]
          : "#bbb",
        strokeWidth: isConnected ? 4 : 1.5,
        opacity: isConnected ? 1 : 0.3,
        filter: isConnected
          ? `drop-shadow(0 0 6px ${
              coresNeutras[index % coresNeutras.length]
            })`
          : "none",
      },
      markerEnd: {
        type: MarkerType.Arrow,
        color: isConnected
          ? coresNeutras[index % coresNeutras.length]
          : "#bbb",
      },
      zIndex: isConnected ? 1000 : 0,
    };
  });

  return (
    <div className="border w-full h-[75vh]">
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
