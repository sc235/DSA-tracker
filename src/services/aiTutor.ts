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

// ── AI Study Companion & Concept Tutor ──────────────────────────────────
// Used by the Tutor screen to explain difficult DSA concepts with simple analogies.

const CONCEPT_EXPLANATIONS: Record<string, string[]> = {
  arrays: [
    `🎯 **Understanding Arrays & Two-Pointers**\n\nThink of an Array like a row of numbered mailboxes. You can instantly jump to mailbox #5 in \`O(1)\` time because each box is right next to the other in contiguous memory.\n\n**The Two-Pointer Technique**: Imagine searching for two numbers that sum to 10 in a sorted row. Instead of checking every possible combination (which takes \`O(n²)\`), you put one finger on the first mailbox (Left) and one on the last (Right). If the sum is too small, you move Left rightward; if too big, you move Right leftward. You find the answer in just one quick pass (\`O(n)\`)!`
  ],
  hashTables: [
    `🎯 **Understanding Hash Tables & Collisions**\n\nThink of a Hash Table like a premium coat check at a luxury hotel. When you hand the attendant your coat (the Value), they perform a quick calculation on your name (the Key) and assign your coat to a specific numbered hanger (the Index).\n\nWhen you return, they don't search through 500 coats; they instantly jump to your exact hanger (\`O(1)\` speed!). If two people happen to map to the same hanger number, the attendant simply hangs the second coat right behind the first (this is called 'Chaining' to resolve a collision).`
  ],
  linkedLists: [
    `🎯 **Understanding Linked Lists**\n\nUnlike an Array (where all mailboxes are glued together in a single row), a Linked List is like a scavenger hunt! Each clue (a Node) contains two things: a secret message (Data) and the GPS address of the next clue (Next Pointer).\n\nBecause the clues are scattered everywhere, you cannot jump straight to clue #10. You must start at the first clue (Head) and follow the pointers one by one (\`O(n)\`). However, adding a brand new clue in the middle is incredibly fast (\`O(1)\`)—you just erase one GPS address and rewrite it without moving any physical boxes!`
  ],
  stacksQueues: [
    `🎯 **Understanding Stacks & Queues**\n\nThese two fundamental data structures are all about ordering rules:\n\n🥞 **Stack (LIFO - Last-In, First-Out)**: Exactly like stacking heavy dinner plates on a kitchen counter. You can only add a new plate to the top, and when you need a plate, you must take off the top one first. (Used in browser back buttons and recursion call stacks).\n\n🎟️ **Queue (FIFO - First-In, First-Out)**: Exactly like standing in line at a movie theater ticket booth. The first person to arrive in line is the first one to get their ticket and enter. (Used in task scheduling and network packet buffers).`
  ],
  recursion: [
    `🎯 **Understanding Recursion**\n\nThink of Recursion like standing in a long line and wanting to know what position you are in. Instead of counting everyone yourself, you tap the person in front of you and ask: "What position are you in?"\n\nThey tap the person in front of them, all the way until the very first person in line says "I am #1!" (This is the Base Case!). Then that number gets passed back down the line, adding 1 each time until you know your exact spot.`
  ],
  searching: [
    `🎯 **Understanding Binary Search**\n\nWhen you search for a word in a 1,000-page dictionary, you don't read page 1, then page 2, all the way to page 500. You flip open the middle! If the word you want comes earlier alphabetically, you ignore the entire right half of the book.\n\nBinary Search does exactly this in computer memory. By continually cutting the remaining search space in half, it finds any item in logarithmic time (\`O(log n)\`). It turns 1,000,000 checks into just 20 checks!`
  ],
  sorting: [
    `🎯 **Understanding Quick Sort & Merge Sort**\n\nSorting is like organizing a chaotic library of books by author name.\n\n- **Merge Sort** uses 'Divide & Conquer': You split the giant pile of books in half, hand them to two assistants to sort, and then zip the two organized piles together.\n- **Quick Sort** chooses one random book (the 'pivot'). Every book earlier in the alphabet is placed to its left, and every book later is placed to its right. Repeating this partitions the library at lightning speed!`
  ],
  trees: [
    `🎯 **Understanding Trees & Binary Search Trees (BST)**\n\nImagine a family tree or a corporate hierarchy. You have one CEO (Root Node) at the top, who manages Vice Presidents (Child Nodes), who manage Team Leads.\n\nIn a **Binary Search Tree (BST)**, there is a strict organizational rule: all numbers smaller than the manager go to their Left branch, and all numbers greater go to their Right branch. When searching for a number, every single step down the tree cuts your remaining choices in half (\`O(log n)\`)!`
  ],
  graphs: [
    `🎯 **Understanding Graphs & BFS/DFS**\n\nThink of a Graph exactly like a social network (Instagram/LinkedIn) or a GPS map of cities connected by highways.\n\n- **Breadth-First Search (BFS)** is like throwing a pebble into a still pond: the ripples expand outward in perfect concentric circles. It checks all your immediate friends first, then your friends' friends. (Guarantees finding the shortest unweighted path!).\n- **Depth-First Search (DFS)** is like exploring a vast labyrinth: you keep one hand on the right wall and follow one single corridor all the way to a dead end before backtracking to explore remaining paths.`
  ],
  dynamicProgramming: [
    `🎯 **Understanding Dynamic Programming (DP)**\n\nThink of Dynamic Programming like writing down answers on a whiteboard so you never have to calculate the same difficult equation twice!\n\nImagine I ask you: "What is 1 + 1 + 1 + 1 + 1?" You count and say "5".\nIf I instantly add another "+ 1" to the end, you don't re-count all six ones from scratch! You simply remember the previous answer (5) and add 1 to get 6. Storing past results to instantly solve future overlapping subproblems is called **Memoization** (\`O(n)\` speed).`
  ],
  complexity: [
    `🎯 **Understanding Big-O & Time/Space Complexity**\n\nBig-O notation is how computer scientists measure how well an algorithm scales when the input becomes massive (like 1 billion users):\n\n- ⚡ **O(1) Constant**: Like switching on a lightbulb. Whether the room is 10 square feet or 10,000 square feet, flipping the switch takes the exact same instant.\n- 🚶 **O(n) Linear**: Like reading a book page-by-page. Double the pages, double the time.\n- 🔍 **O(log n) Logarithmic**: Like searching a dictionary by halving the pages. Extremely scalable!\n- 🐢 **O(n²) Quadratic**: Like shaking hands with everyone in a room of N people, where everyone shakes hands with everyone else. Explodes in time as N grows!`
  ],
  general: [
    `🧠 **AI Concept Tutor & Study Companion**\n\nThat is a fantastic question! Whenever you encounter a difficult computer science topic, the best way to master it is to break it down into real-world analogies.\n\nData structures are simply different ways of organizing physical items in a room (like stacking plates in a kitchen or hanging coats in a closet). If you tell me exactly which topic on the roadmap is confusing you (e.g., Arrays, Hash Tables, Linked Lists, Stacks, Recursion, Searching, Sorting, Trees, Graphs, DP, or Big-O), I will walk you through the intuition step-by-step!`
  ]
};

const getResponseCategory = (prompt: string): string => {
  const lower = prompt.toLowerCase();
  
  // 1. Two-word or very specific keywords first
  if (lower.includes('binary search tree') || lower.includes('bst') || lower.includes('avl')) return 'trees';
  if (lower.includes('binary search') || lower.includes('linear search') || lower.includes('jump search')) return 'searching';
  if (lower.includes('dynamic programming') || lower.includes('dp') || lower.includes('memoiz') || lower.includes('tabulat') || lower.includes('subproblem') || lower.includes('fibonacci')) return 'dynamicProgramming';
  if (lower.includes('big o') || lower.includes('time complexity') || lower.includes('space complexity') || lower.includes('asymptotic') || lower.includes('o(1)') || lower.includes('o(n)')) return 'complexity';
  if (lower.includes('linked list') || lower.includes('singly') || lower.includes('doubly') || lower.includes('node pointer') || lower.includes('floyd') || lower.includes('cycle')) return 'linkedLists';
  if (lower.includes('two pointer') || lower.includes('two-pointer') || lower.includes('pointers')) return 'arrays';
  if (lower.includes('hash') || lower.includes('map') || lower.includes('dict') || lower.includes('collision') || lower.includes('chaining') || lower.includes('bucket')) return 'hashTables';
  
  // 2. Single-word broad topics
  if (lower.includes('array') || lower.includes('vector') || lower.includes('slice') || lower.includes('index')) return 'arrays';
  if (lower.includes('stack') || lower.includes('queue') || lower.includes('lifo') || lower.includes('fifo') || lower.includes('push') || lower.includes('pop') || lower.includes('enqueue') || lower.includes('dequeue')) return 'stacksQueues';
  if (lower.includes('recur') || lower.includes('factorial') || lower.includes('base case') || lower.includes('call stack')) return 'recursion';
  if (lower.includes('search') || lower.includes('find') || lower.includes('target')) return 'searching';
  if (lower.includes('sort') || lower.includes('order') || lower.includes('quick') || lower.includes('merge') || lower.includes('bubble') || lower.includes('selection') || lower.includes('insertion')) return 'sorting';
  if (lower.includes('tree') || lower.includes('root') || lower.includes('leaf') || lower.includes('traversal') || lower.includes('inorder') || lower.includes('preorder')) return 'trees';
  if (lower.includes('graph') || lower.includes('bfs') || lower.includes('dfs') || lower.includes('dijkstra') || lower.includes('vertex') || lower.includes('edge') || lower.includes('shortest path')) return 'graphs';
  if (lower.includes('complexity') || lower.includes('scale')) return 'complexity';
  
  return 'general';
};

export const AITutorService = {
  getExplanation: async (prompt: string): Promise<string> => {
    // Simulate network delay for realistic AI feel
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const category = getResponseCategory(prompt);
    const responses = CONCEPT_EXPLANATIONS[category] || CONCEPT_EXPLANATIONS.general;
    return responses[Math.floor(Math.random() * responses.length)];
  },
};
