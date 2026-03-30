export default function SectionCard({ headline, summary, action, source, url, sector_tags }) {
  return (
    <div
      className="mb-4 p-4"
      style={{
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: '8px'
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        {source && (
          <span
            className="inline-block px-2 py-0.5 rounded-full"
            style={{ background: '#F3F4F5', color: '#6B7280', fontSize: '11px', fontFamily: 'Roboto, sans-serif' }}
          >
            {source}
          </span>
        )}
        <div className="flex flex-wrap gap-1">
          {sector_tags?.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 rounded-full"
              style={{ background: '#EFF6FF', color: '#3B82F6', fontSize: '11px', fontFamily: 'Roboto, sans-serif' }}
            >
              {tag?.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      <h3
        className="font-bold mb-1"
        style={{ fontSize: '15px', color: '#1F2937', fontFamily: 'Montserrat, sans-serif' }}
      >
        {headline}
      </h3>

      <p
        className="mb-3"
        style={{ fontSize: '13px', color: '#4B5563', fontFamily: 'Open Sans, sans-serif' }}
      >
        {summary}
      </p>

      {action && (
        <div
          className="mb-3"
          style={{
            borderLeft: '3px solid #3B82F6',
            paddingLeft: '10px',
            fontSize: '13px',
            color: '#374151',
            fontFamily: 'Open Sans, sans-serif'
          }}
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
            className="text-xs hover:underline"
            style={{ color: '#3B82F6' }}
          >
            View source →
          </a>
        </div>
      )}
    </div>
  )
}
