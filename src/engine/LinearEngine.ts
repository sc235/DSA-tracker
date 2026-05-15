import { Step } from './types';

export interface LinearStep extends Step {
    data: number[];
    activeIndex?: number;
    stackPointer?: number;
    queueHead?: number;
    queueTail?: number;
}

export const stackGenerator = (initialData: number[], action: 'push' | 'pop', value?: number): LinearStep[] => {
    const steps: LinearStep[] = [];
    const currentStack = [...initialData];

    if (action === 'push' && value !== undefined) {
        steps.push({
            data: [...currentStack],
            description: `Preparing to push ${value} onto the stack.`,
            activeIndex: -1
        });

        currentStack.push(value);
        steps.push({
            data: [...currentStack],
            description: `${value} pushed onto the top of the stack (LIFO).`,
            activeIndex: currentStack.length - 1
        });
    } else if (action === 'pop') {
        if (currentStack.length === 0) {
            steps.push({
                data: [],
                description: "Stack Underflow: Cannot pop from an empty stack!",
            });
            return steps;
        }

        steps.push({
            data: [...currentStack],
            description: `Identifying the top element: ${currentStack[currentStack.length - 1]}`,
            activeIndex: currentStack.length - 1
        });

        const popped = currentStack.pop();
        steps.push({
            data: [...currentStack],
            description: `${popped} removed from the top (LIFO).`,
            activeIndex: -1
        });
    }

    return steps;
};

export const queueGenerator = (initialData: number[], action: 'enqueue' | 'dequeue', value?: number): LinearStep[] => {
    const steps: LinearStep[] = [];
    const currentQueue = [...initialData];

    if (action === 'enqueue' && value !== undefined) {
        steps.push({
            data: [...currentQueue],
            description: `Preparing to enqueue ${value} at the back.`,
            activeIndex: -1
        });

        currentQueue.push(value);
        steps.push({
            data: [...currentQueue],
            description: `${value} added to the rear of the queue (FIFO).`,
            activeIndex: currentQueue.length - 1
        });
    } else if (action === 'dequeue') {
        if (currentQueue.length === 0) {
            steps.push({
                data: [],
                description: "Queue Underflow: Cannot dequeue from an empty queue!",
            });
            return steps;
        }

        steps.push({
            data: [...currentQueue],
            description: `Identifying the front element: ${currentQueue[0]}`,
            activeIndex: 0
        });

        const shifted = currentQueue.shift();
        steps.push({
            data: [...currentQueue],
            description: `${shifted} removed from the front (FIFO).`,
            activeIndex: -1
        });
    }

    return steps;
};
