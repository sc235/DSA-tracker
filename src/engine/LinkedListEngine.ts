import { Step } from './types';

export interface NodeStep extends Omit<Step, 'data'> {
  nodes: { id: string; value: number; nextId: string | null }[];
  highlightedNodeIds: string[];
  highlightedPointerIds: string[];
}

export const linkedListSearchGenerator = (values: number[], target: number): NodeStep[] => {
  const nodes = values.map((v, i) => ({
    id: `node-${i}`,
    value: v,
    nextId: i < values.length - 1 ? `node-${i + 1}` : null,
  }));

  const steps: NodeStep[] = [];

  steps.push({
    nodes: [...nodes],
    highlightedNodeIds: [],
    highlightedPointerIds: [],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `Searching for ${target} in the linked list...`,
  });

  for (let i = 0; i < nodes.length; i++) {
    const currentNode = nodes[i];

    steps.push({
      nodes: [...nodes],
      highlightedNodeIds: [currentNode.id],
      highlightedPointerIds: [],
      activeIndices: [],
      comparingIndices: [],
      swappingIndices: [],
      description: `Checking node with value ${currentNode.value}...`,
    });

    if (currentNode.value === target) {
      steps.push({
        nodes: [...nodes],
        highlightedNodeIds: [currentNode.id],
        highlightedPointerIds: [],
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: [],
        description: `Found ${target}!`,
      });
      return steps;
    }

    if (currentNode.nextId) {
      steps.push({
        nodes: [...nodes],
        highlightedNodeIds: [currentNode.id],
        highlightedPointerIds: [currentNode.id],
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: [],
        description: `${currentNode.value} !== ${target}. Moving to next node...`,
      });
    }
  }

  steps.push({
    nodes: [...nodes],
    highlightedNodeIds: [],
    highlightedPointerIds: [],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `${target} not found in the linked list.`,
  });

  return steps;
};

export const linkedListInsertGenerator = (values: number[], newValue: number, position: number): NodeStep[] => {
  const nodes = values.map((v, i) => ({
    id: `node-${i}`,
    value: v,
    nextId: i < values.length - 1 ? `node-${i + 1}` : null,
  }));

  const steps: NodeStep[] = [];
  const newNodeId = `node-new-${newValue}`;

  steps.push({
    nodes: [...nodes],
    highlightedNodeIds: [],
    highlightedPointerIds: [],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `Inserting ${newValue} at position ${position}...`,
  });

  if (position === 0) {
    const updatedNodes = [
      { id: newNodeId, value: newValue, nextId: nodes[0]?.id || null },
      ...nodes
    ];
    steps.push({
      nodes: updatedNodes,
      highlightedNodeIds: [newNodeId],
      highlightedPointerIds: [newNodeId],
      activeIndices: [],
      comparingIndices: [],
      swappingIndices: [],
      description: `Inserting at the head. New node points to the old head.`,
    });
    return steps;
  }

  for (let i = 0; i < Math.min(position, nodes.length); i++) {
    steps.push({
      nodes: [...nodes],
      highlightedNodeIds: [nodes[i].id],
      highlightedPointerIds: [],
      activeIndices: [],
      comparingIndices: [],
      swappingIndices: [],
      description: `Traversing... at index ${i}`,
    });
  }

  const prevNode = nodes[position - 1];
  const nextNode = nodes[position] || null;

  const updatedNodes = [
    ...nodes.slice(0, position),
    { id: newNodeId, value: newValue, nextId: nextNode?.id || null },
    ...nodes.slice(position)
  ];

  const finalNodes = updatedNodes.map(n => 
    n.id === prevNode.id ? { ...n, nextId: newNodeId } : n
  );

  steps.push({
    nodes: finalNodes,
    highlightedNodeIds: [newNodeId],
    highlightedPointerIds: [prevNode.id, newNodeId],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `Node ${prevNode.value} now points to ${newValue}, and ${newValue} points to ${nextNode?.value || 'NULL'}.`,
  });

  return steps;
};
