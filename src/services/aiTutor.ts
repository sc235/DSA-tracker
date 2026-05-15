export interface AIExplanation {
  step: string;
  explanation: string;
  analogy?: string;
  proTip?: string;
}

export const getAIExplanation = (
  topicId: string,
  algorithmId: string,
  currentStep: any,
  stepIndex: number,
): AIExplanation => {
  // Logic to return a context-aware explanation based on the algorithm and current step

  const explanations: Record<string, string[]> = {
    "bubble-sort": [
      "We're starting at the beginning of the array. The goal is to 'bubble up' the largest element to the end.",
      "Comparing adjacent elements. If the left one is bigger, we swap them.",
      "The largest element has reached its final position! We won't need to check it again.",
      "Sorting is complete! The array is now in non-decreasing order.",
    ],
    "binary-search": [
      "We calculate the middle index of the current range.",
      "Comparing the middle element with our target value.",
      "Target is smaller than the middle! We can safely ignore the entire right half.",
      "Target is larger than the middle! We can safely ignore the entire left half.",
      "Found it! The target is exactly at the middle index.",
    ],
    "bst-search": [
      "Starting at the Root node. This is the entry point of the tree.",
      "Comparing the target with the current node's value.",
      "The target is smaller, so we must follow the left branch. In a BST, all smaller values are on the left.",
      "The target is larger, so we move to the right. All larger values are stored in the right subtree.",
      "Match found! We've successfully navigated the hierarchy to find our node.",
    ],
    bfs: [
      "Starting at the source node. We add it to our queue to visit its neighbors soon.",
      "De-queueing the next node. We are now 'visiting' it and checking its immediate friends.",
      "Found an unvisited neighbor! Adding it to the queue so we can explore it level-by-level.",
      "Traversal complete. We've explored every reachable node in the graph.",
    ],
  };

  const defaultExplanation =
    "The algorithm is currently processing the data structure to maintain its specific properties.";
  const topicExplanations = explanations[algorithmId] || [defaultExplanation];

  // Select an explanation based on the step index (simplified for demo)
  const explanation =
    topicExplanations[Math.min(stepIndex, topicExplanations.length - 1)];

  const analogies: Record<string, string> = {
    sorting:
      "Think of this like organizing a shelf of books by height. You keep moving things until the tallest ones are at the end.",
    searching:
      "It's like looking for a word in a dictionary. You don't read every page; you jump to the middle and narrow it down.",
    trees:
      "Like navigating a folder structure on your computer. You choose the right subfolder based on what you're looking for.",
    graphs:
      "Imagine a social network. BFS is like checking your friends, then your friends' friends, layer by layer.",
  };

  return {
    step: `Step Analysis`,
    explanation,
    analogy: analogies[topicId],
    proTip:
      "Try changing the input data to see how the number of steps changes!",
  };
};
