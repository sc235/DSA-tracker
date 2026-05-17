export interface Step {
  data?: number[];
  nodes?: any[]; // For Linked Lists
  treeNodes?: { id: string; value: number; leftId: string | null; rightId: string | null; x: number; y: number }[];
  graphNodes?: { id: string; value: string; x: number; y: number }[];
  graphEdges?: { from: string; to: string }[];
  highlightedNodeIds?: string[];
  highlightedEdgeIds?: string[];
  highlightedPointerIds?: string[];
  activeIndices?: number[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  description: string;
  type?: string;
  buckets?: (number | null)[];
  key?: number;
  hashValue?: number;
  activeIndex?: number;
  stackPointer?: number;
  queueHead?: number;
  queueTail?: number;
}

export type AlgorithmGenerator = (data: number[]) => Step[];
