import React, { useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from "reactflow";
import * as dagre from "dagre";
import "reactflow/dist/style.css";

interface SocioEmpresa {
  codi_emp: number;
  nome_emp: string;
  cnpj: string;
}

interface DadoSocio {
  socio: string;
  CPF: string;
  empresas: SocioEmpresa[];
}

interface SocioEmpresaCompleta {
  codi_emp: number;
  nome_emp: string;
  cnpj: string;
  socios: string[];
  dados: DadoSocio[];
}

interface MeuComponenteProps {
  data: SocioEmpresaCompleta;
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 80;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function Organograma(data: MeuComponenteProps) {
  const initialNodes: Node[] = [
    {
      id: "1",
      data: { label: "CEO\nJoão" },
      position: { x: 0, y: 0 },
      style: { width: nodeWidth, height: nodeHeight },
    },
    {
      id: "2",
      data: { label: "CTO\nMaria" },
      position: { x: 0, y: 0 },
      style: { width: nodeWidth, height: nodeHeight },
    },
  ];

  const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

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
