import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const SYSTEM_PROMPT = `You are a compliance intelligence editor for PolicyPulse by Checkedit — an Australian advertising compliance newsletter. Classify and summarise regulatory content in plain English for marketing managers. Always respond with valid JSON only. No preamble, no markdown.`

const API_CALL_LIMIT = 10

export async function summariseItems(items) {
  if (!items || items.length === 0) return { results: [], apiCalls: 0, capped: false }

  const batches = []
  for (let i = 0; i < items.length; i += 5) {
    batches.push(items.slice(i, i + 5))
  }

  const results = []
  const callCounter = { count: 0 }
  let capped = false

  for (const batch of batches) {
    if (callCounter.count >= API_CALL_LIMIT) {
      console.warn(`⚠️  Summariser hit API call cap (${API_CALL_LIMIT}). Returning partial results with fallback summaries.`)
      capped = true
      for (const item of batch) {
        results.push({
          original_url: item?.url || '',
          section: 'regulatory_update',
          headline: item?.title?.slice(0, 60) || 'Item summary unavailable',
          summary: 'Summary unavailable — API call limit reached. View source for details.',
          action: 'Review the source directly for full details.',
          sector_tags: ['general'],
          source: item?.source || ''
        })
      }
      continue
    }

    try {
      callCounter.count++
      const userPrompt = `Classify and summarise each item. Return a JSON array, one object per input item, same order.

Each object:
{
  "original_url": string,
  "section": "regulatory_update" | "judgement" | "under_review",
  "headline": string (max 12 words),
  "summary": string (2-3 sentences, plain English),
  "action": string (1 sentence — what should a marketer do),
  "sector_tags": array of "alcohol"|"gambling"|"supplements"|"food_beverage"|"insurance"|"financial_services"|"general"
}

Items:
${JSON.stringify(batch.map(item => ({
  title: item?.title || '',
  date: item?.date || '',
  url: item?.url || '',
  body_text: item?.body_text || '',
  source: item?.source || ''
})), null, 2)}`

      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      })

      const text = response?.content?.[0]?.text || '[]'
      const parsed = JSON.parse(text)

      if (Array.isArray(parsed)) {
        const enriched = parsed.map((item, idx) => ({
          ...item,
          source: batch[idx]?.source || '',
          original_url: item?.original_url || batch[idx]?.url || ''
        }))
        results.push(...enriched)
      }
    } catch (err) {
      console.error('Summariser batch error:', err.message)
      for (const item of batch) {
        results.push({
          original_url: item?.url || '',
          section: 'regulatory_update',
          headline: item?.title?.slice(0, 60) || 'Item summary unavailable',
          summary: 'Summary unavailable — view source for details.',
          action: 'Review the source directly for full details.',
          sector_tags: ['general'],
          source: item?.source || ''
        })
      }
    }
  }

  return { results, apiCalls: callCounter.count, capped }
}
