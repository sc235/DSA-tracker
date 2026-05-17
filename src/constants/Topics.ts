export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  complexity: string;
  algorithms: Algorithm[];
  prerequisites?: string[]; // Topic IDs that must be completed first
  roadmapPosition: { x: number; y: number }; // For the visual map
}

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export const DSA_TOPICS: Topic[] = [
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    description: 'Learn how to organize data efficiently.',
    icon: 'sort-ascending',
    complexity: 'O(n log n)',
    roadmapPosition: { x: 0, y: 0 },
    algorithms: [
      {
        id: 'bubble-sort',
        name: 'Bubble Sort',
        description: 'A simple comparison-based sorting algorithm.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
      },
      {
        id: 'selection-sort',
        name: 'Selection Sort',
        description: 'Repeatedly finds the minimum element and moves it to the beginning.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
      },
      {
        id: 'insertion-sort',
        name: 'Insertion Sort',
        description: 'Builds the final sorted array one item at a time.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
      },
      {
        id: 'merge-sort',
        name: 'Merge Sort',
        description: 'A divide-and-conquer algorithm that merges two sorted halves.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
      },
      {
        id: 'quick-sort',
        name: 'Quick Sort',
        description: 'A divide-and-conquer algorithm that partitions an array into two sub-arrays.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
      },
    ],
  },
  {
    id: 'searching',
    title: 'Searching Algorithms',
    description: 'Find elements in structured data.',
    icon: 'search',
    complexity: 'O(log n)',
    prerequisites: ['sorting'],
    roadmapPosition: { x: 0, y: 150 },
    algorithms: [
      {
        id: 'binary-search',
        name: 'Binary Search',
        description: 'Find an element in a sorted array by repeatedly dividing the search interval in half.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
      },
    ],
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    description: 'Understand linear data structures with pointers.',
    icon: 'link',
    complexity: 'O(n)',
    prerequisites: ['searching'],
    roadmapPosition: { x: -135, y: 300 },
    algorithms: [
      {
        id: 'linked-list-search',
        name: 'Search Operation',
        description: 'Traverse the list to find a specific value.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
      },
      {
        id: 'linked-list-insert',
        name: 'Insertion',
        description: 'Add a new node at a specific position.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
      },
    ],
  },
  {
    id: 'stacks-queues',
    title: 'Stacks & Queues',
    description: 'Master LIFO and FIFO linear structures.',
    icon: 'layers',
    complexity: 'O(1)',
    prerequisites: ['linked-lists'],
    roadmapPosition: { x: 0, y: 300 },
    algorithms: [
      {
        id: 'stack-push',
        name: 'Stack: Push/Pop',
        description: 'Last-In-First-Out (LIFO) operations.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
      },
      {
        id: 'queue-enqueue',
        name: 'Queue: Enqueue/Dequeue',
        description: 'First-In-First-Out (FIFO) operations.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
      },
    ],
  },
  {
    id: 'trees',
    title: 'Trees',
    description: 'Explore hierarchical data structures.',
    icon: 'tree',
    complexity: 'O(log n)',
    prerequisites: ['stacks-queues'],
    roadmapPosition: { x: 135, y: 300 },
    algorithms: [
      {
        id: 'bst-search',
        name: 'BST Search',
        description: 'Efficiently find values in a Binary Search Tree.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(h)',
      },
      {
        id: 'bst-insert',
        name: 'BST Insertion',
        description: 'Insert a new value into its correct position.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(h)',
      },
      {
        id: 'tree-traversal-in',
        name: 'In-order Traversal',
        description: 'Visit nodes in Left -> Root -> Right order.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)',
      },
      {
        id: 'tree-traversal-pre',
        name: 'Pre-order Traversal',
        description: 'Visit nodes in Root -> Left -> Right order.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)',
      },
      {
        id: 'tree-traversal-post',
        name: 'Post-order Traversal',
        description: 'Visit nodes in Left -> Right -> Root order.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)',
      },
    ],
  },
  {
    id: 'hash-tables',
    title: 'Hash Tables',
    description: 'Master O(1) key-value operations.',
    icon: 'key',
    complexity: 'O(1)',
    prerequisites: ['trees'],
    roadmapPosition: { x: 0, y: 450 },
    algorithms: [
      {
        id: 'hash-insert',
        name: 'Hashing & Insertion',
        description: 'Map keys to indices using hash functions.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(n)',
      },
    ],
  },
  {
    id: 'heaps',
    title: 'Heaps',
    description: 'Efficient priority-based structures.',
    icon: 'mountain',
    complexity: 'O(log n)',
    prerequisites: ['hash-tables'],
    roadmapPosition: { x: -135, y: 450 },
    algorithms: [
      {
        id: 'max-heap',
        name: 'Max-Heap (Build & Sort)',
        description: 'Build a Max-Heap where parent >= children and extract root priority element.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
      },
      {
        id: 'min-heap',
        name: 'Min-Heap (Priority Extraction)',
        description: 'Build a Min-Heap where parent <= children and extract minimum priority element.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
      },
    ],
  },
  {
    id: 'arrays',
    title: 'Arrays & Two-Pointers',
    description: 'Contiguous memory structures and pointer manipulation.',
    icon: 'grid',
    complexity: 'O(1)',
    prerequisites: ['hash-tables'],
    roadmapPosition: { x: 135, y: 450 },
    algorithms: [
      {
        id: 'array-reverse',
        name: 'Array Reversal (Two-Pointer)',
        description: 'In-place array reversal using two pointers from both ends.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
      },
    ],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    description: 'Master network traversals and relations.',
    icon: 'network',
    complexity: 'O(V + E)',
    prerequisites: ['hash-tables'],
    roadmapPosition: { x: 0, y: 550 },
    algorithms: [
      {
        id: 'bfs',
        name: 'Breadth-First Search',
        description: 'Explore neighbors level by level.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
      },
      {
        id: 'dfs',
        name: 'Depth-First Search',
        description: 'Go deep before exploring neighbors.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
      },
    ],
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    description: 'Solve complex problems via sub-problems.',
    icon: 'brain',
    complexity: 'O(n²)',
    prerequisites: ['graphs'],
    roadmapPosition: { x: 0, y: 650 },
    algorithms: [
      {
        id: 'dp-fibonacci',
        name: 'Fibonacci (DP)',
        description: 'Optimize recursion with memoization.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
      },
    ],
  },
];
