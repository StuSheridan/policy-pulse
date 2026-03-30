import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import scrapeAdStandards from './scrapers/adstandards.js'
import scrapeACCC from './scrapers/accc.js'
import scrapeASIC from './scrapers/asic.js'
import scrapeTGA from './scrapers/tga.js'
import scrapeABAC from './scrapers/abac.js'
import { summariseItems } from './summariser.js'
import { buildIssue } from './issueBuilder.js'

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/generate', async (_req, res) => {
  try {
    const results = await Promise.allSettled([
      scrapeAdStandards(),
      scrapeACCC(),
      scrapeASIC(),
      scrapeTGA(),
      scrapeABAC()
    ])

    const items = results.flatMap(r => r.status === 'fulfilled' ? r.value : [])

    console.log(`Scraped ${items.length} items total`)

    const { results: summarised, apiCalls: summariserCalls, capped: summariserCapped } = await summariseItems(items)
    const issue = await buildIssue(summarised, summariserCalls, summariserCapped)

    console.log(`Pipeline complete: ${issue.meta.total_api_calls} API calls, capped=${issue.meta.capped}, ${issue.meta.scraped_item_count} items`)

    res.json(issue)
  } catch (err) {
    console.error('Generate error:', err)
    res.status(500).json({ error: err.message || 'Pipeline failed' })
  }
})

app.listen(PORT, () => {
  console.log(`PolicyPulse server running on http://localhost:${PORT}`)
})
