import { Newspaper } from 'lucide-react'

export default function Header({ weekNumber }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-AU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <header className="text-center py-8">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Newspaper className="w-7 h-7 text-blue-500" />
        <h1
          className="text-2xl md:text-3xl font-bold text-gray-800"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          PolicyPulse{' '}
          <span className="font-semibold text-lg text-gray-500">
            by Checkedit
          </span>
        </h1>
      </div>
      <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: 'Open Sans, sans-serif' }}>
        {dateStr} — Week {weekNumber || '—'}, {now.getFullYear()}
      </p>
    </header>
  )
}
