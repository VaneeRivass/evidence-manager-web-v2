'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ChosenFile } from '@/components/cases/ChosenFile'
import { EvidenceDropZone } from '@/components/cases/EvidenceDropZone'
import { UploadProgress } from '@/components/cases/UploadProgress'
import { VerifiedFile } from '@/components/cases/VerifiedFile'
import { useDownloadEvidence, useUploadEvidence } from '@/hooks/useFileUpload'
import { ApiError } from '@/lib/api'
import { validateEvidenceFile } from '@/lib/files'
import { errorMessage } from '@/lib/messages.es'
import type { Case } from '@/lib/schemas'

// The evidence of one case, as the design shows it: a drop zone that becomes a
// chosen file, then a single progress bar, then the verified file. To the person
// it is one action; behind it are three calls (RF-17).
//
// This component only orchestrates: it holds the picked file and picks which view
// to show. Each view lives in its own file.
//
// Validation errors stay next to the zone (they are the person's to fix, RF-18);
// operation errors become a floating notice with a retry (RF-19).
export function EvidencePanel({ caseItem }: { caseItem: Case }) {
  const [selected, setSelected] = useState<File | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const { start, phase, progress } = useUploadEvidence(caseItem.id)
  const { download, downloading } = useDownloadEvidence(caseItem.id)

  const choose = (file: File) => {
    const error = validateEvidenceFile(file)
    setFieldError(error)
    setSelected(error ? null : file)
  }

  const attach = async () => {
    if (!selected) {
      return
    }
    const result = await start(selected)
    if (result.ok) {
      setSelected(null)
      toast.success('Evidencia adjuntada', {
        description: 'El archivo ya está en el caso.',
      })
      return
    }
    const error = result.error
    const code = error instanceof ApiError ? error.code : 'UPLOAD_FAILED'
    const params = error instanceof ApiError ? error.params : undefined
    toast.error(errorMessage(code, params), {
      description: <span className="font-mono text-[11px]">{code}</span>,
      action: { label: 'Reintentar', onClick: () => void attach() },
    })
  }

  if (caseItem.fileName) {
    return (
      <VerifiedFile
        name={caseItem.fileName}
        size={caseItem.fileSize}
        type={caseItem.fileType}
        onDownload={download}
        downloading={downloading}
      />
    )
  }

  if (phase !== 'idle') {
    return <UploadProgress file={selected} phase={phase} progress={progress} />
  }

  if (selected) {
    return (
      <ChosenFile
        file={selected}
        onDiscard={() => {
          setSelected(null)
          setFieldError(null)
        }}
        onAttach={attach}
      />
    )
  }

  return <EvidenceDropZone onChoose={choose} fieldError={fieldError} />
}
