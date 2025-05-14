import React, { useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from 'reactflow';
import * as dagre from 'dagre';
import 'reactflow/dist/style.css';

import {
  SocioEmpresaCompleta,
  convertDataToReactFlowNodesEdges,
} from '../services/dataReactFlowNodeEdges'; // ajuste o caminho conforme seu projeto

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 80;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = 'TB'
) => {
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 150,  // espaçamento horizontal maior
    ranksep: 150,  // espaçamento vertical maior
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
    if (node.id.startsWith('empresa-')) {
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
  const { nodes: initialNodes, edges: initialEdges } = convertDataToReactFlowNodesEdges(data);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border w-full h-[75vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
