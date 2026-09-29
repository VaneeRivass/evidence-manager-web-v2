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

// --- Cases (RF-05…RF-08) ----------------------------------------------------

export const caseStatusSchema = z.enum(['OPEN', 'CLOSED'])
export type CaseStatus = z.infer<typeof caseStatusSchema>

// The shape the API returns for a case. Mirrors cases.mapper.ts on the server.
export const caseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: caseStatusSchema,
  fileKey: z.string().nullable(),
  fileName: z.string().nullable(),
  fileSize: z.number().nullable(),
  fileType: z.string().nullable(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Case = z.infer<typeof caseSchema>

// Creation and editing share the same rules (RF-05, RF-08).
export const caseFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Escribe un título')
    .max(120, 'Máximo 120 caracteres'),
  description: z
    .string()
    .trim()
    .min(1, 'Escribe una descripción')
    .max(2000, 'Máximo 2000 caracteres'),
})
export type CaseFormInput = z.infer<typeof caseFormSchema>
