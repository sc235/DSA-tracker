import { Question } from '../constants/Quizzes';

const SORTING_SCENARIOS = [
  { q: 'What is the average time complexity of Bubble Sort?', a: 'O(n²)', exp: 'Bubble Sort compares adjacent elements and swaps them, resulting in quadratic time for random distributions.' },
  { q: 'What is the best-case time complexity of Insertion Sort?', a: 'O(n)', exp: 'When the array is already sorted, Insertion Sort only makes one comparison per element.' },
  { q: 'What is the worst-case time complexity of Quick Sort?', a: 'O(n²)', exp: 'This occurs when the pivot chosen is consistently the smallest or largest element.' },
  { q: 'Which sorting algorithm has a guaranteed O(n log n) worst-case time complexity and is stable?', a: 'Merge Sort', exp: 'Merge Sort consistently divides the array in half and merges sorted sub-arrays.' },
  { q: 'What is the space complexity of Merge Sort?', a: 'O(n)', exp: 'Merge Sort requires auxiliary storage proportional to the number of elements during the merge phase.' },
  { q: 'Which sorting algorithm repeatedly selects the minimum element from the unsorted portion?', a: 'Selection Sort', exp: 'Selection Sort maintains sorted and unsorted boundaries by picking the absolute minimum.' },
  { q: 'Is Selection Sort considered a stable sorting algorithm?', a: 'No', exp: 'Selection Sort can change the relative order of identical elements when swapping across distances.' },
  { q: 'What is the space complexity of an in-place Quick Sort implementation?', a: 'O(log n)', exp: 'The auxiliary space is required strictly for the recursion call stack.' },
  { q: 'Which sorting algorithm is often used as the underlying subroutine in TimSort for small runs?', a: 'Insertion Sort', exp: 'Insertion Sort is exceptionally fast and cache-friendly for tiny or nearly sorted arrays.' },
  { q: 'What is the average time complexity of Heap Sort?', a: 'O(n log n)', exp: 'Heap Sort builds a binary heap and repeatedly extracts the root element.' },
  { q: 'In Heap Sort, what data structure is utilized to maintain the elements?', a: 'Binary Heap', exp: 'A max-heap or min-heap structure allows O(log n) insertions and extractions.' },
  { q: 'Which sorting algorithm is non-comparison-based and sorts integers by individual digits?', a: 'Radix Sort', exp: 'Radix Sort processes digits from least significant to most significant (or vice versa).' }
];

const SEARCHING_SCENARIOS = [
  { q: 'Does Linear Search require the data collection to be sorted prior to execution?', a: 'No', exp: 'Linear Search sequentially inspects elements one by one, making no assumptions about data order.' },
  { q: 'What is the average time complexity of Binary Search on a sorted array of N elements?', a: 'O(log n)', exp: 'Binary Search repeatedly halves the search interval, yielding logarithmic time.' },
  { q: 'What is the best-case time complexity of Binary Search?', a: 'O(1)', exp: 'If the target element is situated precisely at the midpoint on the initial comparison.' },
  { q: 'What is the worst-case time complexity of Linear Search?', a: 'O(n)', exp: 'If the target element is at the very end of the collection or not present at all.' },
  { q: 'Binary Search is fundamentally classified as what algorithmic paradigm?', a: 'Divide and Conquer', exp: 'It decomposes the search space into smaller sub-problems until the element is isolated.' },
  { q: 'When searching through a small, unsorted array, which algorithm is generally preferred?', a: 'Linear Search', exp: 'The overhead of sorting the array for Binary Search outweighs the cost of sequential scanning.' },
  { q: 'What is the optimal jump block size for Jump Search on an array of N elements?', a: '√n', exp: 'Jumping by √n balances the block skipping steps and the final linear scan.' },
  { q: 'What is the average time complexity of Jump Search?', a: 'O(√n)', exp: 'It skips ahead in fixed intervals and performs a linear search within the matching block.' },
  { q: 'What is the auxiliary space complexity of an iterative Binary Search algorithm?', a: 'O(1)', exp: 'Iterative binary search only maintains three pointers (low, high, mid) without recursion.' },
  { q: 'What is the space complexity of a recursive Binary Search algorithm?', a: 'O(log n)', exp: 'The recursive call stack consumes stack space equal to the tree depth.' },
  { q: 'Which searching algorithm estimates target position based on key value distribution?', a: 'Interpolation Search', exp: 'It probes the array dynamically based on the value sought, similar to opening a dictionary.' },
  { q: 'Interpolation Search achieves O(log log n) time complexity under what specific condition?', a: 'Uniformly distributed data', exp: 'When values are evenly spaced, interpolation calculations pinpoint targets almost instantly.' },
  { q: 'Exponential Search operates by first discovering a bounding range, followed by:', a: 'Binary Search', exp: 'It doubles the upper bound index until target is bracketed, then binary searches that slice.' },
  { q: 'In a hash table utilizing perfect hashing, what is the expected search time complexity?', a: 'O(1)', exp: 'Direct addressing via hash keys allows constant-time data lookup.' },
  { q: 'Ternary Search divides the search space into how many distinct sub-intervals?', a: '3 parts', exp: 'It utilizes two midpoints (mid1 and mid2) to narrow down the target location.' }
];

const LINKED_LIST_SCENARIOS = [
  { q: 'What is the time complexity of inserting a new node directly at the head of a Singly Linked List?', a: 'O(1)', exp: 'You strictly update the new node\'s next pointer and reassign the head reference.' },
  { q: 'What is the worst-case time complexity of searching for a value in a Singly Linked List?', a: 'O(n)', exp: 'Without direct indexing, traversal must proceed sequentially from the head node.' },
  { q: 'In a Doubly Linked List node structure, how many memory pointers are maintained?', a: '2 pointers', exp: 'Each node maintains explicit references to both its predecessor (prev) and successor (next).' },
  { q: 'Which specific operation is notably more efficient in a Linked List compared to a dynamic Array?', a: 'Insertion at Start', exp: 'Arrays require shifting all subsequent elements in memory, whereas linked lists do not.' },
  { q: 'In a Circular Singly Linked List, the next pointer of the tail node refers directly to:', a: 'Head Node', exp: 'This forms an uninterrupted continuous ring structure.' },
  { q: 'What algorithmic technique is most famous for detecting a cycle in a Linked List?', a: 'Floyd\'s Tortoise and Hare', exp: 'Utilizing a slow pointer (1 step) and a fast pointer (2 steps) that will eventually meet.' },
  { q: 'What is the auxiliary space complexity of reversing a Singly Linked List iteratively?', a: 'O(1)', exp: 'Reversal only requires reassigning three temporary pointers (prev, curr, next).' },
  { q: 'Why do Linked Lists exhibit poorer CPU cache locality than contiguous Arrays?', a: 'Scattered memory allocation', exp: 'Nodes are allocated dynamically across heap memory, preventing sequential cache prefetching.' },
  { q: 'To delete a node from a Singly Linked List (given only head and target key), what is required?', a: 'Pointer to previous node', exp: 'The predecessor\'s next reference must be updated to bypass the deleted node.' },
  { q: 'A Sentinel Node in a linked list implementation is primarily utilized to:', a: 'Eliminate null boundary checks', exp: 'Dummy head or tail nodes simplify edge-case logic during insertions and removals.' }
];

const TREE_SCENARIOS = [
  { q: 'What is the maximum height of a perfectly balanced Binary Search Tree containing N nodes?', a: 'O(log n)', exp: 'Each tree level doubles the capacity, constraining height to the base-2 logarithm of N.' },
  { q: 'In a valid Binary Search Tree, all keys located in the left subtree of a given node must be:', a: 'Smaller than the node key', exp: 'This fundamental invariant allows binary search elimination during tree navigation.' },
  { q: 'Which depth-first traversal guaranteed to visit BST nodes in strictly ascending numerical order?', a: 'In-order Traversal', exp: 'Visiting Left -> Root -> Right naturally yields sorted sequence.' },
  { q: 'In tree terminology, a leaf node is formally defined as a node that possesses:', a: 'No child nodes', exp: 'Leaf nodes reside at the deepest boundary tips of the tree hierarchy.' },
  { q: 'What data structure is explicitly required to perform a Level-Order (Breadth-First) tree traversal?', a: 'Queue (FIFO)', exp: 'A queue maintains nodes level-by-level to ensure horizontal layer processing.' },
  { q: 'In an AVL Tree, the height difference between left and right subtrees (balance factor) cannot exceed:', a: '1', exp: 'AVL trees enforce strict balancing via single and double rotations upon insertions.' },
  { q: 'Red-Black Trees guarantee that the longest path from root to leaf is no more than how many times the shortest path?', a: '2 times', exp: 'Red-Black color rules ensure approximate balancing with less rotational overhead than AVL trees.' },
  { q: 'What is the time complexity of searching for an element in a degenerate (skewed) Binary Tree?', a: 'O(n)', exp: 'A skewed tree behaves exactly like a singly linked list.' },
  { q: 'Which tree traversal processes the root node first, followed by left and right subtrees?', a: 'Pre-order Traversal', exp: 'Root -> Left -> Right is commonly used to create tree copies or serialize structures.' },
  { q: 'In a Trie (Prefix Tree), edge transitions between parent and child nodes typically represent:', a: 'Individual characters', exp: 'Tries store associative strings by sharing common prefix paths.' }
];

const GRAPH_SCENARIOS = [
  { q: 'Which graph traversal algorithm is specifically optimal for discovering shortest unweighted paths?', a: 'Breadth-First Search (BFS)', exp: 'BFS radiates outward in uniform concentric layers, ensuring first contact is optimal.' },
  { q: 'A graph structure that contains zero closed loops or cycles is formally designated as:', a: 'Acyclic Graph', exp: 'Directed Acyclic Graphs (DAGs) are vital for dependency scheduling and topological sorts.' },
  { q: 'What is the overall time complexity of Depth-First Search (DFS) represented via an Adjacency List?', a: 'O(V + E)', exp: 'Each vertex (V) and edge (E) is examined exactly once during full connectivity analysis.' },
  { q: 'In an unweighted Adjacency Matrix representing N vertices, what does a value of 1 at matrix[i][j] signify?', a: 'Explicit directed edge from i to j', exp: 'Matrix indexing provides instant O(1) adjacency verification.' },
  { q: 'Dijkstra\'s shortest path algorithm fails or produces incorrect results in graphs containing:', a: 'Negative weight edges', exp: 'Dijkstra assumes path distances are strictly monotonic and never decrease.' },
  { q: 'Which algorithm successfully computes single-source shortest paths even in graphs with negative edge weights?', a: 'Bellman-Ford Algorithm', exp: 'Bellman-Ford iteratively relaxes all edges V-1 times and detects negative weight cycles.' },
  { q: 'What data structure is utilized within Prim\'s or Dijkstra\'s algorithm to efficiently select minimal edges?', a: 'Min-Priority Queue (Heap)', exp: 'A min-heap extracts the smallest unvisited frontier distance in O(log V) time.' },
  { q: 'Kruskal\'s Minimum Spanning Tree algorithm relies on what core auxiliary data structure to prevent cycles?', a: 'Disjoint-Set (Union-Find)', exp: 'Union-Find tracks connected components and merges sets efficiently.' },
  { q: 'A Topological Sort ordering is strictly valid and possible only on what specific classification of graph?', a: 'Directed Acyclic Graph (DAG)', exp: 'Any cyclical dependency makes linear pre-requisite ordering impossible.' },
  { q: 'What is the space complexity of storing a dense graph with V vertices using an Adjacency Matrix?', a: 'O(V²)', exp: 'A matrix allocates a complete V×V grid in memory regardless of edge sparsity.' }
];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const shuffleAndLimit = (options: string[], correctAnswer: string, limit: number = 4): string[] => {
  let result = options.filter(o => o !== correctAnswer);
  result = result.sort(() => Math.random() - 0.5).slice(0, limit - 1);
  result.push(correctAnswer);
  return result.sort(() => Math.random() - 0.5);
};

export const AIQuizService = {
  generateQuestion: (topicId: string): Question => {
    let scenario;
    let poolOptions = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)', 'Divide and Conquer', 'Sequential', 'Yes', 'No'];

    switch (topicId) {
      case 'sorting':
        scenario = getRandomElement(SORTING_SCENARIOS);
        poolOptions = ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)', 'Merge Sort', 'Quick Sort', 'Selection Sort', 'Radix Sort', 'Binary Heap', 'Yes', 'No'];
        break;
      case 'searching':
        scenario = getRandomElement(SEARCHING_SCENARIOS);
        poolOptions = ['O(1)', 'O(log n)', 'O(n)', 'O(√n)', 'Divide and Conquer', 'Sequential', 'Linear Search', 'Binary Search', 'Uniformly distributed data', '3 parts', 'Yes', 'No'];
        break;
      case 'linked-lists':
        scenario = getRandomElement(LINKED_LIST_SCENARIOS);
        poolOptions = ['O(1)', 'O(n)', '2 pointers', 'Insertion at Start', 'Head Node', 'Tail Node', 'Scattered memory allocation', 'Pointer to previous node', 'Floyd\'s Tortoise and Hare'];
        break;
      case 'trees':
        scenario = getRandomElement(TREE_SCENARIOS);
        poolOptions = ['O(log n)', 'O(n)', 'Smaller than the node key', 'In-order Traversal', 'Pre-order Traversal', 'No child nodes', 'Queue (FIFO)', '1', '2 times', 'Individual characters'];
        break;
      case 'graphs':
        scenario = getRandomElement(GRAPH_SCENARIOS);
        poolOptions = ['Breadth-First Search (BFS)', 'Acyclic Graph', 'O(V + E)', 'Explicit directed edge from i to j', 'Negative weight edges', 'Bellman-Ford Algorithm', 'Min-Priority Queue (Heap)', 'Disjoint-Set (Union-Find)', 'Directed Acyclic Graph (DAG)', 'O(V²)'];
        break;
      default:
        scenario = {
          q: `Adaptive assessment query for ${topicId}: Identify the primary operational constraint.`,
          a: 'Deterministic Execution',
          exp: 'Algorithmic stability ensures predictable transformations across state boundaries.'
        };
        poolOptions = ['Deterministic Execution', 'Heuristic Approximation', 'Asymptotic Upper Bound', 'Stochastic Sampling'];
        break;
    }

    return {
      id: '',
      question: scenario.q,
      options: shuffleAndLimit(poolOptions, scenario.a),
      correctAnswer: scenario.a,
      explanation: scenario.exp
    };
  },

  generateQuiz: (topicId: string, count: number = 10): Question[] => {
    const questions: Question[] = [];
    const seen = new Set<string>();

    let attempts = 0;
    while (questions.length < count && attempts < count * 25) {
      attempts++;
      const q = AIQuizService.generateQuestion(topicId);
      if (!seen.has(q.question)) {
        seen.add(q.question);
        questions.push({
          ...q,
          id: `ai-${topicId}-${Date.now()}-${questions.length}`
        });
      }
    }

    while (questions.length < count) {
      const fallback = AIQuizService.generateQuestion(topicId);
      questions.push({
        ...fallback,
        question: `${fallback.question} (Permutation #${questions.length + 1})`,
        id: `ai-${topicId}-${Date.now()}-${questions.length}`
      });
    }

    return questions;
  }
};
