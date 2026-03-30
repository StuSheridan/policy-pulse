import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const NAV_PATTERNS = /^(home|about|contact|read more|the code|menu|search|login|sign|privacy|terms|faq)/i

export default async function scrapeACCC() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch('https://www.accc.gov.au/media-release', {
      signal: controller.signal,
      headers: { 'User-Agent': 'PolicyPulse/1.0' }
    })
    clearTimeout(timeout)

    const html = await res.text()
    const $ = cheerio.load(html)
    const items = []

    // ACCC uses .accc-date-card items inside .view-news-centre
    // Date is split across spans: .accc-date-card--publish--day/month/year
    // Title in .field--name-node-title h2
    // Summary in .field--name-field-acccgov-summary
    // Link on a.accc-date-card__link
    $('.accc-date-card').each((i, el) => {
      if (items.length >= 10) return false
      const $el = $(el)

      const title = $el.find('.field--name-node-title h2').first().text()?.trim() ||
                    $el.find('h2').first().text()?.trim() || ''
      const href = $el.closest('a.accc-date-card__link').attr('href') ||
                   $el.find('a').first().attr('href') || ''

      const day = $el.find('.accc-date-card--publish--day').text()?.trim() || ''
      const month = $el.find('.accc-date-card--publish--month').text()?.trim() || ''
      const year = $el.find('.accc-date-card--publish--year').text()?.trim() || ''
      const date = (day && month && year) ? `${day} ${month} ${year}` : ''

      const summary = $el.find('.field--name-field-acccgov-summary').text()?.trim() || ''
      const bodyText = summary || $el.text()?.replace(/\s+/g, ' ')?.trim() || ''

      if (!title || title.length < 15 || NAV_PATTERNS.test(title) || !date) return

      items.push({
        title,
        date,
        url: href?.startsWith('http') ? href : href ? `https://www.accc.gov.au${href}` : 'https://www.accc.gov.au/media-release',
        body_text: bodyText.slice(0, 800),
        source: 'ACCC'
      })
    })

    console.log(`[scraper:accc] Found ${items.length} items`)
    return items
  } catch (err) {
    console.error('ACCC scraper error:', err.message)
    return []
  }
}
