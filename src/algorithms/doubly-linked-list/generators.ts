import { DoublyLinkedListNode, Step } from '../../types';
import { generateNodeId } from '../bst/bst';

export const DOUBLY_LINE_NUMBERS = {
  APPEND: {
    CREATE_NODE: 2,
    EMPTY_LIST: 4,
    INIT_CURRENT: 7,
    WALK_NEXT: 9,
    LINK_NEXT: 12,
    LINK_PREV: 13,
    RETURN_HEAD: 14,
  },
  DELETE: {
    EMPTY_LIST: 2,
    DELETE_HEAD: 6,
    CLEAR_PREV: 9,
    LOOP_START: 13,
    UNLINK_PREV: 15,
    UNLINK_NEXT: 16,
    ADVANCE: 19,
    RETURN_HEAD: 23,
  },
  SEARCH: {
    INIT_CURRENT: 2,
    LOOP_START: 4,
    FOUND: 6,
    ADVANCE: 8,
    NOT_FOUND: 12,
  },
  TRAVERSE: {
    INIT_VALUES: 2,
    INIT_CURRENT: 3,
    LOOP_START: 5,
    VISIT: 6,
    ADVANCE: 7,
    RETURN_VALUES: 10,
  },
};

function cloneList(head: DoublyLinkedListNode | null): DoublyLinkedListNode | null {
  if (head === null) {
    return null;
  }

  const clonedHead: DoublyLinkedListNode = {
    id: head.id,
    value: head.value,
    prev: null,
    next: null,
  };

  let sourceCurrent = head.next;
  let targetCurrent = clonedHead;

  while (sourceCurrent !== null) {
    const nextNode: DoublyLinkedListNode = {
      id: sourceCurrent.id,
      value: sourceCurrent.value,
      prev: targetCurrent,
      next: null,
    };
    targetCurrent.next = nextNode;
    targetCurrent = nextNode;
    sourceCurrent = sourceCurrent.next;
  }

  return clonedHead;
}

export function* doublyAppendGenerator(
  head: DoublyLinkedListNode | null,
  value: number
): Generator<Step, DoublyLinkedListNode, undefined> {
  yield {
    type: 'insert',
    nodeId: null,
    line: DOUBLY_LINE_NUMBERS.APPEND.CREATE_NODE,
    description: `Creating new node with value ${value}`,
  };

  const newNode: DoublyLinkedListNode = {
    id: generateNodeId(),
    value,
    prev: null,
    next: null,
  };

  if (head === null) {
    yield {
      type: 'insert',
      nodeId: newNode.id,
      line: DOUBLY_LINE_NUMBERS.APPEND.EMPTY_LIST,
      description: 'List is empty, new node becomes the head',
    };
    return newNode;
  }

  const nextHead = cloneList(head)!;
  let current = nextHead;

  yield {
    type: 'visit',
    nodeId: current.id,
    line: DOUBLY_LINE_NUMBERS.APPEND.INIT_CURRENT,
    description: `Starting at head node ${current.value}`,
  };

  while (current.next !== null) {
    yield {
      type: 'move',
      nodeId: current.id,
      line: DOUBLY_LINE_NUMBERS.APPEND.WALK_NEXT,
      description: `Moving from node ${current.value} to the next node`,
    };
    current = current.next;
    yield {
      type: 'visit',
      nodeId: current.id,
      line: DOUBLY_LINE_NUMBERS.APPEND.WALK_NEXT,
      description: `Visiting node ${current.value}`,
    };
  }

  current.next = newNode;
  yield {
    type: 'insert',
    nodeId: newNode.id,
    line: DOUBLY_LINE_NUMBERS.APPEND.LINK_NEXT,
    description: `Linking node ${current.value} forward to ${value}`,
  };

  newNode.prev = current;
  yield {
    type: 'insert',
    nodeId: newNode.id,
    line: DOUBLY_LINE_NUMBERS.APPEND.LINK_PREV,
    description: `Linking node ${value} backward to ${current.value}`,
  };

  yield {
    type: 'move',
    nodeId: nextHead.id,
    line: DOUBLY_LINE_NUMBERS.APPEND.RETURN_HEAD,
    description: `Returning head node ${nextHead.value}`,
  };

  return nextHead;
}

export function* doublyDeleteGenerator(
  head: DoublyLinkedListNode | null,
  value: number
): Generator<Step, DoublyLinkedListNode | null, undefined> {
  if (head === null) {
    yield {
      type: 'not-found',
      nodeId: null,
      line: DOUBLY_LINE_NUMBERS.DELETE.EMPTY_LIST,
      description: `List is empty, ${value} was not found`,
    };
    return null;
  }

  const nextHead = cloneList(head)!;

  if (nextHead.value === value) {
    yield {
      type: 'delete',
      nodeId: nextHead.id,
      line: DOUBLY_LINE_NUMBERS.DELETE.DELETE_HEAD,
      description: `Head node ${value} matches, removing it`,
    };

    if (nextHead.next !== null) {
      nextHead.next.prev = null;
      yield {
        type: 'move',
        nodeId: nextHead.next.id,
        line: DOUBLY_LINE_NUMBERS.DELETE.CLEAR_PREV,
        description: `Clearing backward pointer on new head ${nextHead.next.value}`,
      };
    }

    return nextHead.next;
  }

  let current: DoublyLinkedListNode | null = nextHead;
  while (current !== null) {
    yield {
      type: 'compare',
      nodeId: current.id,
      line: DOUBLY_LINE_NUMBERS.DELETE.LOOP_START,
      description: `Checking whether node ${current.value} matches ${value}`,
    };

    if (current.value === value) {
      if (current.prev !== null) {
        current.prev.next = current.next;
        yield {
          type: 'delete',
          nodeId: current.id,
          line: DOUBLY_LINE_NUMBERS.DELETE.UNLINK_PREV,
          description: `Redirecting node ${current.prev.value} to skip ${value}`,
        };
      }

      if (current.next !== null) {
        current.next.prev = current.prev;
        yield {
          type: 'delete',
          nodeId: current.id,
          line: DOUBLY_LINE_NUMBERS.DELETE.UNLINK_NEXT,
          description: `Updating node ${current.next.value} to point back past ${value}`,
        };
      }

      return nextHead;
    }

    current = current.next;
    yield {
      type: 'move',
      nodeId: current?.id ?? null,
      line: DOUBLY_LINE_NUMBERS.DELETE.ADVANCE,
      description: current === null ? 'Reached the end of the list' : `Moving to node ${current.value}`,
    };
  }

  yield {
    type: 'not-found',
    nodeId: null,
    line: DOUBLY_LINE_NUMBERS.DELETE.RETURN_HEAD,
    description: `${value} was not found in the list`,
  };

  return nextHead;
}

export function* doublySearchGenerator(
  head: DoublyLinkedListNode | null,
  value: number
): Generator<Step, boolean, undefined> {
  let current = head;

  yield {
    type: 'visit',
    nodeId: current?.id ?? null,
    line: DOUBLY_LINE_NUMBERS.SEARCH.INIT_CURRENT,
    description: current === null ? 'Starting with an empty list' : `Starting at head node ${current.value}`,
  };

  while (current !== null) {
    yield {
      type: 'compare',
      nodeId: current.id,
      line: DOUBLY_LINE_NUMBERS.SEARCH.LOOP_START,
      description: `Comparing ${current.value} with ${value}`,
    };

    if (current.value === value) {
      yield {
        type: 'found',
        nodeId: current.id,
        line: DOUBLY_LINE_NUMBERS.SEARCH.FOUND,
        description: `Found ${value} in the list`,
      };
      return true;
    }

    current = current.next;
    yield {
      type: 'move',
      nodeId: current?.id ?? null,
      line: DOUBLY_LINE_NUMBERS.SEARCH.ADVANCE,
      description: current === null ? 'Reached the end of the list' : `Moving to node ${current.value}`,
    };
  }

  yield {
    type: 'not-found',
    nodeId: null,
    line: DOUBLY_LINE_NUMBERS.SEARCH.NOT_FOUND,
    description: `${value} is not in the list`,
  };

  return false;
}

export function* doublyTraverseGenerator(
  head: DoublyLinkedListNode | null
): Generator<Step, number[], undefined> {
  const values: number[] = [];
  let current = head;

  yield {
    type: 'traverse',
    nodeId: null,
    line: DOUBLY_LINE_NUMBERS.TRAVERSE.INIT_VALUES,
    description: 'Preparing traversal result array',
  };

  yield {
    type: 'visit',
    nodeId: current?.id ?? null,
    line: DOUBLY_LINE_NUMBERS.TRAVERSE.INIT_CURRENT,
    description: current === null ? 'List is empty' : `Starting traversal at head node ${current.value}`,
  };

  while (current !== null) {
    values.push(current.value);
    yield {
      type: 'traverse',
      nodeId: current.id,
      line: DOUBLY_LINE_NUMBERS.TRAVERSE.VISIT,
      description: `Adding ${current.value} to the traversal result`,
    };

    current = current.next;
    yield {
      type: 'move',
      nodeId: current?.id ?? null,
      line: DOUBLY_LINE_NUMBERS.TRAVERSE.ADVANCE,
      description: current === null ? 'Traversal complete' : `Moving to node ${current.value}`,
    };
  }

  yield {
    type: 'traverse',
    nodeId: null,
    line: DOUBLY_LINE_NUMBERS.TRAVERSE.RETURN_VALUES,
    description: `Traversal result: [${values.join(', ')}]`,
  };

  return values;
}
