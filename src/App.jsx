import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
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
    <div className="min-h-screen pb-12" style={{ background: '#F1F4F6' }}>
      <div className="mx-auto px-4" style={{ maxWidth: '680px' }}>
        <Header weekNumber={getCurrentWeekNumber()} />
        <GenerateButton
          loading={loading}
          loadingStage={loadingStage}
          onClick={handleGenerate}
        />

        {error && (
          <div
            className="mx-auto mb-6 p-4 rounded-lg text-center"
            style={{ maxWidth: '680px', background: '#FEE2E2', color: '#991B1B', borderRadius: '8px' }}
          >
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={handleGenerate}
              className="mt-2 text-sm underline"
              style={{ color: '#3B82F6' }}
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div className="mx-auto" style={{ maxWidth: '680px' }}>
            <LoadingSection />
            <LoadingSection />
            <LoadingSection />
          </div>
        )}

        {issueData && <IssuePreview issueData={issueData} />}
      </div>
    </div>
  )
}
