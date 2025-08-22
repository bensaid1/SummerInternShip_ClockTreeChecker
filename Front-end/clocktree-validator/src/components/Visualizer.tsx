import React from "react";
import Graph from "react-graph-vis";

type VisualizerProps = {
  jsonContent: string;
};

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

const Visualizer: React.FC<VisualizerProps> = ({ jsonContent }) => {
  let tree;
  try {
    tree = JSON.parse(jsonContent).tree;
  } catch {
    return <div>Invalid JSON</div>;
  }
  if (!tree?.elements || !tree?.transitions) return <div>No data</div>;

  const nodes = tree.elements.map((el: any) => ({
    id: el.id,
    label: `${el.label?.text || el.name || el.id}\n(${el.id})`,
    color: nodeColors[el.type] || "#90caf9",
    shape: "box",
    font: { color: "#fff", size: 16, face: "Poppins" },
    borderWidth: 2,
    margin: 10,
  }));

const edges = tree.transitions.flatMap((tr: any) => {
    const targets = Array.isArray(tr.targetTaskId) ? tr.targetTaskId : [tr.targetTaskId];
    return targets.map((target: string, idx: number) => ({
      id: `${tr.id}_${tr.sourceTaskId}_${target}_${idx}`,
      from: tr.sourceTaskId.replace(/_output$/, ""),
      to: target.replace(/_input$/, ""),
      arrows: "to",
      color: { color: tr.isVirtual ? "#ff7043" : "#1976d2" },
      label: tr.id,
      font: { align: "middle", color: "#1976d2", size: 12 },
      smooth: { type: "cubicBezier" },
    }));
  });

  const graph = { nodes, edges };

  const options = {
    layout: {
      hierarchical: {
        enabled: true,
        direction: "LR", // "UD" (top-down), "LR" (left-right)
        sortMethod: "directed",
        nodeSpacing: 200,
        levelSeparation: 150,
        treeSpacing: 200,
      }
    },
    edges: { color: "#1976d2", smooth: true },
    nodes: { shape: "box" },
    height: "500px",
    physics: { enabled: false },
    interaction: { dragNodes: true, zoomView: true },
  };

  return (
    <div style={{ width: "100%", height: 500, background: "#f5fafd", borderRadius: 12 }}>
      <Graph graph={graph} options={options} />
    </div>
  );
};

export default Visualizer;