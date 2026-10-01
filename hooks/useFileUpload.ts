import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { ApiError, api, uploadToStorage, type UploadTarget } from '@/lib/api'
import { errorMessage } from '@/lib/messages.es'
import type { Case } from '@/lib/schemas'

// What the person sees as one action, in phases: asking for the link, uploading
// the bytes, and letting the server verify. The screen only shows one bar.
export type UploadPhase = 'idle' | 'requesting' | 'uploading' | 'confirming'

// RF-17 · the three calls of the upload live here and nowhere else. The
// component calls start(file) and watches `phase` and `progress`; it never
// builds a request.
export function useUploadEvidence(caseId: string) {
  const queryClient = useQueryClient()
  const [phase, setPhase] = useState<UploadPhase>('idle')
  const [progress, setProgress] = useState(0)

  const start = async (file: File) => {
    setPhase('requesting')
    setProgress(0)

    try {
      // 1 · Ask permission to upload.
      const target = await api.post<UploadTarget>(
        `/api/cases/${caseId}/file/upload-url`,
        { fileName: file.name, contentType: file.type, size: file.size },
      )

      // 2 · Upload the binary straight to storage, without credentials.
      setPhase('uploading')
      await uploadToStorage(target.uploadUrl, file, setProgress)

      // 3 · Confirm, with the key the API signed.
      setPhase('confirming')
      const updated = await api.post<Case>(
        `/api/cases/${caseId}/file/complete`,
        { key: target.key },
      )

      queryClient.setQueryData(['case', updated.id], updated)
      await queryClient.invalidateQueries({ queryKey: ['cases'] })

      setPhase('idle')
      setProgress(0)
      return { ok: true as const }
    } catch (error) {
      setPhase('idle')
      setProgress(0)
      return { ok: false as const, error }
    }
  }

  return { start, phase, progress }
}

// RF-12 · the download asks for a fresh, short-lived link on every click. The
// person never sees the link or its expiry: the browser just saves the file.
export function useDownloadEvidence(caseId: string) {
  const [downloading, setDownloading] = useState(false)

  const download = async () => {
    setDownloading(true)
    try {
      const { downloadUrl } = await api.get<{
        downloadUrl: string
        expiresIn: number
      }>(`/api/cases/${caseId}/file/download-url`)
      window.location.assign(downloadUrl)
    } catch (error) {
      // Asking for the link can fail too. Say so, instead of leaving an
      // unhandled rejection with no feedback.
      toast.error(
        error instanceof ApiError
          ? errorMessage(error.code, error.params)
          : errorMessage('UNEXPECTED_ERROR'),
      )
    } finally {
      setDownloading(false)
    }
  }

  return { download, downloading }
}
