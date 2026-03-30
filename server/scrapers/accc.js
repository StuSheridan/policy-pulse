import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

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

    $('article, .views-row, .listing-item, .media-release-listing .item, li.search-result').each((i, el) => {
      if (i >= 10) return false
      const $el = $(el)
      const title = $el.find('h2 a, h3 a, a.media-release-link, a').first().text()?.trim() ||
                    $el.find('h2, h3, .title').first().text()?.trim()
      const href = $el.find('a').first().attr('href')
      const date = $el.find('.date, time, .media-release-date, .field-date').first().text()?.trim() || ''
      const bodyText = $el.find('p, .summary, .field-summary').first().text()?.trim() ||
                       $el.text()?.replace(/\s+/g, ' ')?.trim() || ''

      if (title && title.length > 3) {
        items.push({
          title,
          date,
          url: href?.startsWith('http') ? href : href ? `https://www.accc.gov.au${href}` : 'https://www.accc.gov.au/media-release',
          body_text: bodyText.slice(0, 800),
          source: 'ACCC'
        })
      }
    })

    return items
  } catch (err) {
    console.error('ACCC scraper error:', err.message)
    return []
  }
}
