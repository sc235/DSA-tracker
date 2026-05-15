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
      const finalSummaries: Record<string, {text: string, tip: string}> = {
          "bubble-sort": {
              text: "Success! The data is now fully sorted. Bubble Sort finished by 'bubbling' the largest values to the end. Note that even for a small list, it took a lot of comparisons!",
              tip: "Bubble Sort is best used on tiny datasets or nearly-sorted lists."
          },
          "selection-sort": {
              text: "Done! We successfully picked the smallest element in each pass. It's simple, but notice how it took the same amount of time regardless of how sorted the input was.",
              tip: "Selection Sort has a consistent O(n²) time complexity, making it predictable but slow."
          },
          "quick-sort": {
              text: "Amazing speed! By recursively partitioning the data around pivots, Quick Sort sorted the list significantly faster than simpler methods.",
              tip: "In real-world systems, Quick Sort is the engine behind many standard libraries."
          },
          "merge-sort": {
              text: "Perfectly organized! The 'Divide and Conquer' strategy ensured we never did more work than necessary. Stable and efficient.",
              tip: "Merge Sort is the preferred choice for sorting massive datasets that don't fit in memory."
          },
          "binary-search": {
              text: "Found it! By cutting the search space in half every single time, we found the target with very few checks.",
              tip: "Always remember: Binary Search ONLY works on sorted data!"
          }
      };

      const summary = finalSummaries[algorithmId] || {
          text: "The algorithm has successfully completed its operations and the data structure is now optimized and stable.",
          tip: "Understanding when to use each algorithm is the key to software engineering."
      };

      return {
          step: "🎉 Conclusion reached!",
          explanation: summary.text,
          analogy: "Think of this as the final check-list. The shelf is organized, the book is found, and the job is done!",
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

// ── AI Interview Tutor Service ─────────────────────────────────────────
// Used by the Interview screen for interactive mock interview responses.

const INTERVIEW_RESPONSES: Record<string, string[]> = {
  complexity: [
    "Good analysis! You're on the right track with the complexity reasoning. Can you now explain what happens to the space complexity when we use recursion versus iteration?",
    "Interesting perspective on time complexity. Let's go deeper — how would this algorithm's performance change if the input were already sorted?",
    "You've identified the key trade-off. Now, can you compare this with a divide-and-conquer approach? What would change?",
  ],
  dataStructure: [
    "That's a solid understanding of the data structure. Can you explain a real-world scenario where you'd choose this over an alternative?",
    "Good explanation! Now, what would be the impact on performance if we needed to support concurrent access to this structure?",
    "Nice! Let's take it further — how would you modify this structure to support range queries efficiently?",
  ],
  algorithm: [
    "Well explained! Now, what edge cases would you consider when implementing this in production code?",
    "That's correct. Can you walk me through how you'd optimize this for very large datasets that don't fit in memory?",
    "Great answer. Let's discuss trade-offs — when would you NOT use this approach?",
  ],
  general: [
    "Interesting answer. Let me challenge you: what's the worst-case scenario for this approach, and how would you mitigate it?",
    "I see your reasoning. Can you think of a situation where a simpler, brute-force approach might actually be preferable?",
    "Good thinking! As a follow-up: how would you test this implementation to ensure correctness? What test cases would you write?",
    "That's a thoughtful response. Now, how would you explain this concept to a junior developer who's never seen it before?",
    "Solid understanding. Let's pivot — can you describe how this concept applies in system design, beyond just algorithms?",
  ],
};

const getResponseCategory = (prompt: string): string => {
  const lower = prompt.toLowerCase();
  if (lower.includes('complexity') || lower.includes('big o') || lower.includes('time') || lower.includes('space'))
    return 'complexity';
  if (lower.includes('tree') || lower.includes('list') || lower.includes('hash') || lower.includes('stack') || lower.includes('queue') || lower.includes('graph'))
    return 'dataStructure';
  if (lower.includes('sort') || lower.includes('search') || lower.includes('traverse') || lower.includes('algorithm'))
    return 'algorithm';
  return 'general';
};

export const AITutorService = {
  getExplanation: async (prompt: string): Promise<string> => {
    // Simulate network delay for realistic AI feel
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const category = getResponseCategory(prompt);
    const responses = INTERVIEW_RESPONSES[category];
    return responses[Math.floor(Math.random() * responses.length)];
  },
};
