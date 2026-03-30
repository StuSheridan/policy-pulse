import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const NAV_PATTERNS = /^(home|about|contact|read more|the code|menu|search|login|sign|privacy|terms|faq)/i

export default async function scrapeTGA() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    // TGA media releases listing (Drupal/GovCMS)
    const res = await fetch('https://www.tga.gov.au/news/media-releases', {
      signal: controller.signal,
      headers: { 'User-Agent': 'PolicyPulse/1.0' }
    })
    clearTimeout(timeout)

    const html = await res.text()
    const $ = cheerio.load(html)
    const items = []

    // Items are: li.views-layout__item > article.node--article
    // Title: .summary__title a
    // Date: .summary__date time[datetime]
    // Summary: .field--name-field-summary .field__item
    $('article.node--article, article.node--type-article').each((i, el) => {
      if (items.length >= 10) return false
      const $el = $(el)

      const titleEl = $el.find('.summary__title a, h3 a, h2 a').first()
      const title = titleEl.text()?.trim() || ''
      const href = titleEl.attr('href') || ''

      const timeEl = $el.find('.summary__date time, time').first()
      const date = timeEl.text()?.trim() || timeEl.attr('datetime')?.split('T')?.[0] || ''

      const summary = $el.find('.field--name-field-summary .field__item, .field--name-field-summary').first().text()?.trim() || ''
      const bodyText = summary || $el.text()?.replace(/\s+/g, ' ')?.trim() || ''

      if (!title || title.length < 15 || NAV_PATTERNS.test(title) || !date) return

      items.push({
        title,
        date,
        url: href?.startsWith('http') ? href : href ? `https://www.tga.gov.au${href}` : 'https://www.tga.gov.au/news/media-releases',
        body_text: bodyText.slice(0, 800),
        source: 'TGA'
      })
    })

    console.log(`[scraper:tga] Found ${items.length} items`)
    return items
  } catch (err) {
    console.error('TGA scraper error:', err.message)
    return []
  }
}
