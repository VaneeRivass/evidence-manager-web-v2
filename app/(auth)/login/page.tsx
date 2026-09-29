import { AuthShell } from '@/components/auth/AuthShell'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthShell
      heading="Cada caso, con su evidencia a mano."
      description="Registra incidencias, adjunta el archivo que las respalda y ciérralas cuando estén resueltas."
    >
      <LoginForm />
    </AuthShell>
  )
}
