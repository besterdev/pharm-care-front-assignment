import { TriangleAlert } from 'lucide-react'

export const DataQualityAlert = ({ issueCount }: { issueCount: number }) => {
  if (issueCount === 0) return null

  return (
    <div
      className="mb-4 flex items-start gap-2 rounded-xl border border-[#f2d7a6] bg-[#fffaf0] px-3 py-2.5 text-[11px] leading-relaxed text-[#785c28]"
      role="alert"
    >
      <TriangleAlert className="mt-0.5 shrink-0 text-[#bc7a1e]" size={16} />
      <p>
        <strong>
          {issueCount} data issue{issueCount > 1 ? 's' : ''} detected.
        </strong>{' '}
        Affected cards show safe fallbacks; records without a unique task ID
        cannot be updated until corrected.
      </p>
    </div>
  )
}
