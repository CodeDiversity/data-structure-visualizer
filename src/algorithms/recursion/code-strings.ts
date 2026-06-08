export const FACTORIAL_RECURSION_CODE = `function factorial(n) {
  if (n <= 1) {
    return 1;
  }

  return n * factorial(n - 1);
}`;

export const FIBONACCI_RECURSION_CODE = `function fibonacci(n) {
  if (n <= 1) {
    return n;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}`;

export const SUM_TO_N_RECURSION_CODE = `function sumToN(n) {
  if (n <= 0) {
    return 0;
  }

  return n + sumToN(n - 1);
}`;
