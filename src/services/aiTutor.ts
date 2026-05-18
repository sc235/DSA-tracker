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
  isFinalStep: boolean = false,
): AIExplanation => {
  const { type, payload } = currentStep || {};
  
  let dynamicExplanation = "";
  let proTip = "Try changing the input data to see how the number of steps changes!";

  if (isFinalStep) {
    const finalSummaries: Record<string, { text: string; tip: string; analogy: string }> = {
      "bubble-sort": {
        text: "Success! The data is now fully sorted. Bubble Sort finished by repeatedly 'bubbling' adjacent larger values to the right boundary. Notice how many swaps were necessary even for this short list.",
        tip: "Bubble Sort is excellent for educational visualization, but in production, use O(n log n) algorithms like Quick Sort or TimSort.",
        analogy: "Like sorting a deck of cards by only ever swapping two adjacent cards in your hands until the deck is flawless."
      },
      "selection-sort": {
        text: "Done! Selection Sort successfully scanned the unsorted section in each pass, pinpointing the absolute minimum value and snapping it into its permanent position at the boundary.",
        tip: "Selection Sort performs exactly O(n²) comparisons regardless of initial data order, making its runtime extremely predictable.",
        analogy: "Like scanning a crowded room to pick the absolute shortest person, placing them first in line, and repeating for the remainder."
      },
      "insertion-sort": {
        text: "Flawlessly arranged! Insertion Sort built the sorted sequence one element at a time by sliding each newly encountered item leftward until it settled into its correct relative spot.",
        tip: "Insertion Sort operates in blazing O(n) time for nearly sorted arrays. It is the underlying engine for small sub-arrays inside Python's TimSort and V8's Array.sort.",
        analogy: "Exactly like arranging a hand of playing cards: you pick up one new card at a time and slide it into order among the cards already in your hand."
      },
      "merge-sort": {
        text: "Perfectly organized! The 'Divide and Conquer' paradigm broke the list down into atomic singletons before symmetrically zipping them back together in linear time.",
        tip: "Merge Sort guarantees a rock-solid O(n log n) worst-case time complexity and is completely stable, making it ideal for sorting linked lists or massive datasets on disk.",
        analogy: "Like splitting a giant stack of test papers in half, handing them to two assistants to sort, and then merging the two sorted stacks sheet by sheet."
      },
      "quick-sort": {
        text: "Lightning fast completion! Quick Sort partitioned the array around pivot elements, recursively segregating smaller values to the left and larger values to the right.",
        tip: "Quick Sort exhibits exceptional CPU cache locality because it operates strictly in-place across contiguous memory blocks.",
        analogy: "Like choosing a random person in a line and having everyone shorter step to their left and everyone taller step to their right."
      },
      "heap-sort": {
        text: "Heap Sort successfully transformed the raw array into a structured binary Max-Heap, repeatedly extracting the root maximum and shifting it to the sorted boundary.",
        tip: "Heap Sort provides an optimal in-place O(n log n) guarantee without requiring the auxiliary memory overhead of Merge Sort.",
        analogy: "Like maintaining a priority inbox where the most urgent task automatically floats to the top, ready for extraction."
      },
      "binary-search": {
        text: "Target located successfully! By inspecting the midpoint and systematically discarding exactly half of the remaining search space on each probe, we pinpointed the key in logarithmic time.",
        tip: "Binary search requires strictly monotonic (sorted) data. Always verify array order before initiating midpoint calculations.",
        analogy: "Like opening a 1,000-page dictionary right in the middle, seeing you went too far, and halving the left chunk until you isolate the exact word."
      },
      "stack-push": {
        text: "Stack operation complete! All pushed elements successfully populated the top of the stack following Last-In-First-Out (LIFO) architectural semantics.",
        tip: "Stacks are the foundational memory model for call stack recursion, browser history navigation, and expression syntax parsing.",
        analogy: "Like stacking heavy dinner plates on a kitchen counter: you can only add or remove from the absolute top of the pile."
      },
      "queue-enqueue": {
        text: "Queue processing complete! Elements have been successfully enqueued at the tail and are ready to be serviced from the head in First-In-First-Out (FIFO) sequence.",
        tip: "Queues are essential for asynchronous task scheduling, breadth-first graph searches, and network packet buffering.",
        analogy: "Like standing in line at a movie theater ticket booth: first to arrive is the first to get their ticket and enter."
      },
      "hash-insert": {
        text: "Hashing complete! Keys were subjected to mathematical modulus transformations and mapped directly into indexed memory buckets, resolving potential collisions via dynamic chaining.",
        tip: "A well-distributed hash function guarantees near-instant O(1) average lookup times, forming the backbone of associative maps and caching databases.",
        analogy: "Like checking your coat at a premium hotel: the attendant hands you a numbered ticket that instantly maps to your specific coat hanger."
      },
      "dp-fibonacci": {
        text: "Dynamic Programming optimization complete! By memoizing previously computed Fibonacci sub-problems into a table, an exponential O(2^n) recursion was reduced to a lightning-fast O(n) linear sequence.",
        tip: "Always look for overlapping sub-problems and optimal substructure when designing algorithms for complex computational challenges.",
        analogy: "Like writing down the answers to difficult math problems on a whiteboard so you never have to calculate the same equation twice."
      },
      "trie-insert": {
        text: "Trie insertion complete! Character strings were broken into individual prefix nodes, sharing identical ancestral paths to maximize associative memory efficiency.",
        tip: "Tries (Prefix Trees) provide blazing fast O(L) lookup times (where L is word length), powering auto-complete search engines and IP routing tables.",
        analogy: "Like spelling a word step-by-step down a hallway where each door represents the next correct letter in the alphabet."
      },
      "linked-list-search": {
        text: "Sequential traversal complete! Starting directly from the head node pointer, we hopped along individual memory links until isolating the target value.",
        tip: "Unlike arrays, linked lists do not support random index access, requiring O(n) sequential linear scanning to locate arbitrary elements.",
        analogy: "Like following a treasure map where each clue leads you directly to the location of the next clue until you uncover the chest."
      },
      "linked-list-insert": {
        text: "Insertion successful! Pointers were gracefully reassigned to link the new node into the exact sequence without requiring any contiguous memory shifting.",
        tip: "Linked list insertions are O(1) constant time once the target node is reached, making them vastly superior to array insertions for dynamic data streams.",
        analogy: "Like unhooking two train cars in a stationary train and sliding a brand new passenger car right between them."
      },
      "bst-search": {
        text: "Target node isolated! By utilizing the fundamental Binary Search Tree invariant (Left < Root < Right), we eliminated entire subtrees at each branching decision.",
        tip: "A balanced BST guarantees O(log n) search performance. However, if unconstrained insertions cause the tree to skew, performance degrades to O(n).",
        analogy: "Like playing a guessing game where every question cuts the remaining possibilities in half based on greater or smaller comparisons."
      },
      "bst-insert": {
        text: "Tree insertion complete! The new node successfully navigated down the hierarchy, finding its correct terminal leaf spot while preserving full BST ordering invariants.",
        tip: "Self-balancing variants like AVL and Red-Black trees perform automated rotational adjustments upon insertion to prevent structural degradation.",
        analogy: "Like navigating a branching road where turning left means smaller numbers and turning right means larger numbers until reaching an open driveway."
      },
      "tree-traversal-in": {
        text: "In-order Traversal complete! By strictly visiting Left subtree -> Root node -> Right subtree, the binary search tree nodes were emitted in perfectly sorted ascending order.",
        tip: "In-order traversal is the quintessential algorithmic method for serializing BST structures into sorted linear arrays.",
        analogy: "Like reading a book from left to right across a beautifully formatted organizational hierarchy."
      },
      "tree-traversal-pre": {
        text: "Pre-order Traversal complete! Root nodes were processed immediately prior to diving deep into left and right subtrees (Root -> Left -> Right).",
        tip: "Pre-order traversal is exceptionally useful for creating exact structural clones of trees or generating prefix notation syntax trees.",
        analogy: "Like a team captain announcing their overall strategy before dispatching instructions to individual squad members."
      },
      "tree-traversal-post": {
        text: "Post-order Traversal complete! All child subtrees were fully resolved before executing operations on their parent root nodes (Left -> Right -> Root).",
        tip: "Post-order traversal is the fundamental mechanism used for memory deallocation and garbage collection across hierarchical trees.",
        analogy: "Like taking down a tent: you must remove all the outer stakes and poles before finally folding up the main center canvas."
      },
      "bfs": {
        text: "Breadth-First Search complete! BFS radiated outward across uniform concentric horizons, utilizing a FIFO Queue to guarantee that the first path discovered to any vertex is strictly the shortest unweighted route.",
        tip: "BFS is the standard algorithmic engine for GPS routing systems, peer-to-peer network discovery, and AI game state state-space evaluations.",
        analogy: "Like throwing a pebble into a still pond and watching the ripples expand outward in perfect, expanding rings."
      },
      "dfs": {
        text: "Depth-First Search complete! DFS dived aggressively along individual unvisited branches until hitting dead ends, backtracking gracefully via call stack recursion to explore remaining paths.",
        tip: "DFS is exceptionally memory efficient for deep graph structures and is the core technique for detecting dependency cycles and solving mazes.",
        analogy: "Like exploring a vast labyrinth by keeping one hand on the right wall and following it all the way to a dead end before retracing your steps."
      }
    };

    const summary = finalSummaries[algorithmId] || {
      text: `Visualization for ${algorithmId} has successfully completed! The data structure operations were executed according to correct algorithmic invariants and are now stable.`,
      tip: "Understanding the exact runtime trade-offs of this algorithm allows you to engineer highly scalable software architectures.",
      analogy: "Think of this as the final check-list. The shelf is organized, the target is found, and the structural transformation is flawless!"
    };

    return {
      step: "🎉 Algorithm Successfully Completed!",
      explanation: summary.text,
      analogy: summary.analogy,
      proTip: summary.tip
    };
  }

  // Context-Aware Dynamic Explanation Engine
  if (algorithmId === 'bubble-sort' && payload) {
    const { indices, values, swapped } = payload;
    const [i, j] = indices || [0, 0];
    if (swapped) {
      dynamicExplanation = `Swap detected! Value ${values[j+1]} was smaller than ${values[j]}, so we're moving the larger value towards the end.`;
      proTip = "Swaps are the most expensive part of Bubble Sort. Fewer swaps mean faster execution!";
    } else {
      dynamicExplanation = `Comparing ${values[j]} and ${values[j+1]}. Since they're in order, we just move to the next pair.`;
    }
  } else if (algorithmId === 'binary-search' && payload) {
    const { low, high, mid, target, values } = payload;
    const midVal = values[mid];
    if (midVal === target) {
      dynamicExplanation = `Aha! Target ${target} found at index ${mid}. The search is successful!`;
      proTip = "Binary Search is the gold standard for efficiency in sorted data.";
    } else if (midVal < target) {
      dynamicExplanation = `${midVal} is less than ${target}. We can ignore everything to the left of index ${mid}.`;
      proTip = "Each step in Binary Search cuts the remaining work exactly in half.";
    } else {
      dynamicExplanation = `${midVal} is greater than ${target}. We've eliminated the entire right half of the range.`;
    }
  } else if (algorithmId === 'quick-sort' && payload) {
    const { pivotIndex, currentIndex, values } = payload;
    const pivot = values[pivotIndex];
    dynamicExplanation = `Partitioning around pivot ${pivot}. Values smaller than ${pivot} are being moved to the left side.`;
    proTip = "Quick Sort is often the fastest sorting algorithm in practice because of its cache-friendliness.";
  } else {
    // Fallback to static explanations
    const explanations: Record<string, string[]> = {
        "bubble-sort": ["Analyzing pairs...", "Sorting in progress...", "Completing pass..."],
        "merge-sort": ["Dividing array...", "Merging sorted halves...", "Building final array..."],
        "heap-sort": ["Building the max-heap...", "Extracting the largest element...", "Re-balancing heap..."],
        "bst-search": ["Checking current node...", "Moving to child branch...", "Found the target node!"],
        bfs: ["Queueing neighbors...", "Visiting level...", "Traversal finished."]
    };
    const topicExplanations = explanations[algorithmId] || ["The algorithm is optimizing the data structure hierarchy."];
    dynamicExplanation = topicExplanations[Math.min(stepIndex % topicExplanations.length, topicExplanations.length - 1)];
  }

  const analogies: Record<string, string> = {
    sorting: "Think of this like organizing a shelf of books by height. You keep moving things until the tallest ones are at the end.",
    searching: "It's like looking for a word in a dictionary. You don't read every page; you jump to the middle and narrow it down.",
    trees: "Like navigating a folder structure on your computer. You choose the right subfolder based on what you're looking for.",
    graphs: "Imagine a social network. BFS is like checking your friends, then your friends' friends, layer by layer.",
    heaps: "Think of a priority queue at an airport. The most 'important' person is always at the top of the pile."
  };

  return {
    step: `Step ${stepIndex + 1}: ${type || 'Operation'}`,
    explanation: dynamicExplanation,
    analogy: analogies[topicId],
    proTip
  };
};

// ── AI Code Solver & Assistant Service ──────────────────────────────────
// Used by the Assistant screen to explain and solve student algorithm queries.

const TUTOR_SOLUTIONS: Record<string, string[]> = {
  search: [
    `🎯 **Problem Analysis & Solution: Binary Search**\n\nTo locate an element efficiently in a monotonically sorted dataset, we utilize Binary Search rather than linear scanning.\n\n### 💻 Optimal Implementation (TypeScript):\n\`\`\`typescript\nfunction binarySearch(arr: number[], target: number): number {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n\`\`\`\n\n### ⏱️ Asymptotic Guarantee:\n- **Time Complexity**: \`O(log n)\` because we eliminate half the search space on each probe.\n- **Space Complexity**: \`O(1)\` constant auxiliary memory using iterative pointers.`
  ],
  sort: [
    `🎯 **Problem Analysis & Solution: Efficient Sorting (Quick Sort)**\n\nFor general-purpose in-place sorting, Quick Sort provides superior CPU cache locality compared to Merge Sort.\n\n### 💻 Optimal Implementation (TypeScript):\n\`\`\`typescript\nfunction quickSort(arr: number[]): number[] {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = arr.filter(x => x < pivot);\n  const middle = arr.filter(x => x === pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), ...middle, ...quickSort(right)];\n}\n\`\`\`\n\n### ⏱️ Asymptotic Guarantee:\n- **Time Complexity**: \`O(n log n)\` expected partition depth.\n- **Space Complexity**: \`O(log n)\` call stack depth.`
  ],
  tree: [
    `🎯 **Problem Analysis & Solution: Tree & Graph Traversal**\n\nTo traverse a hierarchical tree or graph level-by-level, we use Breadth-First Search (BFS) with a First-In-First-Out (FIFO) queue.\n\n### 💻 Optimal Implementation (TypeScript):\n\`\`\`typescript\nfunction bfs(root: TreeNode | null): number[] {\n  if (!root) return [];\n  const queue: TreeNode[] = [root];\n  const result: number[] = [];\n  while (queue.length > 0) {\n    const curr = queue.shift()!;\n    result.push(curr.val);\n    if (curr.left) queue.push(curr.left);\n    if (curr.right) queue.push(curr.right);\n  }\n  return result;\n}\n\`\`\`\n\n### ⏱️ Asymptotic Guarantee:\n- **Time Complexity**: \`O(V + E)\` visiting every vertex precisely once.\n- **Space Complexity**: \`O(w)\` where \`w\` is the maximum width horizon of the tree.`
  ],
  hash: [
    `🎯 **Problem Analysis & Solution: Hash Table & Collision Resolution**\n\nTo achieve constant-time associative lookups, we utilize Hash Tables with Chaining or Open Addressing to resolve index collisions.\n\n### 💻 Optimal Implementation (TypeScript):\n\`\`\`typescript\nclass HashTable {\n  private table = new Array(128).fill(null).map(() => [] as [string, any][]);\n  private hash(key: string): number {\n    return key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 128;\n  }\n  set(key: string, value: any) {\n    const bucket = this.table[this.hash(key)];\n    const item = bucket.find(x => x[0] === key);\n    if (item) item[1] = value;\n    else bucket.push([key, value]);\n  }\n}\n\`\`\`\n\n### ⏱️ Asymptotic Guarantee:\n- **Time Complexity**: \`O(1)\` average case lookup.\n- **Space Complexity**: \`O(n)\` total allocated bucket slots.`
  ],
  general: [
    `🧠 **AI Expert DSA Solver & Code Assistant**\n\nI have analyzed your algorithmic query! Here is the optimal engineering approach to solve this challenge:\n\n### 1️⃣ Strategy & Data Structure Choice\nWe can achieve optimal performance by utilizing an associative Hash Map (or Two-Pointer technique) to eliminate redundant nested loops.\n\n### 2️⃣ Algorithm Step-by-Step\n1. Initialize data pointers or a lookup hash table in \`O(1)\` auxiliary space.\n2. Iterate through the sequence precisely once (\`O(n)\` linear pass).\n3. Check for complementary targets or boundary invariants instantly.\n\n### 3️⃣ Asymptotic Guarantee\n- **Time Complexity**: \`O(n)\` linear time (vastly superior to brute-force \`O(n²)\`).\n- **Space Complexity**: \`O(n)\` for lookup table storage or \`O(1)\` for in-place pointers.`
  ]
};

const getResponseCategory = (prompt: string): string => {
  const lower = prompt.toLowerCase();
  if (lower.includes('search') || lower.includes('find') || lower.includes('binary') || lower.includes('target') || lower.includes('look'))
    return 'search';
  if (lower.includes('sort') || lower.includes('order') || lower.includes('array') || lower.includes('quick') || lower.includes('merge'))
    return 'sort';
  if (lower.includes('tree') || lower.includes('graph') || lower.includes('bfs') || lower.includes('dfs') || lower.includes('node'))
    return 'tree';
  if (lower.includes('hash') || lower.includes('map') || lower.includes('dict') || lower.includes('key') || lower.includes('collision'))
    return 'hash';
  return 'general';
};

export const AITutorService = {
  getExplanation: async (prompt: string): Promise<string> => {
    // Simulate network delay for realistic AI feel
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const category = getResponseCategory(prompt);
    const responses = TUTOR_SOLUTIONS[category];
    return responses[Math.floor(Math.random() * responses.length)];
  },
};
