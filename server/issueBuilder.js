import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const TIPS = [
  {
    tip: "Always substantiate health claims",
    body: "Any health or wellness claim must be supported by credible scientific evidence. The TGA requires therapeutic claims — including implied ones — are backed by evidence before publication, not after a complaint."
  },
  {
    tip: "Comparison claims must be accurate and fair",
    body: "Every comparison must be accurate, not misleading, and based on like-for-like criteria. ACCC has actioned multiple cases where 'Australia's #1' style claims lacked substantiation."
  },
  {
    tip: "Alcohol ads must not target under-18s",
    body: "Under the ABAC Responsible Alcohol Marketing Code, alcohol advertising must never directly or indirectly appeal to people under 18 — including placement, imagery, language, and social media distribution."
  },
  {
    tip: "Influencer disclosure is not optional",
    body: "If an influencer is paid, gifted product, or has any material connection to a brand, they must clearly disclose this. Ad Standards has upheld complaints where #ad or #gifted disclosures were buried or absent."
  },
  {
    tip: "Financial promotions must include required warnings",
    body: "ASIC requires financial product advertising includes risk warnings and disclaimers in a manner that is clear, concise, and effective — not hidden in fine print or spoken rapidly at the end of a radio ad."
  }
]

const CHECKEDIT_CHECK = {
  brand: "Carlton & United Breweries",
  product: "Great Northern Super Crisp — recent OOH campaign",
  finding: "The campaign featured imagery of people in an outdoor setting that could be interpreted as targeting active, healthy lifestyles as a benefit of consumption — a potential ABAC breach under Section 3(a).",
  verdict: "Borderline. The imagery alone may not constitute a breach but combined with the tagline creates an implied health association that warrants review before the next flight.",
  checkedit_note: "Checkedit flagged this in 4 seconds. Want to check your next campaign? Audit your own content for less than a coffee a day at Checkedit.ai"
}

function getCurrentWeekNumber() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now - start
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7)
}

const TOTAL_CALL_LIMIT = 15

async function generateSectorSpotlight(items, totalCalls) {
  if (totalCalls >= TOTAL_CALL_LIMIT) {
    console.warn(`⚠️  Issue builder skipping sector spotlight — total API calls at cap (${TOTAL_CALL_LIMIT}).`)
    const sectorCounts = {}
    for (const item of items) {
      for (const tag of item?.sector_tags || []) {
        sectorCounts[tag] = (sectorCounts[tag] || 0) + 1
      }
    }
    const topSector = Object.entries(sectorCounts)
      .sort((a, b) => b[1] - a[1])
      .find(([s]) => s !== 'general')?.[0] || 'general'
    return {
      result: { sector: topSector, headline: `${topSector} sector update`, body: 'Sector spotlight unavailable this week — API call limit reached. Check back next issue.' },
      apiCalls: 0
    }
  }
  const sectorCounts = {}
  for (const item of items) {
    for (const tag of item?.sector_tags || []) {
      sectorCounts[tag] = (sectorCounts[tag] || 0) + 1
    }
  }

  const topSector = Object.entries(sectorCounts)
    .sort((a, b) => b[1] - a[1])
    .find(([s]) => s !== 'general')?.[0] || 'general'

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: 'You are a compliance intelligence editor. Always respond with valid JSON only. No preamble, no markdown.',
      messages: [{
        role: 'user',
        content: `Write a 150-word sector spotlight on ${topSector} for a compliance newsletter. Cover: current regulatory environment, one key risk to watch, one practical tip. Audience: marketing managers at Australian brands. Plain English. No legal jargon.\nReturn JSON only: { "sector": string, "headline": string, "body": string }`
      }]
    })

    const text = response?.content?.[0]?.text || '{}'
    return { result: JSON.parse(text), apiCalls: 1 }
  } catch (err) {
    console.error('Sector spotlight error:', err.message)
    return {
      result: { sector: topSector, headline: `${topSector} sector update`, body: 'Sector spotlight unavailable this week — check back next issue.' },
      apiCalls: 1
    }
  }
}

export async function buildIssue(summarisedItems, summariserApiCalls = 0, summariserCapped = false) {
  const weekNumber = getCurrentWeekNumber()
  let totalCalls = summariserApiCalls

  const regulatory_updates = summarisedItems.filter(i => i?.section === 'regulatory_update')
  const judgements = summarisedItems.filter(i => i?.section === 'judgement')
  const under_review = summarisedItems.filter(i => i?.section === 'under_review')

  const evergreen_tip = TIPS[weekNumber % 5]
  const spotlightResult = await generateSectorSpotlight(summarisedItems, totalCalls)
  totalCalls += spotlightResult.apiCalls

  const capped = summariserCapped || totalCalls >= TOTAL_CALL_LIMIT

  return {
    generated_at: new Date().toISOString(),
    week_number: weekNumber,
    meta: {
      total_api_calls: totalCalls,
      capped,
      scraped_item_count: summarisedItems.length
    },
    sections: {
      regulatory_updates,
      judgements,
      under_review,
      evergreen_tip,
      sector_spotlight: spotlightResult.result,
      checkedit_check: CHECKEDIT_CHECK
    }
  }
}
