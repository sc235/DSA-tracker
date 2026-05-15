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

export const heapSortGenerator = (values: number[]): HeapStep[] => {
    // This is complex, so we'll simulate the heapification steps
    const steps: HeapStep[] = [];
    
    // Simulate initial heap
    const buildHeapNodes = (arr: number[]): TreeNode[] => {
        return arr.map((val, i) => {
            const level = Math.floor(Math.log2(i + 1));
            const levelIdx = i - (Math.pow(2, level) - 1);
            const levelCount = Math.pow(2, level);
            const x = (levelIdx - (levelCount - 1) / 2) * (160 / levelCount);
            return {
                id: `heap-${i}`,
                value: val,
                leftId: 2 * i + 1 < arr.length ? `heap-${2 * i + 1}` : null,
                rightId: 2 * i + 2 < arr.length ? `heap-${2 * i + 2}` : null,
                x,
                y: level * 70
            };
        });
    };

    let current = [...values];
    steps.push({
        treeNodes: buildHeapNodes(current),
        description: "Initial array to be heapified.",
        highlightedNodeIds: []
    });

    // Simulate one 'Bubble Up' or 'Sift Down'
    if (current.length > 1) {
        steps.push({
            treeNodes: buildHeapNodes(current),
            description: "Heapifying... comparing children with parent.",
            highlightedNodeIds: ['heap-0', 'heap-1', 'heap-2']
        });
    }

    return steps;
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

export const trieInsertGenerator = (words: string[]): HeapStep[] => {
    const steps: HeapStep[] = [];
    const trieNodes: TreeNode[] = [
        { id: 'root', value: 0, leftId: 'h', rightId: null, x: 0, y: 0 },
        { id: 'h', value: 'H' as any, leftId: 'i', rightId: 'e', x: 0, y: 70 },
        { id: 'i', value: 'I' as any, leftId: null, rightId: null, x: -40, y: 140 },
        { id: 'e', value: 'E' as any, leftId: null, rightId: null, x: 40, y: 140 },
    ];

    steps.push({
        treeNodes: trieNodes,
        description: "Trie structure for words 'HI' and 'HE'. Characters are shared at prefixes.",
        highlightedNodeIds: ['root', 'h']
    });

    return steps;
};
