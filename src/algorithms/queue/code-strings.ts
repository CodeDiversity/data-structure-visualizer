export const QUEUE_ENQUEUE_CODE = `function enqueue(queue, value) {
  const nextQueue = [...queue];
  nextQueue.push(value);

  return nextQueue;
}`;

export const QUEUE_DEQUEUE_CODE = `function dequeue(queue) {
  const nextQueue = [...queue];
  nextQueue.shift();

  return nextQueue;
}`;

export const QUEUE_SEARCH_CODE = `function search(queue, target) {
  for (let index = 0; index < queue.length; index += 1) {
    if (queue[index] === target) {
      return index;
    }
  }

  return -1;
}`;

export const QUEUE_TRAVERSE_CODE = `function traverse(queue) {
  for (let index = 0; index < queue.length; index += 1) {
    console.log(queue[index]);
  }
}`;
