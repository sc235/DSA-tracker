export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  topicId: string;
  questions: Question[];
}

export const QUIZZES: Quiz[] = [
  {
    topicId: "sorting",
    questions: [
      {
        id: "s1",
        question: "What is the average time complexity of Bubble Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: "O(n²)",
        explanation:
          "Bubble Sort has a nested loop structure, leading to O(n²) in the average and worst cases.",
      },
      {
        id: "s2",
        question:
          "Which sorting algorithm is typically faster on large datasets?",
        options: [
          "Bubble Sort",
          "Insertion Sort",
          "Quick Sort",
          "Selection Sort",
        ],
        correctAnswer: "Quick Sort",
        explanation: "Quick Sort has an average complexity of O(n log n).",
      },
      {
        id: "s3",
        question: 'Which sort is considered "stable"?',
        options: ["Merge Sort", "Quick Sort", "Heap Sort", "Selection Sort"],
        correctAnswer: "Merge Sort",
        explanation:
          "Merge Sort preserves the relative order of equal elements.",
      },
      {
        id: "s4",
        question:
          "What is the best-case complexity of Bubble Sort (with optimization)?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: "O(n)",
        explanation:
          "If the array is already sorted, an optimized Bubble Sort can stop after one pass.",
      },
      {
        id: "s5",
        question: "Which sort has the worst-case complexity of O(n log n)?",
        options: ["Bubble Sort", "Merge Sort", "Quick Sort", "Insertion Sort"],
        correctAnswer: "Merge Sort",
        explanation:
          "Merge Sort is guaranteed O(n log n) even in the worst case.",
      },
      {
        id: "s6",
        question: "Selection sort works by:",
        options: [
          "Finding the minimum element",
          "Swapping adjacent elements",
          "Dividing and conquering",
          "Building a heap",
        ],
        correctAnswer: "Finding the minimum element",
        explanation:
          "Selection sort repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
      },
      {
        id: "s7",
        question: "In-place sorting algorithms use how much extra memory?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: "O(1)",
        explanation:
          "In-place algorithms modify the input data without requiring significant extra workspace.",
      },
      {
        id: "s8",
        question: "Which algorithm is usually implemented using recursion?",
        options: [
          "Bubble Sort",
          "Merge Sort",
          "Selection Sort",
          "Insertion Sort",
        ],
        correctAnswer: "Merge Sort",
        explanation:
          "Merge Sort is a classic divide-and-conquer algorithm that naturally uses recursion.",
      },
      {
        id: "s9",
        question: "What is the space complexity of Merge Sort?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: "O(n)",
        explanation:
          "Merge Sort requires O(n) extra space to store the temporary merged arrays.",
      },
      {
        id: "s10",
        question: "Which sort is best for nearly sorted data?",
        options: [
          "Quick Sort",
          "Insertion Sort",
          "Selection Sort",
          "Bubble Sort",
        ],
        correctAnswer: "Insertion Sort",
        explanation:
          "Insertion sort is very efficient (O(n)) for arrays that are already mostly sorted.",
      },
    ],
  },
  {
    topicId: "searching",
    questions: [
      {
        id: "sh1",
        question: "Binary Search requires the array to be:",
        options: ["Unsorted", "Sorted", "Empty", "Large"],
        correctAnswer: "Sorted",
        explanation:
          "Binary Search depends on order to divide the search space.",
      },
      {
        id: "sh2",
        question: "Time complexity of Linear Search is:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: "O(n)",
        explanation:
          "Linear search may need to check every element in the worst case.",
      },
      {
        id: "sh3",
        question: "Time complexity of Binary Search is:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: "O(log n)",
        explanation: "Each step in Binary Search halves the search space.",
      },
      {
        id: "sh4",
        question:
          "In a sorted array of 1024 elements, Binary Search takes at most how many steps?",
        options: ["10", "100", "512", "1024"],
        correctAnswer: "10",
        explanation: "log2(1024) = 10.",
      },
      {
        id: "sh5",
        question: "Which search is better for unsorted data?",
        options: [
          "Binary Search",
          "Linear Search",
          "Jump Search",
          "Exponential Search",
        ],
        correctAnswer: "Linear Search",
        explanation: "Other searches typically require sorted data.",
      },
      {
        id: "sh6",
        question: "Interpolation search is most effective when data is:",
        options: ["Sorted and Uniform", "Unsorted", "Random", "Small"],
        correctAnswer: "Sorted and Uniform",
        explanation:
          "Interpolation search estimates the position based on values, which works best for uniform distributions.",
      },
      {
        id: "sh7",
        question: "What is the best case for Linear Search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: "O(1)",
        explanation:
          "If the target is the first element, it is found in one step.",
      },
      {
        id: "sh8",
        question: "Binary Search is an example of:",
        options: [
          "Greedy strategy",
          "Dynamic programming",
          "Divide and Conquer",
          "Backtracking",
        ],
        correctAnswer: "Divide and Conquer",
        explanation: "It divides the problem into smaller sub-problems.",
      },
      {
        id: "sh9",
        question: "Hashing provides what average search time?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: "O(1)",
        explanation: "Hashing allows direct access to data via a key.",
      },
      {
        id: "sh10",
        question:
          "A search algorithm that looks for a value by jumping blocks is called:",
        options: [
          "Binary Search",
          "Jump Search",
          "Linear Search",
          "Deep Search",
        ],
        correctAnswer: "Jump Search",
        explanation:
          "Jump Search reduces Linear Search steps by skipping blocks of fixed size.",
      },
    ],
  },
  {
    topicId: "linked-lists",
    questions: [
      {
        id: "ll1",
        question:
          "What is the time complexity to insert a node at the head of a Singly Linked List?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: "O(1)",
        explanation:
          "Inserting at the head only requires updating the head pointer.",
      },
      {
        id: "ll2",
        question: "A Doubly Linked List has:",
        options: [
          "Next pointer only",
          "Prev pointer only",
          "Both Next and Prev pointers",
          "No pointers",
        ],
        correctAnswer: "Both Next and Prev pointers",
        explanation: "This allows bi-directional traversal.",
      },
      {
        id: "ll3",
        question: "To find the Nth element in a linked list, we need:",
        options: ["O(1)", "O(n)", "O(log n)", "O(1) if sorted"],
        correctAnswer: "O(n)",
        explanation:
          "Linked lists do not support random access; we must traverse from the head.",
      },
      {
        id: "ll4",
        question:
          "What is the space complexity of a Linked List with N elements?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: "O(n)",
        explanation: "Each element requires a node structure.",
      },
      {
        id: "ll5",
        question: "Which pointer marks the end of a Singly Linked List?",
        options: ["Head", "Tail", "Null", "Void"],
        correctAnswer: "Null",
        explanation: "The last node points to Null to indicate the end.",
      },
      {
        id: "ll6",
        question: "A Circular Linked List:",
        options: [
          "Is infinite",
          "Has no Null pointers",
          "Has two heads",
          "Is always empty",
        ],
        correctAnswer: "Has no Null pointers",
        explanation: "The last node points back to the first node.",
      },
      {
        id: "ll7",
        question:
          "Deleting a node in the middle of a Singly Linked List requires:",
        options: [
          "Updating one pointer",
          "O(1) time",
          "O(n) time to find the node",
          "O(log n) time",
        ],
        correctAnswer: "O(n) time to find the node",
        explanation: "You must first traverse to the node to be deleted.",
      },
      {
        id: "ll8",
        question: "Which is an advantage of Linked Lists over Arrays?",
        options: [
          "Random Access",
          "Memory efficiency",
          "Dynamic size",
          "Cache friendliness",
        ],
        correctAnswer: "Dynamic size",
        explanation:
          "Linked lists can grow and shrink easily without reallocating memory.",
      },
      {
        id: "ll9",
        question: "What happens if you lose the head pointer of a Linked List?",
        options: [
          "The list is reversed",
          "The memory is leaked",
          "The list becomes circular",
          "Nothing",
        ],
        correctAnswer: "The memory is leaked",
        explanation: "You lose access to all nodes in the list.",
      },
      {
        id: "ll10",
        question: 'A "Sentinel" node is used to:',
        options: [
          "Speed up search",
          "Simplify boundary conditions",
          "Store the tail",
          "Encrypt data",
        ],
        correctAnswer: "Simplify boundary conditions",
        explanation:
          "Sentinel nodes (like dummy heads) reduce edge-case checks for empty or single-node lists.",
      },
    ],
  },
  {
    topicId: "trees",
    questions: [
      {
        id: "t1",
        question: "In a Binary Search Tree (BST), the left child of a node is:",
        options: [
          "Greater than root",
          "Smaller than root",
          "Equal to root",
          "Random",
        ],
        correctAnswer: "Smaller than root",
        explanation: "BST property: Left < Parent < Right.",
      },
      {
        id: "t2",
        question: "What is the height of a balanced Binary Tree with N nodes?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctAnswer: "O(log n)",
        explanation: "A balanced tree halves the depth at each level.",
      },
      {
        id: "t3",
        question: "In-order traversal of a BST produces:",
        options: [
          "Random sequence",
          "Sorted sequence",
          "Reverse sorted sequence",
          "Level order",
        ],
        correctAnswer: "Sorted sequence",
        explanation:
          "In-order (Left-Root-Right) visits nodes in ascending order.",
      },
      {
        id: "t4",
        question: "Which traversal is Root -> Left -> Right?",
        options: ["In-order", "Pre-order", "Post-order", "Level-order"],
        correctAnswer: "Pre-order",
        explanation: "Pre-order visits the root before the children.",
      },
      {
        id: "t5",
        question: 'A "Leaf" node is a node with:',
        options: [
          "One child",
          "Two children",
          "No children",
          "Only left child",
        ],
        correctAnswer: "No children",
        explanation: "Leaf nodes are terminal nodes at the bottom of the tree.",
      },
      {
        id: "t6",
        question: "What is a Full Binary Tree?",
        options: [
          "Every node has 0 or 2 children",
          "All levels are filled",
          "Only one leaf",
          "Binary tree with no root",
        ],
        correctAnswer: "Every node has 0 or 2 children",
        explanation: "In a full binary tree, no node has exactly one child.",
      },
      {
        id: "t7",
        question: "The root node is at which level by convention?",
        options: ["Level 0", "Level 1", "Level -1", "Infinite"],
        correctAnswer: "Level 0",
        explanation: "Most conventions start counting tree levels from 0.",
      },
      {
        id: "t8",
        question: "A Complete Binary Tree is:",
        options: [
          "Perfectly balanced",
          "Filled from left to right at the last level",
          "Empty",
          "Only has left children",
        ],
        correctAnswer: "Filled from left to right at the last level",
        explanation:
          "Every level is filled except possibly the last, which is filled from the left.",
      },
      {
        id: "t9",
        question: "Worst case time complexity for searching in a BST is:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: "O(n)",
        explanation:
          "If the tree is skewed (like a linked list), it becomes O(n).",
      },
      {
        id: "t10",
        question: "Which tree structure self-balances its height?",
        options: ["BST", "AVL Tree", "Binary Tree", "Complete Tree"],
        correctAnswer: "AVL Tree",
        explanation:
          "AVL and Red-Black trees automatically keep their height at O(log n).",
      },
    ],
  },
  {
    topicId: "graphs",
    questions: [
      {
        id: "g1",
        question: "BFS uses which data structure?",
        options: ["Stack", "Queue", "Array", "Heap"],
        correctAnswer: "Queue",
        explanation:
          "BFS explores level by level using a First-In-First-Out queue.",
      },
      {
        id: "g2",
        question: "DFS uses which data structure?",
        options: ["Stack", "Queue", "Array", "Tree"],
        correctAnswer: "Stack",
        explanation:
          "DFS goes as deep as possible, utilizing a stack (or recursion).",
      },
      {
        id: "g3",
        question:
          "Which algorithm finds the shortest path in an unweighted graph?",
        options: ["DFS", "BFS", "Pre-order", "Merge Sort"],
        correctAnswer: "BFS",
        explanation:
          "BFS visits nodes in order of their distance from the source.",
      },
      {
        id: "g4",
        question: "A graph with directed edges is called a:",
        options: ["Tree", "Undirected Graph", "Digraph", "Multigraph"],
        correctAnswer: "Digraph",
        explanation: "Digraph is short for Directed Graph.",
      },
      {
        id: "g5",
        question: 'What is an "Adjacency Matrix"?',
        options: [
          "A list of edges",
          "A 2D array showing connectivity",
          "A visual map",
          "A stack of nodes",
        ],
        correctAnswer: "A 2D array showing connectivity",
        explanation: "It uses O(V²) space to represent edges.",
      },
      {
        id: "g6",
        question: 'A "Cycle" in a graph is:',
        options: [
          "A node with no edges",
          "A path that starts and ends at the same node",
          "A broken edge",
          "A graph with no edges",
        ],
        correctAnswer: "A path that starts and ends at the same node",
        explanation:
          "Cycles allow you to loop back to a previously visited node.",
      },
      {
        id: "g7",
        question: "Time complexity of BFS is:",
        options: ["O(V)", "O(E)", "O(V + E)", "O(V²)"],
        correctAnswer: "O(V + E)",
        explanation: "You visit every vertex and every edge.",
      },
      {
        id: "g8",
        question:
          "Which representation is more space-efficient for sparse graphs?",
        options: [
          "Adjacency Matrix",
          "Adjacency List",
          "Edge List",
          "Incidence Matrix",
        ],
        correctAnswer: "Adjacency List",
        explanation:
          "It only stores actual edges, saving space when edges are few.",
      },
      {
        id: "g9",
        question:
          "A graph where every node is connected to every other node is:",
        options: ["Complete Graph", "Empty Graph", "Tree", "Bipartite Graph"],
        correctAnswer: "Complete Graph",
        explanation: "A complete graph Kn has V(V-1)/2 edges.",
      },
      {
        id: "g10",
        question: "Topological Sort is applicable only to:",
        options: [
          "Undirected Graphs",
          "Cyclic Graphs",
          "Directed Acyclic Graphs (DAG)",
          "Empty Graphs",
        ],
        correctAnswer: "Directed Acyclic Graphs (DAG)",
        explanation:
          "It requires directions and no cycles to establish a linear order.",
      },
    ],
  },
];
