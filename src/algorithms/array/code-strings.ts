export const ARRAY_APPEND_CODE = `function append(values, value) {
  const nextValues = [...values];
  nextValues.push(value);

  return nextValues;
}`;

export const ARRAY_DELETE_CODE = `function deleteAtIndex(values, indexToDelete) {
  const nextValues = [...values];

  for (let index = indexToDelete; index < nextValues.length - 1; index += 1) {
    nextValues[index] = nextValues[index + 1];
  }

  nextValues.pop();
  return nextValues;
}`;

export const ARRAY_SEARCH_CODE = `function linearSearch(values, target) {
  for (let index = 0; index < values.length; index += 1) {
    if (values[index] === target) {
      return index;
    }
  }

  return -1;
}`;

export const ARRAY_TRAVERSE_CODE = `function traverse(values) {
  for (let index = 0; index < values.length; index += 1) {
    console.log(values[index]);
  }
}`;
