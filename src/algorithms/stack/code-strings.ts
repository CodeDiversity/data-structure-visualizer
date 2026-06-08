export const STACK_PUSH_CODE = `function push(stack, value) {
  const nextStack = [...stack];
  nextStack.push(value);

  return nextStack;
}`;

export const STACK_POP_CODE = `function pop(stack) {
  const nextStack = [...stack];
  nextStack.pop();

  return nextStack;
}`;

export const STACK_SEARCH_CODE = `function search(stack, target) {
  for (let index = stack.length - 1; index >= 0; index -= 1) {
    if (stack[index] === target) {
      return index;
    }
  }

  return -1;
}`;

export const STACK_TRAVERSE_CODE = `function traverse(stack) {
  for (let index = stack.length - 1; index >= 0; index -= 1) {
    console.log(stack[index]);
  }
}`;
