import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const NAV_PATTERNS = /^(home|about|contact|read more|the code|menu|search|login|sign|privacy|terms|faq)/i

export default async function scrapeAdStandards() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch('https://adstandards.com.au/cases', {
      signal: controller.signal,
      headers: { 'User-Agent': 'PolicyPulse/1.0' }
    })
    clearTimeout(timeout)

    const html = await res.text()
    const $ = cheerio.load(html)
    const items = []

    // Ad Standards uses a table.elementor--asb-case-listing with rows in tbody
    // Columns: case number (link to PDF), advertiser+description, decision, category, media, date
    $('table tbody tr').each((i, el) => {
      if (items.length >= 10) return false
      const $el = $(el)
      const tds = $el.find('td')
      if (tds.length < 3) return // skip non-content rows

      const caseLink = tds.eq(0).find('a')
      const caseNumber = caseLink.text()?.trim() || ''
      const caseHref = caseLink.attr('href') || ''

      const advertiserCell = tds.eq(1)
      const advertiser = advertiserCell.find('strong').first().text()?.trim() || ''
      const description = advertiserCell.find('section').text()?.trim() ||
                          advertiserCell.text()?.replace(/\s+/g, ' ')?.trim() || ''

      const decision = tds.eq(2).text()?.trim() || ''
      const date = tds.last().text()?.trim() || ''

      const title = advertiser
        ? `${caseNumber} — ${advertiser}: ${decision}`.trim()
        : caseNumber || description?.slice(0, 80)

      if (!title || title.length < 15 || NAV_PATTERNS.test(title) || !date) return

      items.push({
        title,
        date,
        url: caseHref?.startsWith('http') ? caseHref : caseHref ? `https://adstandards.com.au${caseHref}` : 'https://adstandards.com.au/cases',
        body_text: description?.slice(0, 800) || '',
        source: 'Ad Standards'
      })
    })

    console.log(`[scraper:adstandards] Found ${items.length} items`)
    return items
  } catch (err) {
    console.error('Ad Standards scraper error:', err.message)
    return []
  }
}
