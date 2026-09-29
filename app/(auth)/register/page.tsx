import { AuthShell } from '@/components/auth/AuthShell'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthShell
      heading="Crea tu cuenta en un minuto."
      description="Solo necesitas un correo y una contraseña. Tus casos solo los ves tú."
    >
      <RegisterForm />
    </AuthShell>
  )
}
