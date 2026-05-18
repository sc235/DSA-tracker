export interface BenchmarkResult {
    size: number;
    time: number; 
}

export interface ComplexityData {
    algorithmId: string;
    results: BenchmarkResult[];
}

export class BenchmarkingService {
    static async runBenchmark(
        algoId: string, 
        algorithm: (data: number[]) => void, 
        sizes: number[] = [10, 50, 100, 500, 1000]
    ): Promise<BenchmarkResult[]> {
        const results: BenchmarkResult[] = [];

        for (const size of sizes) {
            const data = Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
            
            const start = performance.now();
            algorithm([...data]);
            const end = performance.now();
            
            results.push({
                size,
                time: end - start
            });
        }

        return results;
    }

    static implementations: Record<string, (data: number[]) => void> = {
        'bubble-sort': (arr) => {
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length - i - 1; j++) {
                    if (arr[j] > arr[j + 1]) {
                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    }
                }
            }
        },
        'selection-sort': (arr) => {
            for (let i = 0; i < arr.length; i++) {
                let min = i;
                for (let j = i + 1; j < arr.length; j++) {
                    if (arr[j] < arr[min]) min = j;
                }
                [arr[i], arr[min]] = [arr[min], arr[i]];
            }
        },
        'insertion-sort': (arr) => {
            for (let i = 1; i < arr.length; i++) {
                let key = arr[i];
                let j = i - 1;
                while (j >= 0 && arr[j] > key) {
                    arr[j + 1] = arr[j];
                    j = j - 1;
                }
                arr[j + 1] = key;
            }
        },
        'quick-sort': (arr) => {
            const sort = (a: number[], low: number, high: number) => {
                if (low < high) {
                    let pivot = partition(a, low, high);
                    sort(a, low, pivot - 1);
                    sort(a, pivot + 1, high);
                }
            };
            const partition = (a: number[], low: number, high: number) => {
                let pivot = a[high];
                let i = low - 1;
                for (let j = low; j < high; j++) {
                    if (a[j] < pivot) {
                        i++;
                        [a[i], a[j]] = [a[j], a[i]];
                    }
                }
                [a[i + 1], a[high]] = [a[high], a[i + 1]];
                return i + 1;
            };
            sort(arr, 0, arr.length - 1);
        },
        'merge-sort': (arr) => {
            const merge = (left: number[], right: number[]): number[] => {
                let result = [], l = 0, r = 0;
                while (l < left.length && r < right.length) {
                    if (left[l] < right[r]) result.push(left[l++]);
                    else result.push(right[r++]);
                }
                return result.concat(left.slice(l)).concat(right.slice(r));
            };
            const sort = (a: number[]): number[] => {
                if (a.length <= 1) return a;
                const mid = Math.floor(a.length / 2);
                return merge(sort(a.slice(0, mid)), sort(a.slice(mid)));
            };
            sort(arr);
        },
        'heap-sort': (arr) => {
            const heapify = (a: number[], n: number, i: number) => {
                let largest = i;
                let l = 2 * i + 1;
                let r = 2 * i + 2;
                if (l < n && a[l] > a[largest]) largest = l;
                if (r < n && a[r] > a[largest]) largest = r;
                if (largest !== i) {
                    [a[i], a[largest]] = [a[largest], a[i]];
                    heapify(a, n, largest);
                }
            };
            for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) heapify(arr, arr.length, i);
            for (let i = arr.length - 1; i > 0; i--) {
                [arr[0], arr[i]] = [arr[i], arr[0]];
                heapify(arr, i, 0);
            }
        },
        'binary-search': (arr) => {
            const sorted = [...arr].sort((a, b) => a - b);
            const target = sorted[Math.floor(Math.random() * sorted.length)];
            let low = 0, high = sorted.length - 1;
            while (low <= high) {
                let mid = Math.floor((low + high) / 2);
                if (sorted[mid] === target) break;
                if (sorted[mid] < target) low = mid + 1;
                else high = mid - 1;
            }
        }
    };
}
