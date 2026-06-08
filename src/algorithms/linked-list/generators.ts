import { LinkedListNode, Step } from '../../types';
import { generateNodeId } from '../bst/bst';

export const LINKED_LIST_LINE_NUMBERS = {
  APPEND: {
    CREATE_NODE: 2,
    EMPTY_LIST: 4,
    INIT_CURRENT: 7,
    WALK_NEXT: 9,
    LINK_NODE: 12,
    RETURN_HEAD: 13,
  },
  DELETE: {
    EMPTY_LIST: 2,
    DELETE_HEAD: 6,
    INIT_CURRENT: 9,
    CHECK_NEXT: 11,
    UNLINK_NODE: 12,
    ADVANCE: 15,
    RETURN_HEAD: 18,
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

function cloneList(head: LinkedListNode | null): LinkedListNode | null {
  if (head === null) {
    return null;
  }

  return {
    ...head,
    next: cloneList(head.next),
  };
}

export function* linkedListAppendGenerator(
  head: LinkedListNode | null,
  value: number
): Generator<Step, LinkedListNode, undefined> {
  yield {
    type: 'insert',
    nodeId: null,
    line: LINKED_LIST_LINE_NUMBERS.APPEND.CREATE_NODE,
    description: `Creating new node with value ${value}`,
  };

  const newNode: LinkedListNode = {
    id: generateNodeId(),
    value,
    next: null,
  };

  if (head === null) {
    yield {
      type: 'insert',
      nodeId: newNode.id,
      line: LINKED_LIST_LINE_NUMBERS.APPEND.EMPTY_LIST,
      description: 'List is empty, new node becomes the head',
    };
    return newNode;
  }

  const nextHead = cloneList(head)!;
  let current = nextHead;

  yield {
    type: 'visit',
    nodeId: current.id,
    line: LINKED_LIST_LINE_NUMBERS.APPEND.INIT_CURRENT,
    description: `Starting at head node ${current.value}`,
  };

  while (current.next !== null) {
    yield {
      type: 'move',
      nodeId: current.id,
      line: LINKED_LIST_LINE_NUMBERS.APPEND.WALK_NEXT,
      description: `Node ${current.value} already points forward, moving to next node`,
    };
    current = current.next;
    yield {
      type: 'visit',
      nodeId: current.id,
      line: LINKED_LIST_LINE_NUMBERS.APPEND.WALK_NEXT,
      description: `Visiting node ${current.value}`,
    };
  }

  current.next = newNode;

  yield {
    type: 'insert',
    nodeId: newNode.id,
    line: LINKED_LIST_LINE_NUMBERS.APPEND.LINK_NODE,
    description: `Linking node ${current.value} to new node ${value}`,
  };

  yield {
    type: 'move',
    nodeId: nextHead.id,
    line: LINKED_LIST_LINE_NUMBERS.APPEND.RETURN_HEAD,
    description: `Returning head node ${nextHead.value}`,
  };

  return nextHead;
}

export function* linkedListDeleteGenerator(
  head: LinkedListNode | null,
  value: number
): Generator<Step, LinkedListNode | null, undefined> {
  if (head === null) {
    yield {
      type: 'not-found',
      nodeId: null,
      line: LINKED_LIST_LINE_NUMBERS.DELETE.EMPTY_LIST,
      description: `List is empty, ${value} was not found`,
    };
    return null;
  }

  const nextHead = cloneList(head)!;

  if (nextHead.value === value) {
    yield {
      type: 'delete',
      nodeId: nextHead.id,
      line: LINKED_LIST_LINE_NUMBERS.DELETE.DELETE_HEAD,
      description: `Head node ${value} matches, removing it`,
    };
    return nextHead.next;
  }

  let current = nextHead;
  yield {
    type: 'visit',
    nodeId: current.id,
    line: LINKED_LIST_LINE_NUMBERS.DELETE.INIT_CURRENT,
    description: `Starting at head node ${current.value}`,
  };

  while (current.next !== null) {
    yield {
      type: 'compare',
      nodeId: current.next.id,
      line: LINKED_LIST_LINE_NUMBERS.DELETE.CHECK_NEXT,
      description: `Checking whether next node ${current.next.value} matches ${value}`,
    };

    if (current.next.value === value) {
      const deletedNodeId = current.next.id;
      current.next = current.next.next;
      yield {
        type: 'delete',
        nodeId: deletedNodeId,
        line: LINKED_LIST_LINE_NUMBERS.DELETE.UNLINK_NODE,
        description: `Unlinking node ${value} from the list`,
      };
      return nextHead;
    }

    current = current.next;
    yield {
      type: 'move',
      nodeId: current.id,
      line: LINKED_LIST_LINE_NUMBERS.DELETE.ADVANCE,
      description: `Moving to node ${current.value}`,
    };
  }

  yield {
    type: 'not-found',
    nodeId: null,
    line: LINKED_LIST_LINE_NUMBERS.DELETE.RETURN_HEAD,
    description: `Reached the end of the list, ${value} was not found`,
  };

  return nextHead;
}

export function* linkedListSearchGenerator(
  head: LinkedListNode | null,
  value: number
): Generator<Step, boolean, undefined> {
  let current = head;

  yield {
    type: 'visit',
    nodeId: current?.id ?? null,
    line: LINKED_LIST_LINE_NUMBERS.SEARCH.INIT_CURRENT,
    description: current === null ? 'Starting with an empty list' : `Starting at head node ${current.value}`,
  };

  while (current !== null) {
    yield {
      type: 'compare',
      nodeId: current.id,
      line: LINKED_LIST_LINE_NUMBERS.SEARCH.LOOP_START,
      description: `Comparing ${current.value} with ${value}`,
    };

    if (current.value === value) {
      yield {
        type: 'found',
        nodeId: current.id,
        line: LINKED_LIST_LINE_NUMBERS.SEARCH.FOUND,
        description: `Found ${value} in the list`,
      };
      return true;
    }

    current = current.next;
    yield {
      type: 'move',
      nodeId: current?.id ?? null,
      line: LINKED_LIST_LINE_NUMBERS.SEARCH.ADVANCE,
      description: current === null ? 'Reached the end of the list' : `Moving to node ${current.value}`,
    };
  }

  yield {
    type: 'not-found',
    nodeId: null,
    line: LINKED_LIST_LINE_NUMBERS.SEARCH.NOT_FOUND,
    description: `${value} is not in the list`,
  };

  return false;
}

export function* linkedListTraverseGenerator(
  head: LinkedListNode | null
): Generator<Step, number[], undefined> {
  const values: number[] = [];
  let current = head;

  yield {
    type: 'traverse',
    nodeId: null,
    line: LINKED_LIST_LINE_NUMBERS.TRAVERSE.INIT_VALUES,
    description: 'Preparing traversal result array',
  };

  yield {
    type: 'visit',
    nodeId: current?.id ?? null,
    line: LINKED_LIST_LINE_NUMBERS.TRAVERSE.INIT_CURRENT,
    description: current === null ? 'List is empty' : `Starting traversal at head node ${current.value}`,
  };

  while (current !== null) {
    values.push(current.value);
    yield {
      type: 'traverse',
      nodeId: current.id,
      line: LINKED_LIST_LINE_NUMBERS.TRAVERSE.VISIT,
      description: `Adding ${current.value} to the traversal result`,
    };

    current = current.next;
    yield {
      type: 'move',
      nodeId: current?.id ?? null,
      line: LINKED_LIST_LINE_NUMBERS.TRAVERSE.ADVANCE,
      description: current === null ? 'Traversal complete' : `Moving to node ${current.value}`,
    };
  }

  yield {
    type: 'traverse',
    nodeId: null,
    line: LINKED_LIST_LINE_NUMBERS.TRAVERSE.RETURN_VALUES,
    description: `Traversal result: [${values.join(', ')}]`,
  };

  return values;
}
