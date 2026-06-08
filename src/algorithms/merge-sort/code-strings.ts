export const MERGE_SORT_CODE = `function mergeSort(values, start = 0, end = values.length - 1) {
  if (start >= end) {
    return;
  }

  const mid = Math.floor((start + end) / 2);
  mergeSort(values, start, mid);
  mergeSort(values, mid + 1, end);
  merge(values, start, mid, end);
}

function merge(values, start, mid, end) {
  const left = values.slice(start, mid + 1);
  const right = values.slice(mid + 1, end + 1);
  let leftIndex = 0;
  let rightIndex = 0;
  let writeIndex = start;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      values[writeIndex] = left[leftIndex];
      leftIndex += 1;
    } else {
      values[writeIndex] = right[rightIndex];
      rightIndex += 1;
    }
    writeIndex += 1;
  }

  while (leftIndex < left.length) {
    values[writeIndex] = left[leftIndex];
    leftIndex += 1;
    writeIndex += 1;
  }

  while (rightIndex < right.length) {
    values[writeIndex] = right[rightIndex];
    rightIndex += 1;
    writeIndex += 1;
  }
}`;
