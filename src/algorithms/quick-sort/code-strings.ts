export const QUICK_SORT_CODE = `function quickSort(values, low = 0, high = values.length - 1) {
  if (low < high) {
    const pivotIndex = partition(values, low, high);
    quickSort(values, low, pivotIndex - 1);
    quickSort(values, pivotIndex + 1, high);
  }
}

function partition(values, low, high) {
  const pivot = values[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (values[j] <= pivot) {
      i += 1;
      [values[i], values[j]] = [values[j], values[i]];
    }
  }

  [values[i + 1], values[high]] = [values[high], values[i + 1]];
  return i + 1;
}`;