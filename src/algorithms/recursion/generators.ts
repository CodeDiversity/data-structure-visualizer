import { RecursionExample, RecursionFrame, Step } from '../../types';

export const RECURSION_LINE_NUMBERS = {
  FUNCTION_CALL: 1,
  BASE_CASE: 2,
  BASE_RETURN: 3,
  RECURSIVE_RETURN: 6,
};

export function* factorialGenerator(
  input: number
): Generator<Step, { result: number }, undefined> {
  const frames: RecursionFrame[] = [];
  let nextId = 0;

  function* factorial(n: number, depth: number): Generator<Step, number, undefined> {
    const frameId = `frame-${nextId}`;
    nextId += 1;

    frames.push({
      id: frameId,
      label: `factorial(${n})`,
      depth,
      status: 'calling',
      result: null,
    });

    yield createStep(frameId, input, 'factorial', frames, null, RECURSION_LINE_NUMBERS.FUNCTION_CALL, `Call factorial(${n})`);

    if (n <= 1) {
      updateFrame(frames, frameId, 'base', 1);
      yield createStep(frameId, input, 'factorial', frames, 1, RECURSION_LINE_NUMBERS.BASE_CASE, `Base case reached: factorial(${n}) = 1`, 'found');

      frames.pop();
      yield createStep(frameId, input, 'factorial', frames, 1, RECURSION_LINE_NUMBERS.BASE_RETURN, `Return 1 from factorial(${n})`, 'move');
      return 1;
    }

    const childResult = yield* factorial(n - 1, depth + 1);
    const result = n * childResult;

    updateFrame(frames, frameId, 'returning', result);
    yield createStep(frameId, input, 'factorial', frames, result, RECURSION_LINE_NUMBERS.RECURSIVE_RETURN, `Resolve factorial(${n}) = ${n} * ${childResult} = ${result}`, 'move');

    frames.pop();
    return result;
  }

  const result = yield* factorial(input, 0);
  return { result };
}

export function* fibonacciGenerator(
  input: number
): Generator<Step, { result: number }, undefined> {
  const frames: RecursionFrame[] = [];
  let nextId = 0;

  function* fibonacci(n: number, depth: number): Generator<Step, number, undefined> {
    const frameId = `frame-${nextId}`;
    nextId += 1;

    frames.push({
      id: frameId,
      label: `fibonacci(${n})`,
      depth,
      status: 'calling',
      result: null,
    });

    yield createStep(frameId, input, 'fibonacci', frames, null, RECURSION_LINE_NUMBERS.FUNCTION_CALL, `Call fibonacci(${n})`);

    if (n <= 1) {
      updateFrame(frames, frameId, 'base', n);
      yield createStep(frameId, input, 'fibonacci', frames, n, RECURSION_LINE_NUMBERS.BASE_CASE, `Base case reached: fibonacci(${n}) = ${n}`, 'found');

      frames.pop();
      yield createStep(frameId, input, 'fibonacci', frames, n, RECURSION_LINE_NUMBERS.BASE_RETURN, `Return ${n} from fibonacci(${n})`, 'move');
      return n;
    }

    const left = yield* fibonacci(n - 1, depth + 1);
    const right = yield* fibonacci(n - 2, depth + 1);
    const result = left + right;

    updateFrame(frames, frameId, 'returning', result);
    yield createStep(frameId, input, 'fibonacci', frames, result, RECURSION_LINE_NUMBERS.RECURSIVE_RETURN, `Resolve fibonacci(${n}) = ${left} + ${right} = ${result}`, 'move');

    frames.pop();
    return result;
  }

  const result = yield* fibonacci(input, 0);
  return { result };
}

export function* sumToNGenerator(
  input: number
): Generator<Step, { result: number }, undefined> {
  const frames: RecursionFrame[] = [];
  let nextId = 0;

  function* sumToN(n: number, depth: number): Generator<Step, number, undefined> {
    const frameId = `frame-${nextId}`;
    nextId += 1;

    frames.push({
      id: frameId,
      label: `sumToN(${n})`,
      depth,
      status: 'calling',
      result: null,
    });

    yield createStep(frameId, input, 'sum-to-n', frames, null, RECURSION_LINE_NUMBERS.FUNCTION_CALL, `Call sumToN(${n})`);

    if (n <= 0) {
      updateFrame(frames, frameId, 'base', 0);
      yield createStep(frameId, input, 'sum-to-n', frames, 0, RECURSION_LINE_NUMBERS.BASE_CASE, `Base case reached: sumToN(${n}) = 0`, 'found');

      frames.pop();
      yield createStep(frameId, input, 'sum-to-n', frames, 0, RECURSION_LINE_NUMBERS.BASE_RETURN, `Return 0 from sumToN(${n})`, 'move');
      return 0;
    }

    const childResult = yield* sumToN(n - 1, depth + 1);
    const result = n + childResult;

    updateFrame(frames, frameId, 'returning', result);
    yield createStep(frameId, input, 'sum-to-n', frames, result, RECURSION_LINE_NUMBERS.RECURSIVE_RETURN, `Resolve sumToN(${n}) = ${n} + ${childResult} = ${result}`, 'move');

    frames.pop();
    return result;
  }

  const result = yield* sumToN(input, 0);
  return { result };
}

function createStep(
  nodeId: string,
  input: number,
  example: RecursionExample,
  frames: RecursionFrame[],
  result: number | null,
  line: number,
  description: string,
  type: Step['type'] = 'visit'
): Step {
  return {
    type,
    nodeId,
    line,
    description,
    recursionExample: example,
    recursionInput: input,
    recursionFramesSnapshot: cloneFrames(frames),
    recursionResult: result,
  };
}

function cloneFrames(frames: RecursionFrame[]): RecursionFrame[] {
  return frames.map((frame) => ({ ...frame }));
}

function updateFrame(
  frames: RecursionFrame[],
  frameId: string,
  status: RecursionFrame['status'],
  result: number
) {
  const frame = frames.find((item) => item.id === frameId);
  if (!frame) {
    return;
  }

  frame.status = status;
  frame.result = result;
}
