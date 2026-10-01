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
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="w-[46%] px-4 py-3 font-semibold">Caso</th>
            <th className="w-[16%] px-4 py-3 font-semibold">Estado</th>
            <th className="hidden w-[24%] px-4 py-3 font-semibold md:table-cell">
              Evidencia
            </th>
            <th className="hidden w-[14%] px-4 py-3 font-semibold sm:table-cell">
              Actualizado
            </th>
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
                  {/* Always reachable for a screen reader, even when its column
                      is hidden on small screens. */}
                  <span className="sr-only md:hidden">
                    {item.fileName ? `Evidencia: ${item.fileName}.` : 'Sin evidencia.'}
                  </span>
                  <span className="sr-only sm:hidden">
                    Actualizado {formatRelative(item.updatedAt)}.
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3.5">
                <CaseStatusPill status={item.status} />
              </td>
              <td className="hidden px-4 py-3.5 md:table-cell">
                <FileChip name={item.fileName} size={item.fileSize} type={item.fileType} />
              </td>
              <td className="hidden whitespace-nowrap px-4 py-3.5 text-[13px] text-muted sm:table-cell">
                {formatRelative(item.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
