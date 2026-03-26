import { ValidationErrors } from '@/types/domain'

/* =============== Работа с ошибками API ============= */

// Ошибка Axios с ответом от бэка
interface ErrorResponseShape {
  response?: {
    data?: {
      errors?: ValidationErrors
    }
  }
  message?: string
}

// Проверка структуры ошибки
function isErrorResponseShape(error: unknown): error is ErrorResponseShape {
  return typeof error === 'object' && error !== null
}

// Ошибки валидации от бэка
export function getValidationErrors(error: unknown): ValidationErrors | null {
  if (!isErrorResponseShape(error)) {
    return null
  }

  return error.response?.data?.errors ?? null
}

// Текст ошибки для интерфейса
export function getErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (!isErrorResponseShape(error)) {
    return fallbackMessage
  }

  return error.message ?? fallbackMessage
}
