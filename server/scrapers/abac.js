import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

export default async function scrapeABAC() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch('https://abac.org.au/adjudications/', {
      signal: controller.signal,
      headers: { 'User-Agent': 'PolicyPulse/1.0' }
    })
    clearTimeout(timeout)

    const html = await res.text()
    const $ = cheerio.load(html)
    const items = []

    $('article, .entry, .post, .adjudication-item, .listing-item, .wp-block-post, li').each((i, el) => {
      if (i >= 10) return false
      const $el = $(el)
      const title = $el.find('h2 a, h3 a, a').first().text()?.trim() ||
                    $el.find('h2, h3, .title, .entry-title').first().text()?.trim()
      const href = $el.find('a').first().attr('href')
      const date = $el.find('.date, time, .entry-date, .post-date').first().text()?.trim() || ''
      const bodyText = $el.find('p, .summary, .excerpt, .entry-content').first().text()?.trim() ||
                       $el.text()?.replace(/\s+/g, ' ')?.trim() || ''

      if (title && title.length > 5) {
        items.push({
          title,
          date,
          url: href?.startsWith('http') ? href : href ? `https://abac.org.au${href}` : 'https://abac.org.au/adjudications/',
          body_text: bodyText.slice(0, 800),
          source: 'ABAC'
        })
      }
    })

    return items
  } catch (err) {
    console.error('ABAC scraper error:', err.message)
    return []
  }
}
