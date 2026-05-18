import { Step } from './types';

export const binarySearchGenerator = (inputData: number[], target: number): Step[] => {
  const data = [...inputData].sort((a, b) => a - b);
  const steps: Step[] = [];

  steps.push({
    data: [...data],
    activeIndices: Array.from({ length: data.length }, (_, i) => i),
    comparingIndices: [],
    swappingIndices: [],
    description: `Searching for ${target} in a sorted array...`,
  });

  let left = 0;
  let right = data.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      data: [...data],
      activeIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      comparingIndices: [mid],
      swappingIndices: [],
      description: `Middle element is ${data[mid]}. Comparing with target ${target}...`,
    });

    if (data[mid] === target) {
      steps.push({
        data: [...data],
        activeIndices: [mid],
        comparingIndices: [],
        swappingIndices: [],
        description: `Found ${target} at index ${mid}!`,
      });
      return steps;
    }

    if (data[mid] < target) {
      const oldLeft = left;
      left = mid + 1;
      steps.push({
        data: [...data],
        activeIndices: left <= right ? Array.from({ length: right - left + 1 }, (_, i) => left + i) : [],
        comparingIndices: [],
        swappingIndices: [],
        description: `${data[mid]} < ${target}. Searching in the right half (indices ${left} to ${right}).`,
      });
    } else {
      const oldRight = right;
      right = mid - 1;
      steps.push({
        data: [...data],
        activeIndices: left <= right ? Array.from({ length: right - left + 1 }, (_, i) => left + i) : [],
        comparingIndices: [],
        swappingIndices: [],
        description: `${data[mid]} > ${target}. Searching in the left half (indices ${left} to ${right}).`,
      });
    }
  }

  steps.push({
    data: [...data],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: `${target} not found in the array.`,
  });

  return steps;
};
