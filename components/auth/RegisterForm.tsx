'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { AuthField } from '@/components/auth/AuthField'
import { Button } from '@/components/common/Button'
import { useRegister } from '@/hooks/useSession'
import { applyApiError } from '@/lib/form'
import { registerSchema, type RegisterInput } from '@/lib/schemas'

export function RegisterForm() {
  const router = useRouter()
  const registerUser = useRegister()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerUser.mutateAsync(values)
      // Creating the account does not sign in; the person signs in next.
      router.push('/login')
    } catch (error) {
      applyApiError(error, setError)
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Crear cuenta</h1>
        <p className="mt-1 text-sm text-muted">
          Solo necesitas un correo y una contraseña.
        </p>
      </div>

      <AuthField
        id="email"
        label="Correo"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <AuthField
        id="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {errors.root?.message ? (
        <p className="rounded-xl bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {errors.root.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-muted">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold text-brand">
          Entrar
        </Link>
      </p>
    </form>
  )
}
