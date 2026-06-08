import { DoublyLinkedListNode } from '../../types';
import { generateNodeId } from '../bst/bst';

function createNode(value: number): DoublyLinkedListNode {
  return {
    id: generateNodeId(),
    value,
    prev: null,
    next: null,
  };
}

export function append(head: DoublyLinkedListNode | null, value: number): DoublyLinkedListNode {
  const newNode = createNode(value);

  if (head === null) {
    return newNode;
  }

  let current: DoublyLinkedListNode | null = head;
  while (current.next !== null) {
    current = current.next;
  }

  current.next = newNode;
  newNode.prev = current;
  return head;
}

export function deleteValue(
  head: DoublyLinkedListNode | null,
  value: number
): DoublyLinkedListNode | null {
  if (head === null) {
    return null;
  }

  if (head.value === value) {
    const nextHead = head.next;
    if (nextHead !== null) {
      nextHead.prev = null;
    }
    return nextHead;
  }

  let current: DoublyLinkedListNode | null = head;
  while (current !== null) {
    if (current.value === value) {
      if (current.prev !== null) {
        current.prev.next = current.next;
      }
      if (current.next !== null) {
        current.next.prev = current.prev;
      }
      return head;
    }
    current = current.next;
  }

  return head;
}

export function search(head: DoublyLinkedListNode | null, value: number): boolean {
  let current = head;

  while (current !== null) {
    if (current.value === value) {
      return true;
    }
    current = current.next;
  }

  return false;
}

export function traverse(head: DoublyLinkedListNode | null): number[] {
  const values: number[] = [];
  let current = head;

  while (current !== null) {
    values.push(current.value);
    current = current.next;
  }

  return values;
}

export function buildDoublyLinkedList(values: number[]): DoublyLinkedListNode | null {
  let head: DoublyLinkedListNode | null = null;

  for (const value of values) {
    head = append(head, value);
  }

  return head;
}
