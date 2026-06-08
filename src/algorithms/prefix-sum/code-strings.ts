export const PREFIX_SUM_BUILD_CODE = `function buildPrefixSum(values) {
  const prefix = [];
  let runningSum = 0;

  for (let index = 0; index < values.length; index += 1) {
    runningSum += values[index];
    prefix[index] = runningSum;
  }

  return prefix;
}`;

export const PREFIX_SUM_QUERY_CODE = `function rangeSum(prefix, left, right) {
  if (left === 0) {
    return prefix[right];
  }

  return prefix[right] - prefix[left - 1];
}`;
