import fetch from 'node-fetch'

const NAV_PATTERNS = /^(home|about|contact|read more|the code|menu|search|login|sign|privacy|terms|faq)/i

export default async function scrapeASIC() {
  try {
    // ASIC's listing page is JS-rendered. Fetch the JSON API directly.
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch('https://download.asic.gov.au/scripts/newsroom/newsroom-all.json', {
      signal: controller.signal,
      headers: { 'User-Agent': 'PolicyPulse/1.0' }
    })
    clearTimeout(timeout)

    const data = await res.json()
    const items = []

    // Each item: { name, documentNumber, publishedDate, url, metaDescription, metaType, metaSubject }
    // Filter to media releases only, take first 10
    const releases = (Array.isArray(data) ? data : [])
      .filter(item => item?.metaType?.toLowerCase()?.includes('media release'))
      .slice(0, 10)

    for (const item of releases) {
      const title = item?.name?.trim() || ''
      const date = item?.publishedDate
        ? new Date(item.publishedDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
        : ''
      const url = item?.url
        ? (item.url.startsWith('http') ? item.url : `https://asic.gov.au${item.url}`)
        : 'https://asic.gov.au/about-asic/news-centre/find-a-media-release/'
      const bodyText = item?.metaDescription?.trim() || ''

      if (!title || title.length < 15 || NAV_PATTERNS.test(title) || !date) continue

      items.push({
        title,
        date,
        url,
        body_text: bodyText.slice(0, 800),
        source: 'ASIC'
      })
    }

    console.log(`[scraper:asic] Found ${items.length} items`)
    return items
  } catch (err) {
    console.error('ASIC scraper error:', err.message)
    return []
  }
}
