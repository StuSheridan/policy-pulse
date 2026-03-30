import { ExternalLink } from 'lucide-react'

export default function SectionCard({ headline, summary, action, source, url, sector_tags }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        {source && (
          <span className="bg-gray-100 text-gray-500 text-xs rounded-full px-2 py-0.5">
            {source}
          </span>
        )}
        <div className="flex flex-wrap gap-1">
          {sector_tags?.map((tag) => (
            <span
              key={tag}
              className="bg-blue-50 text-blue-500 text-xs rounded-full px-2 py-0.5"
            >
              {tag?.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      <h3
        className="font-bold text-gray-800 mb-1"
        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px' }}
      >
        {headline}
      </h3>

      <p
        className="text-base text-gray-600 mb-3"
        style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px' }}
      >
        {summary}
      </p>

      {action && (
        <div
          className="border-l-4 border-blue-500 pl-3 mb-3 text-sm text-gray-700"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          <strong>What to do:</strong> {action}
        </div>
      )}

      {url && (
        <div className="text-right">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
          >
            View source <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  )
}
