import { ArrowRight } from 'lucide-react'

export default function CtaBanner() {
  return (
    <div className="bg-blue-500 text-white rounded-xl p-6 text-center mt-8 mb-8">
      <p
        className="text-white mb-4 text-base"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        Audit your own content for less than a coffee a day at Checkedit.ai
      </p>
      <a
        href="https://checkedit.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white text-blue-500 px-6 py-2 rounded-lg font-medium text-sm transition-all hover:opacity-90"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        Try Checkedit <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  )
}
