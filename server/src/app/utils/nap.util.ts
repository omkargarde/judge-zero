/**
 * Returns a promise that resolves after a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep before resolving the promise.
 * @returns A promise that resolves after the specified delay.
 *
 * @example
 * ```typescript
 * await Nap(1000); // Pauses execution for 1 second
 * ```
 */
async function Nap(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
export { Nap }
