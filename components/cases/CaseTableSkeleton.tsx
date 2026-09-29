import type { ReactNode } from 'react'

// Loading is a skeleton with the same shape as the table, so the page does not
// jump when the data arrives. Not the word "loading" (RF-15).
function Skeleton({ className }: { className: string }) {
  return (
    <span
      className={`block animate-pulse rounded-full bg-line ${className}`}
      aria-hidden
    />
  )
}

function SkeletonRow(): ReactNode {
  return (
    <tr className="border-t border-line">
      <td className="px-4 py-3.5">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="mt-2 h-2.5 w-full" />
      </td>
      <td className="px-4 py-3.5">
        <Skeleton className="h-5 w-16" />
      </td>
      <td className="px-4 py-3.5">
        <Skeleton className="h-3 w-3/4" />
      </td>
      <td className="px-4 py-3.5">
        <Skeleton className="h-3 w-12" />
      </td>
    </tr>
  )
}

export function CaseTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="w-[44%] px-4 py-3 font-semibold">Caso</th>
            <th className="w-[14%] px-4 py-3 font-semibold">Estado</th>
            <th className="w-[28%] px-4 py-3 font-semibold">Evidencia</th>
            <th className="w-[14%] px-4 py-3 font-semibold">Actualizado</th>
          </tr>
        </thead>
        <tbody>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </tbody>
      </table>
    </div>
  )
}
