export default function Header({ weekNumber }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-AU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <header className="text-center py-8">
      <h1
        className="text-2xl md:text-3xl font-bold"
        style={{ fontFamily: 'Montserrat, sans-serif', color: '#1F2937' }}
      >
        PolicyPulse{' '}
        <span className="font-semibold text-lg" style={{ color: '#6B7280' }}>
          by Checkedit
        </span>
      </h1>
      <p className="mt-2 text-sm" style={{ color: '#6B7280', fontFamily: 'Open Sans, sans-serif' }}>
        {dateStr} — Week {weekNumber || '—'}, {now.getFullYear()}
      </p>
    </header>
  )
}
