'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { AuthField } from '@/components/auth/AuthField'
import { useLogin } from '@/hooks/useSession'
import { applyApiError } from '@/lib/form'
import { loginSchema, type LoginInput } from '@/lib/schemas'

export function LoginForm() {
  const router = useRouter()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values)
      router.push('/cases')
    } catch (error) {
      applyApiError(error, setError)
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Entrar</h1>
        <p className="mt-1 text-sm text-muted">
          Usa el correo con el que te registraste.
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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {errors.root?.message ? (
        <p className="rounded-xl bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {errors.root.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(79,104,241,.28)] transition hover:bg-brand-strong disabled:opacity-60"
      >
        Entrar
      </button>

      <p className="text-center text-sm text-muted">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="font-semibold text-brand">
          Regístrate
        </Link>
      </p>
    </form>
  )
}
