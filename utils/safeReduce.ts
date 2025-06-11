// utils/safeReduce.ts

/**
 * Safely reduces over an array, protecting against undefined/null values.
 * @param arr The input array
 * @param reducer Reducer function (prev, curr)
 * @param initial Initial accumulator value
 * @returns Reduced result or initial value if input is invalid
 */
export function safeReduce<T, U>(
  arr: T[] | undefined | null,
  reducer: (acc: U, value: T, index: number, array: T[]) => U,
  initial: U
): U {
  if (!Array.isArray(arr)) return initial;
  return arr.reduce((acc, value, index) => {
    if (value == null) return acc;
    return reducer(acc, value, index, arr);
  }, initial);
}
