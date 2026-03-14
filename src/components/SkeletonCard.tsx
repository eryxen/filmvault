export default function SkeletonCard() {
  return (
    <div className="flex-shrink-0">
      <div className="aspect-[2/3] rounded-2xl skeleton" style={{ width: '160px' }} />
      <div className="mt-2 space-y-1">
        <div className="h-3 skeleton rounded w-3/4" />
        <div className="h-2 skeleton rounded w-1/2" />
      </div>
    </div>
  )
}
