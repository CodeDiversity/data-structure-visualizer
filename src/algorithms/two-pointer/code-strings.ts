export const TWO_POINTER_CODE = `function findPairWithTarget(values, target) {
  let left = 0;
  let right = values.length - 1;

  while (left < right) {
    const sum = values[left] + values[right];

    if (sum === target) {
      return [left, right];
    }

    if (sum < target) {
      left += 1;
    } else {
      right -= 1;
    }
  }

  return null;
}`;
