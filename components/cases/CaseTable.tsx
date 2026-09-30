import Link from 'next/link'
import { CaseStatusPill } from '@/components/cases/CaseStatusPill'
import { FileChip } from '@/components/cases/FileChip'
import { formatRelative } from '@/lib/format'
import type { Case } from '@/lib/schemas'

// The list with data. table-fixed gives each column a stable width, so long
// titles and dates do not squeeze the others. The row links to the detail via a
// real <a> on the title (keyboard works).
export function CaseTable({ cases }: { cases: Case[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-card">
      <table className="w-full min-w-[640px] table-fixed border-collapse">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="w-[44%] px-4 py-3 font-semibold">Caso</th>
            <th className="w-[14%] px-4 py-3 font-semibold">Estado</th>
            <th className="w-[28%] px-4 py-3 font-semibold">Evidencia</th>
            <th className="w-[14%] px-4 py-3 font-semibold">Actualizado</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item) => (
            <tr key={item.id} className="border-t border-line transition hover:bg-canvas">
              <td className="px-4 py-3.5">
                <Link href={`/cases/${item.id}`} className="block">
                  <span className="block truncate font-semibold text-ink">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[12.5px] text-muted">
                    {item.description}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3.5">
                <CaseStatusPill status={item.status} />
              </td>
              <td className="px-4 py-3.5">
                <FileChip name={item.fileName} size={item.fileSize} type={item.fileType} />
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-muted">
                {formatRelative(item.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
