export const SLIDING_WINDOW_CODE = `function maxWindowSum(values, k) {
  let windowSum = 0;

  for (let index = 0; index < k; index += 1) {
    windowSum += values[index];
  }

  let bestSum = windowSum;
  let bestStart = 0;

  for (let right = k; right < values.length; right += 1) {
    windowSum += values[right];
    windowSum -= values[right - k];

    if (windowSum > bestSum) {
      bestSum = windowSum;
      bestStart = right - k + 1;
    }
  }

  return { bestSum, bestStart };
}`;
