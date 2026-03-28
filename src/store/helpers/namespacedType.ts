/* =============== Пространства имен store ============= */

// Формирование namespaced типа Vuex
export function getNamespacedType(moduleName: string, type: string): string {
  return `${moduleName}/${type}`
}
