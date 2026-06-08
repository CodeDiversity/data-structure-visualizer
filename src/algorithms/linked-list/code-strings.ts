export const APPEND_CODE = `function append(head, value) {
  const newNode = createNode(value);

  if (head === null) {
    return newNode;
  }

  let current = head;
  while (current.next !== null) {
    current = current.next;
  }

  current.next = newNode;
  return head;
}`;

export const LINKED_LIST_DELETE_CODE = `function deleteValue(head, value) {
  if (head === null) {
    return null;
  }

  if (head.value === value) {
    return head.next;
  }

  let current = head;
  while (current.next !== null) {
    if (current.next.value === value) {
      current.next = current.next.next;
      return head;
    }
    current = current.next;
  }

  return head;
}`;

export const LINKED_LIST_SEARCH_CODE = `function search(head, value) {
  let current = head;

  while (current !== null) {
    if (current.value === value) {
      return true;
    }
    current = current.next;
  }

  return false;
}`;

export const LINKED_LIST_TRAVERSE_CODE = `function traverse(head) {
  const values = [];
  let current = head;

  while (current !== null) {
    values.push(current.value);
    current = current.next;
  }

  return values;
}`;
