import { Step } from './types';
import { TreeNode } from './TreeEngine';

export interface HashStep extends Step {
    buckets: (number | null)[];
    hashValue?: number;
    key?: number;
}

export interface HeapStep extends Step {
    treeNodes: TreeNode[];
}

export const hashInsertGenerator = (keys: number[]): HashStep[] => {
    const tableSize = 7;
    const buckets: (number | null)[] = new Array(tableSize).fill(null);
    const steps: HashStep[] = [];

    steps.push({
        buckets: [...buckets],
        description: "Initialized an empty Hash Table of size 7.",
        activeIndices: []
    });

    keys.forEach(key => {
        const hash = key % tableSize;
        steps.push({
            buckets: [...buckets],
            description: `Calculating hash for ${key}: ${key} % ${tableSize} = ${hash}`,
            activeIndices: [hash],
            key,
            hashValue: hash
        });

        // Simplified collision handling for visualization
        if (buckets[hash] !== null) {
            steps.push({
                buckets: [...buckets],
                description: `Collision detected at index ${hash}! In a real app, we would use Chaining or Probing.`,
                activeIndices: [hash],
                key,
                hashValue: hash
            });
        }

        buckets[hash] = key;
        steps.push({
            buckets: [...buckets],
            description: `Inserted ${key} into bucket ${hash}.`,
            activeIndices: [hash],
            key,
            hashValue: hash
        });
    });

    return steps;
};

export const heapGenerator = (values: number[], type: 'max' | 'min'): HeapStep[] => {
    const steps: HeapStep[] = [];
    let current = [...values];

    const buildHeapNodes = (arr: number[], highlightedEdges: string[] = []): TreeNode[] => {
        return arr.map((val, i) => {
            const level = Math.floor(Math.log2(i + 1));
            const levelIdx = i - (Math.pow(2, level) - 1);
            const levelCount = Math.pow(2, level);
            const x = (levelIdx - (levelCount - 1) / 2) * (180 / levelCount);
            return {
                id: `h${i}_v${val}`,
                value: val,
                leftId: 2 * i + 1 < arr.length ? `h${2 * i + 1}_v${arr[2 * i + 1]}` : null,
                rightId: 2 * i + 2 < arr.length ? `h${2 * i + 2}_v${arr[2 * i + 2]}` : null,
                x,
                y: level * 70
            };
        });
    };

    steps.push({
        treeNodes: buildHeapNodes(current),
        description: `Initial unsorted binary tree. We will build a ${type.toUpperCase()}-Heap.`,
        highlightedNodeIds: []
    });

    const siftDown = (arr: number[], idx: number, end: number) => {
        let root = idx;
        while (2 * root + 1 <= end) {
            let left = 2 * root + 1;
            let right = 2 * root + 2 <= end ? 2 * root + 2 : -1;
            let swapIdx = root;

            if (type === 'max') {
                if (arr[left] > arr[swapIdx]) swapIdx = left;
                if (right !== -1 && arr[right] > arr[swapIdx]) swapIdx = right;
            } else {
                if (arr[left] < arr[swapIdx]) swapIdx = left;
                if (right !== -1 && arr[right] < arr[swapIdx]) swapIdx = right;
            }

            const highlighted = [root, left];
            if (right !== -1) highlighted.push(right);
            const nodeIds = highlighted.map(i => `h${i}_v${arr[i]}`);

            if (swapIdx !== root) {
                steps.push({
                    treeNodes: buildHeapNodes(arr),
                    description: `Comparing parent (${arr[root]}) with children. Swapping with ${arr[swapIdx]}.`,
                    highlightedNodeIds: nodeIds
                });
                const temp = arr[root];
                arr[root] = arr[swapIdx];
                arr[swapIdx] = temp;
                steps.push({
                    treeNodes: buildHeapNodes(arr),
                    description: `Swapped ${arr[swapIdx]} and ${arr[root]}.`,
                    highlightedNodeIds: [`h${root}_v${arr[root]}`, `h${swapIdx}_v${arr[swapIdx]}`]
                });
                root = swapIdx;
            } else {
                steps.push({
                    treeNodes: buildHeapNodes(arr),
                    description: `Parent (${arr[root]}) correctly satisfies ${type.toUpperCase()}-Heap property.`,
                    highlightedNodeIds: [`h${root}_v${arr[root]}`]
                });
                break;
            }
        }
    };

    // Bottom-Up Heap Construction
    const n = current.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        siftDown(current, i, n - 1);
    }

    steps.push({
        treeNodes: buildHeapNodes(current),
        description: `🎉 Flawless ${type.toUpperCase()}-Heap built! All nodes satisfy ordering invariants.`,
        highlightedNodeIds: current.map((val, i) => `h${i}_v${val}`)
    });

    // Simulate 1 priority extraction
    if (current.length > 1) {
        const extracted = current[0];
        const lastLeaf = current[current.length - 1];
        steps.push({
            treeNodes: buildHeapNodes(current),
            description: `Priority Extraction: Extracting root (${extracted}) and replacing with last leaf (${lastLeaf}).`,
            highlightedNodeIds: [`h0_v${extracted}`, `h${current.length - 1}_v${lastLeaf}`]
        });

        current[0] = lastLeaf;
        current.pop();

        steps.push({
            treeNodes: buildHeapNodes(current),
            description: `Root extracted. New root is ${lastLeaf}. Sifting down to restore heap property.`,
            highlightedNodeIds: [`h0_v${lastLeaf}`]
        });

        siftDown(current, 0, current.length - 1);

        steps.push({
            treeNodes: buildHeapNodes(current),
            description: `🎉 Extraction & Re-balancing complete! Heap structure restored.`,
            highlightedNodeIds: current.map((val, i) => `h${i}_v${val}`)
        });
    }

    return steps;
};

export const heapSortGenerator = (values: number[]): HeapStep[] => {
    return heapGenerator(values, 'max');
};

export const dpFibonacciGenerator = (n: number): Step[] => {
    const memo: (number | null)[] = new Array(n + 1).fill(null);
    const steps: Step[] = [];

    steps.push({
        data: memo.map(v => v === null ? 0 : v),
        description: `Starting DP for Fibonacci(${n}). We'll fill the memoization table.`,
        activeIndices: []
    });

    memo[0] = 0;
    steps.push({
        data: memo.map(v => v === null ? 0 : v),
        description: "Base case: Fib(0) = 0",
        activeIndices: [0]
    });

    memo[1] = 1;
    steps.push({
        data: memo.map(v => v === null ? 0 : v),
        description: "Base case: Fib(1) = 1",
        activeIndices: [1]
    });

    for (let i = 2; i <= n; i++) {
        steps.push({
            data: memo.map(v => v === null ? 0 : v),
            description: `Calculating Fib(${i}) = Fib(${i-1}) + Fib(${i-2})`,
            comparingIndices: [i-1, i-2]
        });
        memo[i] = (memo[i-1] as number) + (memo[i-2] as number);
        steps.push({
            data: memo.map(v => v === null ? 0 : v),
            description: `Stored result in table: Fib(${i}) = ${memo[i]}`,
            activeIndices: [i]
        });
    }

    return steps;
};

export const arrayReverseGenerator = (initial: number[]): Step[] => {
    const steps: Step[] = [];
    const arr = [...initial];

    steps.push({
        data: [...arr],
        description: "Initial array. We will reverse it in-place using two pointers (left & right).",
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: []
    });

    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        steps.push({
            data: [...arr],
            description: `Comparing elements at pointers left (${left}) and right (${right}).`,
            activeIndices: [],
            comparingIndices: [left, right],
            swappingIndices: []
        });

        steps.push({
            data: [...arr],
            description: `Swapping ${arr[left]} and ${arr[right]}.`,
            activeIndices: [],
            comparingIndices: [],
            swappingIndices: [left, right]
        });

        const temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;

        steps.push({
            data: [...arr],
            description: `Successfully swapped! Moving pointers inward.`,
            activeIndices: [left, right],
            comparingIndices: [],
            swappingIndices: []
        });

        left++;
        right--;
    }

    steps.push({
        data: [...arr],
        description: `🎉 Reversal complete! The array is fully inverted in O(n) time and O(1) space.`,
        activeIndices: arr.map((_, i) => i),
        comparingIndices: [],
        swappingIndices: []
    });

    return steps;
};

export const kadaneGenerator = (initial: number[]): Step[] => {
    const steps: Step[] = [];
    const arr = [...initial];

    steps.push({
        data: [...arr],
        description: "Kadane's Algorithm: We will find the maximum sum contiguous subarray in O(n) time.",
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: []
    });

    let maxSoFar = arr[0];
    let currentSum = arr[0];

    steps.push({
        data: [...arr],
        description: `Initialize currentSum = ${currentSum} and maxSoFar = ${maxSoFar} at index 0.`,
        activeIndices: [0],
        comparingIndices: [],
        swappingIndices: []
    });

    for (let i = 1; i < arr.length; i++) {
        const val = arr[i];
        steps.push({
            data: [...arr],
            description: `Examining element at index ${i}: ${val}.`,
            activeIndices: [],
            comparingIndices: [i],
            swappingIndices: []
        });

        if (currentSum + val < val) {
            currentSum = val;
            steps.push({
                data: [...arr],
                description: `Previous sum was making us smaller. Reset currentSum starting at ${val}.`,
                activeIndices: [i],
                comparingIndices: [],
                swappingIndices: []
            });
        } else {
            currentSum += val;
            steps.push({
                data: [...arr],
                description: `Adding ${val} to running sum. currentSum = ${currentSum}.`,
                activeIndices: [i],
                comparingIndices: [],
                swappingIndices: []
            });
        }

        if (currentSum > maxSoFar) {
            maxSoFar = currentSum;
            steps.push({
                data: [...arr],
                description: `🏆 New maximum subarray sum found: ${maxSoFar}!`,
                activeIndices: [i],
                comparingIndices: [],
                swappingIndices: [i]
            });
        }
    }

    steps.push({
        data: [...arr],
        description: `🎉 Kadane's Algorithm finished! The Maximum Subarray Sum is ${maxSoFar}.`,
        activeIndices: arr.map((_, i) => i),
        comparingIndices: [],
        swappingIndices: []
    });

    return steps;
};
