import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

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

    $('table tbody tr, .view-content .views-row, .case-list-item, article').each((i, el) => {
      if (i >= 10) return false
      const $el = $(el)
      const title = $el.find('a').first().text()?.trim() ||
                    $el.find('h2, h3, .title').first().text()?.trim()
      const href = $el.find('a').first().attr('href')
      const date = $el.find('.date, time, .field--name-created').first().text()?.trim() || ''
      const bodyText = $el.text()?.replace(/\s+/g, ' ')?.trim()?.slice(0, 800) || ''

      if (title && title.length > 3) {
        items.push({
          title,
          date,
          url: href?.startsWith('http') ? href : href ? `https://adstandards.com.au${href}` : 'https://adstandards.com.au/cases',
          body_text: bodyText.slice(0, 800),
          source: 'Ad Standards'
        })
      }
    })

    return items
  } catch (err) {
    console.error('Ad Standards scraper error:', err.message)
    return []
  }
}
