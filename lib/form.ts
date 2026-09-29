import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '@/lib/api'
import { errorMessage, fieldMessage } from '@/lib/messages.es'

// A top-level API code that belongs next to a specific field, not as a notice.
// The API reports EMAIL_TAKEN at the top level; the register screen shows it
// under the email field, as the design does.
const CODE_TO_FIELD: Record<string, string> = {
  EMAIL_TAKEN: 'email',
}

/**
 * Places an error where the design says it goes: validation errors next to
 * their field, everything else as a form-level notice (RF-18, RF-19).
 * One function, so every form behaves the same.
 */
export function applyApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): void {
  if (!(error instanceof ApiError)) {
    setError('root', { message: errorMessage('UNEXPECTED_ERROR') })
    return
  }

  for (const fieldError of error.fieldErrors) {
    if (fieldError.field === '(root)') {
      setError('root', { message: fieldMessage(fieldError.code, fieldError.params) })
    } else {
      setError(fieldError.field as Path<T>, {
        message: fieldMessage(fieldError.code, fieldError.params),
      })
    }
  }

  // A VALIDATION_ERROR already placed its field errors; nothing else to show.
  if (error.fieldErrors.length > 0) {
    return
  }

  const field = CODE_TO_FIELD[error.code]
  if (field) {
    setError(field as Path<T>, {
      message: errorMessage(error.code, error.params),
    })
  } else {
    setError('root', { message: errorMessage(error.code, error.params) })
  }
}
