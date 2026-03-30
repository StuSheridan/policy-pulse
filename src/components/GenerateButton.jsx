export default function GenerateButton({ loading, loadingStage, onClick }) {
  return (
    <div className="text-center py-6">
      <button
        onClick={onClick}
        disabled={loading}
        className="px-8 py-3 rounded-lg text-white font-semibold text-base transition-all duration-200 disabled:opacity-70"
        style={{
          backgroundColor: '#3B82F6',
          fontFamily: 'Montserrat, sans-serif',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? (
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {loadingStage}
          </span>
        ) : (
          "Generate this week's issue"
        )}
      </button>
      {loading && (
        <p className="mt-3 text-xs" style={{ color: '#9CA3AF' }}>
          This usually takes 20–30 seconds — scraping 5 live sources.
        </p>
      )}
    </div>
  )
}
