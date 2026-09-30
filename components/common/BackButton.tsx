'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/common/Button'

// The secondary way out of the 404: go back in the browser history.
export function BackButton() {
  const router = useRouter()

  return (
    <Button type="button" variant="outline" onClick={() => router.back()}>
      <ArrowLeft className="size-4" />
      Volver atrás
    </Button>
  )
}
