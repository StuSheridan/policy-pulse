export default function CtaBanner() {
  return (
    <div
      className="text-center mt-8 mb-8"
      style={{
        background: '#3B82F6',
        borderRadius: '8px',
        padding: '24px'
      }}
    >
      <p
        className="text-white mb-4"
        style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px' }}
      >
        Audit your own content for less than a coffee a day at Checkedit.ai
      </p>
      <a
        href="https://checkedit.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
        style={{
          background: 'white',
          color: '#3B82F6',
          fontFamily: 'Montserrat, sans-serif'
        }}
      >
        Try Checkedit →
      </a>
    </div>
  )
}
