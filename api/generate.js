import scrapeAdStandards from '../server/scrapers/adstandards.js'
import scrapeACCC from '../server/scrapers/accc.js'
import scrapeASIC from '../server/scrapers/asic.js'
import scrapeTGA from '../server/scrapers/tga.js'
import scrapeABAC from '../server/scrapers/abac.js'
import { summariseItems } from '../server/summariser.js'
import { buildIssue } from '../server/issueBuilder.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const results = await Promise.allSettled([
      scrapeAdStandards(),
      scrapeACCC(),
      scrapeASIC(),
      scrapeTGA(),
      scrapeABAC()
    ])

    const items = results.flatMap(r => r.status === 'fulfilled' ? r.value : [])

    console.log(`[vercel] Scraped ${items.length} items total`)

    const { results: summarised, apiCalls: summariserCalls, capped: summariserCapped } = await summariseItems(items)
    const issue = await buildIssue(summarised, summariserCalls, summariserCapped)

    console.log(`[vercel] Pipeline complete: ${issue.meta.total_api_calls} API calls, capped=${issue.meta.capped}, ${issue.meta.scraped_item_count} items`)

    res.json(issue)
  } catch (err) {
    console.error('[vercel] Generate error:', err)
    res.status(500).json({ error: err.message || 'Pipeline failed' })
  }
}
