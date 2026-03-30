export default function LoadingSection() {
  return (
    <div className="animate-pulse rounded-lg p-4 mb-4" style={{ background: '#E5E7EB', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
      <div className="h-4 rounded w-3/4 mb-3" style={{ background: '#D1D5DB' }} />
      <div className="h-3 rounded w-full mb-2" style={{ background: '#D1D5DB' }} />
      <div className="h-3 rounded w-5/6 mb-2" style={{ background: '#D1D5DB' }} />
      <div className="h-3 rounded w-2/3" style={{ background: '#D1D5DB' }} />
    </div>
  )
}
