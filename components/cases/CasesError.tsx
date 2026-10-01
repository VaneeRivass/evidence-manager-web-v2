import { CloudOff, RotateCw } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ApiError } from '@/lib/api'

// The error state: the API code in sight and, when the action can be repeated,
// a retry. Never a blank screen (RF-15). A failure that never reached the API
// has no code: it is a network error. The copy comes from the caller, so the
// list ("your cases") and the case detail ("this case") can say different things.
export function CasesError({
  error,
  onRetry,
  title = 'No pudimos cargar tus casos',
  message = 'Puede ser un problema de conexión. Tus datos están a salvo; vuelve a intentarlo.',
}: {
  error: unknown
  onRetry?: () => void
  title?: string
  message?: string
}) {
  const code = error instanceof ApiError ? error.code : 'NETWORK_ERROR'

  return (
    <div className="grid justify-items-center gap-2.5 rounded-2xl border border-line bg-card px-6 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-danger-soft text-danger">
        <CloudOff className="size-7" />
      </span>
      <h3 className="text-[17px] font-bold text-ink">{title}</h3>
      <p className="max-w-[46ch] text-[13px] text-muted">{message}</p>
      <code className="rounded-md bg-canvas px-2 py-0.5 font-mono text-[11.5px] text-slate-ink">
        {code}
      </code>
      {onRetry ? (
        <Button type="button" variant="outline" className="mt-1" onClick={onRetry}>
          <RotateCw className="size-4" />
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}
