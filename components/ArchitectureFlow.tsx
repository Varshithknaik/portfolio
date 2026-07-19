"use client";

import "@xyflow/react/dist/style.css";
import { Background, Controls, ReactFlow, type Edge, type Node } from "@xyflow/react";

const nodes: Node[] = [
  { id: "shell", position: { x: 260, y: 20 }, data: { label: "App Shell" }, type: "input" },
  { id: "flags", position: { x: 20, y: 140 }, data: { label: "Feature Flags" } },
  { id: "rbac", position: { x: 250, y: 140 }, data: { label: "RBAC Context" } },
  { id: "contracts", position: { x: 480, y: 140 }, data: { label: "API Contracts" } },
  { id: "modules", position: { x: 115, y: 270 }, data: { label: "Feature Modules" } },
  { id: "storybook", position: { x: 405, y: 270 }, data: { label: "Storybook System" } },
  { id: "workflows", position: { x: 260, y: 400 }, data: { label: "Configurable Workflows" }, type: "output" },
];

const edges: Edge[] = [
  { id: "shell-flags", source: "shell", target: "flags", animated: true },
  { id: "shell-rbac", source: "shell", target: "rbac", animated: true },
  { id: "shell-contracts", source: "shell", target: "contracts", animated: true },
  { id: "flags-modules", source: "flags", target: "modules" },
  { id: "rbac-modules", source: "rbac", target: "modules" },
  { id: "contracts-modules", source: "contracts", target: "modules" },
  { id: "contracts-storybook", source: "contracts", target: "storybook" },
  { id: "modules-workflows", source: "modules", target: "workflows", animated: true },
  { id: "storybook-workflows", source: "storybook", target: "workflows" },
];

const nodeColor = {
  background: "var(--color-panel)",
  border: "1px solid var(--color-line-strong)",
  borderRadius: 8,
  color: "var(--color-text)",
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  padding: 12,
};

export function ArchitectureFlow() {
  return (
    <div className="h-[520px] overflow-hidden rounded-ui border border-line bg-[var(--color-bg)]">
      <ReactFlow
        nodes={nodes.map((node) => ({ ...node, style: nodeColor }))}
        edges={edges}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Background color="var(--color-line)" gap={24} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
