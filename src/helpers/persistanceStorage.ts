/* =============== Работа с localStorage ============= */

// Ключи localStorage
export type StorageKey = 'accessToken'

// Чтение данных из localStorage
export function getItem<T>(key: StorageKey): T | null {
  try {
    const rawValue = localStorage.getItem(key)

    if (rawValue === null) {
      return null
    }

    return JSON.parse(rawValue) as T
  } catch {
    return null
  }
}

// Сохранение данных в localStorage
export function setItem(key: StorageKey, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    return
  }
}

// Удаление данных из localStorage
export function removeItem(key: StorageKey): void {
  try {
    localStorage.removeItem(key)
  } catch {
    return
  }
}
