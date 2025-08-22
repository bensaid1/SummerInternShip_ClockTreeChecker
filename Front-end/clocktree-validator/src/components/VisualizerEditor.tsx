import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  ReactFlowProvider,
  MarkerType,
  Position,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "react-flow-renderer";
import dagre from "dagre";
import { Box, Button, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const nodeColors: Record<string, string> = {
  fixedSource: "#1976d2",
  editableValue: "#43a047",
  multiplier: "#fbc02d",
  multiplexor: "#8e24aa",
  discreteValuesSource: "#0288d1",
  divider: "#ffb300",
  transition: "#757575",
  variableSource: "#388e3c",
  distinctFrequencieOscillator: "#00bcd4",
  rectangularShape: "#8d6e63",
  fractionalValue: "#7e57c2",
  custom: "#90caf9",
};

const nodeWidth = 90;
const nodeHeight = 36;

type EditorProps = {
  initialJson: string;
};

const CustomNode = ({ id, data }: any) => (
  <Box
    sx={{
      background: nodeColors[data.type] || "#90caf9",
      color: "#fff",
      borderRadius: 2,
      px: 1,
      py: 0.5,
      minWidth: nodeWidth,
      minHeight: nodeHeight,
      fontWeight: 700,
      fontSize: 12,
      boxShadow: "0 1px 4px rgba(25,118,210,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
    }}
  >
    <span style={{ maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {data.label}
    </span>
    <Button
      size="small"
      color="error"
      sx={{
        minWidth: 0,
        ml: 1,
        p: 0.2,
        borderRadius: 1,
        background: "rgba(255,255,255,0.10)",
        "&:hover": { background: "#ffcdd2" },
      }}
      onClick={() => data.onDelete(id)}
    >
      <DeleteIcon fontSize="small" />
    </Button>
  </Box>
);

const nodeTypes = { custom: CustomNode };

function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "LR" });

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
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  });

  return { nodes: layoutedNodes, edges };
}

const VisualizerEditor: React.FC<EditorProps> = ({ initialJson }) => {
  // Parse JSON to nodes/transitions
  const { baseNodes, baseTransitions } = useMemo(() => {
    let tree;
    try {
      tree = JSON.parse(initialJson).tree;
    } catch {
      return { baseNodes: [], baseTransitions: [] };
    }
    if (!tree?.elements || !tree?.transitions) return { baseNodes: [], baseTransitions: [] };

    const baseNodes: Node[] = tree.elements.map((el: any) => ({
      id: el.id,
      type: "custom",
      data: {
        label: el.label?.text || el.name || el.id,
        type: el.type,
      },
      position: { x: 0, y: 0 },
      style: {},
    }));

    const baseTransitions = tree.transitions;

    return { baseNodes, baseTransitions };
  }, [initialJson]);

  // Etat local pour édition
  const [nodes, setNodes] = useState<Node[]>([]);
  const [transitions, setTransitions] = useState<any[]>([]);

  // Initial layout only ONCE at mount or when JSON changes
  useEffect(() => {
    const { nodes: layoutedNodes } = getLayoutedElements(baseNodes, []);
    setNodes(
      layoutedNodes.map((n) => ({
        ...n,
        data: { ...n.data },
      }))
    );
    setTransitions(baseTransitions);
  }, [baseNodes, baseTransitions]);

  // Reconstruit les arêtes à chaque modif
  const edges: Edge[] = useMemo(() => {
    const nodeIds = new Set(nodes.map((n) => n.id));
    const edges: Edge[] = [];
    for (const tr of transitions) {
      const sources = Array.isArray(tr.sourceTaskId) ? tr.sourceTaskId : [tr.sourceTaskId];
      const targets = Array.isArray(tr.targetTaskId) ? tr.targetTaskId : [tr.targetTaskId];
      for (const source of sources) {
        for (const target of targets) {
          if (nodeIds.has(source) && nodeIds.has(target)) {
            edges.push({
              id: tr.id + "_" + source + "_" + target,
              source: source.replace(/_output$/, ""),
              target: target.replace(/_input$/, ""),
              animated: true,
              style: { stroke: "#1976d2", strokeWidth: 1.5 },
              markerEnd: { type: MarkerType.ArrowClosed },
              label: tr.id,
              labelStyle: { fill: "#1976d2", fontWeight: 600, fontSize: 10 },
            });
          }
        }
      }
    }
    return edges;
  }, [nodes, transitions]);

  // Suppression de nœud
  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setTransitions((trs) =>
        trs.filter(
          (tr) =>
            !(
              (Array.isArray(tr.sourceTaskId) ? tr.sourceTaskId : [tr.sourceTaskId]).includes(id) ||
              (Array.isArray(tr.targetTaskId) ? tr.targetTaskId : [tr.targetTaskId]).includes(id)
            )
        )
      );
    },
    []
  );

  // Ajout d'un nœud
  const handleAddNode = () => {
    const newId = `node_${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id: newId,
        type: "custom",
        data: { label: `Node ${nds.length + 1}`, type: "custom", onDelete: handleDeleteNode },
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
    ]);
  };

  // Ajout d'une arête (création d'une transition locale)
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setTransitions((trs) => [
        ...trs,
        {
          id: `t_${Date.now()}`,
          sourceTaskId: params.source,
          targetTaskId: params.target,
        },
      ]);
    },
    []
  );

  // Suppression d'une arête (clic sur l'arête)
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setTransitions((trs) =>
        trs.filter(
          (tr) => {
            const sources = Array.isArray(tr.sourceTaskId) ? tr.sourceTaskId : [tr.sourceTaskId];
            const targets = Array.isArray(tr.targetTaskId) ? tr.targetTaskId : [tr.targetTaskId];
            return !sources.some((s: string) => edge.source === s) || !targets.some((t: string) => edge.target === t) || edge.label !== tr.id;
          }
        )
      );
    },
    []
  );

  // Drag & drop, resize, etc.
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  // Injecte la fonction de suppression dans chaque nœud
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, onDelete: handleDeleteNode },
      }))
    );
  }, [handleDeleteNode]);

  return (
    <ReactFlowProvider>
      <Box sx={{ height:500, width: "100%", background: "#f5fafd", borderRadius: 3, mb: 2 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background gap={16} color="#e3f2fd" />
        </ReactFlow>
      </Box>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNode}
        >
          Ajouter un nœud
        </Button>
      </Stack>
    </ReactFlowProvider>
  );
};

export default VisualizerEditor;