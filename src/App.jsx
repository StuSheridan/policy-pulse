import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { AlertCircle, Info } from 'lucide-react'
import Header from './components/Header'
import GenerateButton from './components/GenerateButton'
import IssuePreview from './components/IssuePreview'
import LoadingSection from './components/LoadingSection'

const LOADING_STAGES = [
  'Scraping Ad Standards...',
  'Scraping ACCC, ASIC, TGA, ABAC...',
  'Classifying items with AI...',
  'Building your issue...'
]

function getCurrentWeekNumber() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now - start
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7)
}

export default function App() {
  const [issueData, setIssueData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState('')
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (loading) {
      let idx = 0
      setLoadingStage(LOADING_STAGES[0])
      intervalRef.current = setInterval(() => {
        idx = (idx + 1) % LOADING_STAGES.length
        setLoadingStage(LOADING_STAGES[idx])
      }, 2000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [loading])

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setIssueData(null)

    try {
      const res = await axios.post('/api/generate')
      setIssueData(res.data)
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to generate issue')
    } finally {
      setLoading(false)
      setLoadingStage('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <Header weekNumber={getCurrentWeekNumber()} />
        <GenerateButton
          loading={loading}
          loadingStage={loadingStage}
          onClick={handleGenerate}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={handleGenerate}
              className="mt-2 text-sm underline text-blue-500"
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div>
            <LoadingSection />
            <LoadingSection />
            <LoadingSection />
          </div>
        )}

        {issueData?.meta?.capped && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center flex items-center justify-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Some content was capped to protect API usage. All available content is shown below.
            </span>
          </div>
        )}

        {issueData && <IssuePreview issueData={issueData} />}
      </div>
    </div>
  )
}
