import { Step } from './types';

export const bubbleSortGenerator = (inputData: number[]): Step[] => {
  const data = [...inputData];
  const steps: Step[] = [];

  steps.push({
    data: [...data],
    activeIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    description: 'Starting Bubble Sort...',
  });

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length - i - 1; j++) {
      steps.push({
        data: [...data],
        activeIndices: [],
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        description: `Comparing ${data[j]} and ${data[j + 1]}`,
      });

      if (data[j] > data[j + 1]) {
        const temp = data[j];
        data[j] = data[j + 1];
        data[j + 1] = temp;

        steps.push({
          data: [...data],
          activeIndices: [],
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          description: `Swapping ${data[j]} and ${data[j + 1]}`,
        });
      }
    }
    steps.push({
      data: [...data],
      activeIndices: Array.from({ length: i + 1 }, (_, index) => data.length - 1 - index),
      comparingIndices: [],
      swappingIndices: [],
      description: `Sorted element reached its position.`,
    });
  }

  steps.push({
    data: [...data],
    activeIndices: Array.from({ length: data.length }, (_, i) => i),
    comparingIndices: [],
    swappingIndices: [],
    description: 'Bubble Sort complete!',
  });

  return steps;
};

export const selectionSortGenerator = (inputData: number[]): Step[] => {
  const data = [...inputData];
  const steps: Step[] = [];

  for (let i = 0; i < data.length - 1; i++) {
    let minIdx = i;
    steps.push({
      data: [...data],
      activeIndices: [i],
      comparingIndices: [],
      swappingIndices: [],
      description: `Searching for the minimum element in the remaining array...`,
    });

    for (let j = i + 1; j < data.length; j++) {
      steps.push({
        data: [...data],
        activeIndices: [i, minIdx],
        comparingIndices: [j],
        swappingIndices: [],
        description: `Comparing current minimum ${data[minIdx]} with ${data[j]}`,
      });

      if (data[j] < data[minIdx]) {
        minIdx = j;
        steps.push({
          data: [...data],
          activeIndices: [i, minIdx],
          comparingIndices: [],
          swappingIndices: [],
          description: `New minimum found: ${data[minIdx]}`,
        });
      }
    }

    if (minIdx !== i) {
      const temp = data[i];
      data[i] = data[minIdx];
      data[minIdx] = temp;
      steps.push({
        data: [...data],
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: [i, minIdx],
        description: `Swapping ${data[minIdx]} with the minimum ${data[i]}`,
      });
    }
  }

  steps.push({
    data: [...data],
    activeIndices: Array.from({ length: data.length }, (_, i) => i),
    comparingIndices: [],
    swappingIndices: [],
    description: 'Selection Sort complete!',
  });

  return steps;
};

export const insertionSortGenerator = (inputData: number[]): Step[] => {
  const data = [...inputData];
  const steps: Step[] = [];

  for (let i = 1; i < data.length; i++) {
    let key = data[i];
    let j = i - 1;

    steps.push({
      data: [...data],
      activeIndices: [i],
      comparingIndices: [],
      swappingIndices: [],
      description: `Picking ${key} to insert into the sorted portion.`,
    });

    while (j >= 0 && data[j] > key) {
      steps.push({
        data: [...data],
        activeIndices: [j + 1],
        comparingIndices: [j],
        swappingIndices: [],
        description: `${data[j]} > ${key}, shifting ${data[j]} to the right.`,
      });
      data[j + 1] = data[j];
      j = j - 1;
    }
    data[j + 1] = key;
    steps.push({
      data: [...data],
      activeIndices: [j + 1],
      comparingIndices: [],
      swappingIndices: [],
      description: `Inserted ${key} at index ${j + 1}.`,
    });
  }

  steps.push({
    data: [...data],
    activeIndices: Array.from({ length: data.length }, (_, i) => i),
    comparingIndices: [],
    swappingIndices: [],
    description: 'Insertion Sort complete!',
  });

  return steps;
};

export const mergeSortGenerator = (inputData: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...inputData];

  const merge = (low: number, mid: number, high: number) => {
    let left = arr.slice(low, mid + 1);
    let right = arr.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;

    steps.push({
      data: [...arr],
      activeIndices: Array.from({ length: high - low + 1 }, (_, index) => low + index),
      comparingIndices: [],
      swappingIndices: [],
      description: `Merging sub-arrays [${left.join(',')}] and [${right.join(',')}]`,
    });

    while (i < left.length && j < right.length) {
      steps.push({
        data: [...arr],
        activeIndices: [k],
        comparingIndices: [low + i, mid + 1 + j],
        swappingIndices: [],
        description: `Comparing ${left[i]} and ${right[j]}`,
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      k++;
      steps.push({
        data: [...arr],
        activeIndices: [k-1],
        comparingIndices: [],
        swappingIndices: [],
        description: `Placed ${arr[k-1]} in merged array.`,
      });
    }

    while (i < left.length) {
      arr[k] = left[i];
      i++;
      k++;
      steps.push({
        data: [...arr],
        activeIndices: [k-1],
        comparingIndices: [],
        swappingIndices: [],
        description: `Adding remaining element ${arr[k-1]} from left sub-array.`,
      });
    }

    while (j < right.length) {
      arr[k] = right[j];
      j++;
      k++;
      steps.push({
        data: [...arr],
        activeIndices: [k-1],
        comparingIndices: [],
        swappingIndices: [],
        description: `Adding remaining element ${arr[k-1]} from right sub-array.`,
      });
    }
  };

  const sort = (low: number, high: number) => {
    if (low < high) {
      let mid = Math.floor((low + high) / 2);
      sort(low, mid);
      sort(mid + 1, high);
      merge(low, mid, high);
    }
  };

  sort(0, arr.length - 1);

  steps.push({
    data: [...arr],
    activeIndices: Array.from({ length: arr.length }, (_, i) => i),
    comparingIndices: [],
    swappingIndices: [],
    description: 'Merge Sort complete!',
  });

  return steps;
};
export const quickSortGenerator = (inputData: number[]): Step[] => {
  const steps: Step[] = [];
  const data = [...inputData];

  const partition = (low: number, high: number): number => {
    let pivot = data[high];
    let i = low - 1;

    steps.push({
      data: [...data],
      activeIndices: [high],
      comparingIndices: [],
      swappingIndices: [],
      description: `Partitioning with pivot ${pivot} at index ${high}`,
    });

    for (let j = low; j < high; j++) {
      steps.push({
        data: [...data],
        activeIndices: [high],
        comparingIndices: [j],
        swappingIndices: [],
        description: `Comparing ${data[j]} with pivot ${pivot}`,
      });

      if (data[j] <= pivot) {
        i++;
        const temp = data[i];
        data[i] = data[j];
        data[j] = temp;

        steps.push({
          data: [...data],
          activeIndices: [high],
          comparingIndices: [],
          swappingIndices: [i, j],
          description: `Swapping ${data[i]} and ${data[j]} (element <= pivot)`,
        });
      }
    }

    const temp = data[i + 1];
    data[i + 1] = data[high];
    data[high] = temp;

    steps.push({
      data: [...data],
      activeIndices: [i + 1],
      comparingIndices: [],
      swappingIndices: [i + 1, high],
      description: `Placing pivot ${pivot} at its correct position ${i + 1}`,
    });

    return i + 1;
  };

  const sort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  };

  sort(0, data.length - 1);

  steps.push({
    data: [...data],
    activeIndices: Array.from({ length: data.length }, (_, i) => i),
    comparingIndices: [],
    swappingIndices: [],
    description: 'Quick Sort complete!',
  });

  return steps;
};
