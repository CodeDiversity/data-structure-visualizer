export const KADANE_CODE = `function kadane(values) {
  let currentSum = values[0];
  let bestSum = values[0];
  let currentStart = 0;
  let bestStart = 0;
  let bestEnd = 0;

  for (let index = 1; index < values.length; index += 1) {
    if (currentSum + values[index] < values[index]) {
      currentSum = values[index];
      currentStart = index;
    } else {
      currentSum += values[index];
    }

    if (currentSum > bestSum) {
      bestSum = currentSum;
      bestStart = currentStart;
      bestEnd = index;
    }
  }

  return { bestSum, bestStart, bestEnd };
}`;
