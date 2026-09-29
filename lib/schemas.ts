import * as z from 'zod'

// Mirrors evidence-manager-api's auth.schema.ts. Duplicated on purpose: the
// repositories are independent and publishing a shared package would couple
// their builds. The server validates again, always (RNF-04); this is only fast
// feedback for the honest user.

const email = z
  .string()
  .trim()
  .max(254, 'Correo demasiado largo')
  .toLowerCase()
  .pipe(z.email('Correo no válido'))

const password = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .max(72, 'Máximo 72 caracteres')

export const registerSchema = z.object({ email, password })

// The password is only required here: the policy is enforced when it is set,
// and one stored under an older policy must still sign in.
export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Escribe tu contraseña'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
