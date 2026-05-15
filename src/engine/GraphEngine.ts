import { Step } from './types';

export interface GraphNode {
  id: string;
  value: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
}

const demoGraphNodes: GraphNode[] = [
  { id: 'A', value: 'A', x: 0, y: -80 },
  { id: 'B', value: 'B', x: -80, y: 0 },
  { id: 'C', value: 'C', x: 80, y: 0 },
  { id: 'D', value: 'D', x: -60, y: 80 },
  { id: 'E', value: 'E', x: 60, y: 80 },
];

const demoGraphEdges: GraphEdge[] = [
  { id: 'A-B', from: 'A', to: 'B' },
  { id: 'A-C', from: 'A', to: 'C' },
  { id: 'B-D', from: 'B', to: 'D' },
  { id: 'C-E', from: 'C', to: 'E' },
  { id: 'D-E', from: 'D', to: 'E' },
];

const adjacencyList: Record<string, string[]> = {
  'A': ['B', 'C'],
  'B': ['A', 'D'],
  'C': ['A', 'E'],
  'D': ['B', 'E'],
  'E': ['C', 'D'],
};

export const bfsGenerator = (startNode: string): Step[] => {
  const steps: Step[] = [];
  const visited = new Set<string>();
  const queue: string[] = [startNode];
  const highlightedNodes: string[] = [];
  const highlightedEdges: string[] = [];

  steps.push({
    graphNodes: demoGraphNodes,
    graphEdges: demoGraphEdges.map(e => ({ from: e.from, to: e.to })),
    highlightedNodeIds: [],
    highlightedEdgeIds: [],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `Starting BFS from node ${startNode}. Initialize queue with [${startNode}].`,
  });

  visited.add(startNode);

  while (queue.length > 0) {
    const current = queue.shift()!;
    highlightedNodes.push(current);

    steps.push({
      graphNodes: demoGraphNodes,
      graphEdges: demoGraphEdges.map(e => ({ from: e.from, to: e.to })),
      highlightedNodeIds: [...highlightedNodes],
      highlightedEdgeIds: [...highlightedEdges],
      activeIndices: [],
      comparingIndices: [],
      swappingIndices: [],
      description: `De-queued ${current}. Visiting node ${current}.`,
    });

    const neighbors = adjacencyList[current];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        
        // Find the edge to highlight
        const edge = demoGraphEdges.find(e => 
          (e.from === current && e.to === neighbor) || 
          (e.from === neighbor && e.to === current)
        );
        if (edge) highlightedEdges.push(edge.id);

        steps.push({
          graphNodes: demoGraphNodes,
          graphEdges: demoGraphEdges.map(e => ({ from: e.from, to: e.to })),
          highlightedNodeIds: [...highlightedNodes],
          highlightedEdgeIds: [...highlightedEdges],
          activeIndices: [],
          comparingIndices: [],
          swappingIndices: [],
          description: `Exploring neighbor ${neighbor} from ${current}. Adding ${neighbor} to queue.`,
        });
      }
    }
  }

  steps.push({
    graphNodes: demoGraphNodes,
    graphEdges: demoGraphEdges.map(e => ({ from: e.from, to: e.to })),
    highlightedNodeIds: [...highlightedNodes],
    highlightedEdgeIds: [...highlightedEdges],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `BFS complete. All reachable nodes visited.`,
  });

  return steps;
};

export const dfsGenerator = (startNode: string): Step[] => {
  const steps: Step[] = [];
  const visited = new Set<string>();
  const highlightedNodes: string[] = [];
  const highlightedEdges: string[] = [];

  const traverse = (node: string, parent?: string) => {
    visited.add(node);
    highlightedNodes.push(node);
    
    if (parent) {
      const edge = demoGraphEdges.find(e => 
        (e.from === parent && e.to === node) || 
        (e.from === node && e.to === parent)
      );
      if (edge) highlightedEdges.push(edge.id);
    }

    steps.push({
      graphNodes: demoGraphNodes,
      graphEdges: demoGraphEdges.map(e => ({ from: e.from, to: e.to })),
      highlightedNodeIds: [...highlightedNodes],
      highlightedEdgeIds: [...highlightedEdges],
      activeIndices: [],
      comparingIndices: [],
      swappingIndices: [],
      description: `Visiting node ${node} via DFS.`,
    });

    const neighbors = adjacencyList[node];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        traverse(neighbor, node);
      }
    }
  };

  steps.push({
    graphNodes: demoGraphNodes,
    graphEdges: demoGraphEdges.map(e => ({ from: e.from, to: e.to })),
    highlightedNodeIds: [],
    highlightedEdgeIds: [],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `Starting DFS from node ${startNode}.`,
  });

  traverse(startNode);

  steps.push({
    graphNodes: demoGraphNodes,
    graphEdges: demoGraphEdges.map(e => ({ from: e.from, to: e.to })),
    highlightedNodeIds: [...highlightedNodes],
    highlightedEdgeIds: [...highlightedEdges],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `DFS complete. Backtracked to root.`,
  });

  return steps;
};
