/* =============== Общие утилиты ============= */

// Диапазон чисел для пагинации
export function range(start: number, end: number): number[] {
  const length = Math.max(end - start + 1, 0)

  return Array.from({ length }, (_, index) => index + start)
}
