// The API emits stable codes with parameters (RF-23); this is the only file
// that turns them into sentences. Everything a person reads is composed here,
// in Spanish. `params` are what make a number interpolable.

type Params = Record<string, unknown>

/** A validation error, shown next to the field that caused it (RF-18). */
export function fieldMessage(code: string, params?: Params): string {
  switch (code) {
    case 'TOO_SHORT':
      return `Mínimo ${String(params?.min ?? '')} caracteres`
    case 'TOO_LONG':
      return `Máximo ${String(params?.max ?? '')} caracteres`
    case 'INVALID_FORMAT':
      return 'Formato no válido'
    case 'INVALID_TYPE':
      return 'Tipo no válido'
    case 'UNKNOWN_FIELD':
      return 'Campo no reconocido'
    case 'NOTHING_TO_CHANGE':
      return 'No hay cambios que guardar'
    default:
      return 'Valor no válido'
  }
}

/** An operation error, shown as a floating notice (RF-19). */
export function errorMessage(code: string, params?: Params): string {
  switch (code) {
    case 'EMAIL_TAKEN':
      return 'Ya existe una cuenta con este correo.'
    case 'INVALID_CREDENTIALS':
      return 'Correo o contraseña incorrectos.'
    case 'UNAUTHENTICATED':
      return 'Tu sesión ha caducado. Vuelve a entrar.'
    case 'VALIDATION_ERROR':
      return 'Revisa los campos marcados.'
    case 'UNREADABLE_BODY':
      return 'No pudimos leer la petición.'
    case 'PAYLOAD_TOO_LARGE':
      return `El contenido supera el máximo de ${String(params?.max ?? '')} bytes.`
    case 'INTERNAL_ERROR':
      return 'Algo falló en el servidor. Inténtalo de nuevo.'
    case 'FILE_ALREADY_ATTACHED':
      return 'Este caso ya tiene una evidencia adjunta y no se puede reemplazar.'
    case 'FILE_TYPE_NOT_ALLOWED':
      return 'Formato no admitido. Solo se admiten PDF, JPG o PNG.'
    case 'FILE_TOO_LARGE':
      return 'El archivo supera el tamaño máximo permitido.'
    case 'FILE_REJECTED':
      return 'El servidor rechazó el archivo al verificarlo. Prueba con otro.'
    case 'FILE_NOT_UPLOADED':
      return 'El archivo no llegó al almacenamiento. Inténtalo de nuevo.'
    case 'FILE_KEY_MISMATCH':
      return 'No pudimos verificar el archivo. Inténtalo de nuevo.'
    case 'FILE_NOT_FOUND':
      return 'Este caso no tiene ninguna evidencia.'
    case 'UPLOAD_FAILED':
      return 'Se interrumpió la subida. Comprueba la conexión e inténtalo de nuevo.'
    default:
      return 'Algo salió mal. Inténtalo de nuevo.'
  }
}

// Failures the API never saw: the request did not arrive, so there is no code to
// switch on. The client owns these texts, so they live here too.
export const clientMessages = {
  logoutFailed: 'No pudimos cerrar la sesión. Inténtalo de nuevo.',
  deleteCaseFailed: 'No pudimos eliminar el caso. Inténtalo de nuevo.',
}
