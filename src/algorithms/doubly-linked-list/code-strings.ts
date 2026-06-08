export const DOUBLY_APPEND_CODE = `function append(head, value) {
  const newNode = createNode(value);

  if (head === null) {
    return newNode;
  }

  let current = head;
  while (current.next !== null) {
    current = current.next;
  }

  current.next = newNode;
  newNode.prev = current;
  return head;
}`;

export const DOUBLY_DELETE_CODE = `function deleteValue(head, value) {
  if (head === null) {
    return null;
  }

  if (head.value === value) {
    head = head.next;
    if (head !== null) {
      head.prev = null;
    }
    return head;
  }

  let current = head;
  while (current !== null) {
    if (current.value === value) {
      if (current.prev !== null) current.prev.next = current.next;
      if (current.next !== null) current.next.prev = current.prev;
      return head;
    }
    current = current.next;
  }

  return head;
}`;

export const DOUBLY_SEARCH_CODE = `function search(head, value) {
  let current = head;

  while (current !== null) {
    if (current.value === value) {
      return true;
    }
    current = current.next;
  }

  return false;
}`;

export const DOUBLY_TRAVERSE_CODE = `function traverse(head) {
  const values = [];
  let current = head;

  while (current !== null) {
    values.push(current.value);
    current = current.next;
  }

  return values;
}`;
