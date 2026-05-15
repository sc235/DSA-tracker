import { Step } from "./types";

export interface TreeNode {
  id: string;
  value: number;
  leftId: string | null;
  rightId: string | null;
  x: number;
  y: number;
}

export interface TreeStep extends Omit<Step, "data"> {
  treeNodes: TreeNode[];
  highlightedNodeIds: string[];
  highlightedEdgeIds?: string[];
}

/**
 * Calculates tree layout coordinates dynamically
 */
const calculateLayout = (values: number[]) => {
  // Build a basic BST structure first
  interface TempNode {
    value: number;
    left: TempNode | null;
    right: TempNode | null;
  }

  const insert = (root: TempNode | null, val: number): TempNode => {
    if (!root) return { value: val, left: null, right: null };
    if (val < root.value) root.left = insert(root.left, val);
    else root.right = insert(root.right, val);
    return root;
  };

  let root: TempNode | null = null;
  values.forEach((v) => {
    root = insert(root, v);
  });

  const nodes: TreeNode[] = [];

  const assignCoords = (
    node: TempNode | null,
    x: number,
    y: number,
    offset: number,
  ) => {
    if (!node) return;

    const id = `n${node.value}`;
    const treeNode: TreeNode = {
      id,
      value: node.value,
      leftId: node.left ? `n${node.left.value}` : null,
      rightId: node.right ? `n${node.right.value}` : null,
      x,
      y,
    };
    nodes.push(treeNode);

    assignCoords(node.left, x - offset, y + 70, offset / 1.8);
    assignCoords(node.right, x + offset, y + 70, offset / 1.8);
  };

  assignCoords(root, 0, 20, 100);
  return nodes;
};

export const bstSearchGenerator = (
  values: number[],
  target: number,
): TreeStep[] => {
  const treeNodes = calculateLayout(values);
  const steps: TreeStep[] = [];

  steps.push({
    treeNodes,
    highlightedNodeIds: [],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `Searching for ${target} in the Binary Search Tree...`,
  });

  let currentId: string | null = treeNodes[0]?.id;
  const highlightedEdges: string[] = [];

  while (currentId) {
    const current = treeNodes.find((n) => n.id === currentId);
    if (!current) break;

    steps.push({
      treeNodes,
      highlightedNodeIds: [current.id],
      highlightedEdgeIds: [...highlightedEdges],
      activeIndices: [],
      comparingIndices: [],
      swappingIndices: [],
      description: `Checking node ${current.value}...`,
    });

    if (current.value === target) {
      steps.push({
        treeNodes,
        highlightedNodeIds: [current.id],
        highlightedEdgeIds: [...highlightedEdges],
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: [],
        description: `Found ${target}! Search successful.`,
      });
      return steps;
    }

    if (target < current.value) {
      const nextId = current.leftId;
      if (nextId) highlightedEdges.push(`${current.id}-${nextId}`);
      currentId = nextId;
      steps.push({
        treeNodes,
        highlightedNodeIds: [],
        highlightedEdgeIds: [...highlightedEdges],
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: [],
        description: `${target} < ${current.value}. Moving to the left subtree.`,
      });
    } else {
      const nextId = current.rightId;
      if (nextId) highlightedEdges.push(`${current.id}-${nextId}`);
      currentId = nextId;
      steps.push({
        treeNodes,
        highlightedNodeIds: [],
        highlightedEdgeIds: [...highlightedEdges],
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: [],
        description: `${target} > ${current.value}. Moving to the right subtree.`,
      });
    }
  }

  steps.push({
    treeNodes,
    highlightedNodeIds: [],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `${target} not found in the tree. Search terminated.`,
  });

  return steps;
};

export const bstInsertGenerator = (
  values: number[],
  newValue: number,
): TreeStep[] => {
  const treeNodes = calculateLayout(values);
  const steps: TreeStep[] = [];

  steps.push({
    treeNodes,
    highlightedNodeIds: [],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `Targeting insertion point for ${newValue}...`,
  });

  let currentId: string | null = treeNodes[0]?.id;
  const highlightedEdges: string[] = [];

  while (currentId) {
    const current = treeNodes.find((n) => n.id === currentId);
    if (!current) break;

    steps.push({
      treeNodes,
      highlightedNodeIds: [current.id],
      highlightedEdgeIds: [...highlightedEdges],
      activeIndices: [],
      comparingIndices: [],
      swappingIndices: [],
      description: `Comparing ${newValue} with ${current.value}...`,
    });

    if (newValue < current.value) {
      if (!current.leftId) {
        const newNode: TreeNode = {
          id: `n${newValue}`,
          value: newValue,
          leftId: null,
          rightId: null,
          x: current.x - 40,
          y: current.y + 70,
        };
        highlightedEdges.push(`${current.id}-${newNode.id}`);
        steps.push({
          treeNodes: [...treeNodes, newNode],
          highlightedNodeIds: [newNode.id],
          highlightedEdgeIds: [...highlightedEdges],
          activeIndices: [],
          comparingIndices: [],
          swappingIndices: [],
          description: `Inserted ${newValue} as left child of ${current.value}.`,
        });
        return steps;
      }
      highlightedEdges.push(`${current.id}-${current.leftId}`);
      currentId = current.leftId;
    } else {
      if (!current.rightId) {
        const newNode: TreeNode = {
          id: `n${newValue}`,
          value: newValue,
          leftId: null,
          rightId: null,
          x: current.x + 40,
          y: current.y + 70,
        };
        highlightedEdges.push(`${current.id}-${newNode.id}`);
        steps.push({
          treeNodes: [...treeNodes, newNode],
          highlightedNodeIds: [newNode.id],
          highlightedEdgeIds: [...highlightedEdges],
          activeIndices: [],
          comparingIndices: [],
          swappingIndices: [],
          description: `Inserted ${newValue} as right child of ${current.value}.`,
        });
        return steps;
      }
      highlightedEdges.push(`${current.id}-${current.rightId}`);
      currentId = current.rightId;
    }
  }
  return steps;
};

export const treeTraversalGenerator = (
  type: "pre" | "in" | "post",
): TreeStep[] => {
  const treeNodes = calculateLayout([50, 30, 70, 20, 40, 60, 80]);
  const steps: TreeStep[] = [];
  const visited: string[] = [];
  const highlightedEdges: string[] = [];

  const traverse = (nodeId: string | null, parentId?: string) => {
    if (!nodeId) return;
    const node = treeNodes.find((n) => n.id === nodeId)!;

    if (parentId) highlightedEdges.push(`${parentId}-${nodeId}`);

    if (type === "pre") {
      visited.push(node.id);
      steps.push({
        treeNodes,
        highlightedNodeIds: [...visited],
        highlightedEdgeIds: [...highlightedEdges],
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: [],
        description: `Pre-order: Visit Root (${node.value})`,
      });
    }

    traverse(node.leftId, node.id);

    if (type === "in") {
      visited.push(node.id);
      steps.push({
        treeNodes,
        highlightedNodeIds: [...visited],
        highlightedEdgeIds: [...highlightedEdges],
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: [],
        description: `In-order: Visit Left subtree, then Root (${node.value})`,
      });
    }

    traverse(node.rightId, node.id);

    if (type === "post") {
      visited.push(node.id);
      steps.push({
        treeNodes,
        highlightedNodeIds: [...visited],
        highlightedEdgeIds: [...highlightedEdges],
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: [],
        description: `Post-order: Visit children, then Root (${node.value})`,
      });
    }
  };

  traverse(treeNodes[0].id);
  return steps;
};
