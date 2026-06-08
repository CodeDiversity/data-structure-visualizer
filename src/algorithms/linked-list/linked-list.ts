import { LinkedListNode } from '../../types';
import { generateNodeId } from '../bst/bst';

function createNode(value: number): LinkedListNode {
  return {
    id: generateNodeId(),
    value,
    next: null,
  };
}

export function append(head: LinkedListNode | null, value: number): LinkedListNode {
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
}

export function deleteValue(head: LinkedListNode | null, value: number): LinkedListNode | null {
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
}

export function search(head: LinkedListNode | null, value: number): boolean {
  let current = head;

  while (current !== null) {
    if (current.value === value) {
      return true;
    }
    current = current.next;
  }

  return false;
}

export function traverse(head: LinkedListNode | null): number[] {
  const values: number[] = [];
  let current = head;

  while (current !== null) {
    values.push(current.value);
    current = current.next;
  }

  return values;
}

export function buildLinkedList(values: number[]): LinkedListNode | null {
  let head: LinkedListNode | null = null;

  for (const value of values) {
    head = append(head, value);
  }

  return head;
}
