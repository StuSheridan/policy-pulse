import { Loader2, Sparkles } from 'lucide-react'

export default function GenerateButton({ loading, loadingStage, onClick }) {
  return (
    <div className="text-center py-6">
      <button
        onClick={onClick}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white rounded px-6 py-3 font-medium text-base transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {loading ? (
          <span className="flex items-center gap-3">
            <Loader2 className="animate-spin h-5 w-5 text-white" />
            {loadingStage}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate this week's issue
          </span>
        )}
      </button>
      {loading && (
        <p className="mt-3 text-xs text-gray-400" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          This usually takes 20–30 seconds — scraping 5 live sources.
        </p>
      )}
    </div>
  )
}
