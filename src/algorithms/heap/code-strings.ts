export const HEAP_INSERT_CODE = `function insert(heap, value) {
  const nextHeap = [...heap];
  nextHeap.push(value);

  let index = nextHeap.length - 1;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    if (nextHeap[parent] >= nextHeap[index]) {
      break;
    }

    [nextHeap[parent], nextHeap[index]] = [nextHeap[index], nextHeap[parent]];
    index = parent;
  }

  return nextHeap;
}`;

export const HEAP_DELETE_CODE = `function extractMax(heap) {
  const nextHeap = [...heap];
  nextHeap[0] = nextHeap[nextHeap.length - 1];
  nextHeap.pop();

  let index = 0;
  while (true) {
    const left = index * 2 + 1;
    const right = index * 2 + 2;
    let largest = index;

    if (left < nextHeap.length && nextHeap[left] > nextHeap[largest]) {
      largest = left;
    }

    if (right < nextHeap.length && nextHeap[right] > nextHeap[largest]) {
      largest = right;
    }

    if (largest === index) {
      break;
    }

    [nextHeap[index], nextHeap[largest]] = [nextHeap[largest], nextHeap[index]];
    index = largest;
  }

  return nextHeap;
}`;

export const HEAP_SEARCH_CODE = `function search(heap, target) {
  for (let index = 0; index < heap.length; index += 1) {
    if (heap[index] === target) {
      return index;
    }
  }

  return -1;
}`;

export const HEAP_TRAVERSE_CODE = `function traverse(heap) {
  for (let index = 0; index < heap.length; index += 1) {
    console.log(heap[index]);
  }
}`;
