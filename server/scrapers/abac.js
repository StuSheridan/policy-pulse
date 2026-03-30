import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const NAV_PATTERNS = /^(home|about|contact|read more|the code|menu|search|login|sign|privacy|terms|faq)/i

export default async function scrapeABAC() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    // Correct URL is /adjudication/ (singular), not /adjudications/
    const res = await fetch('https://abac.org.au/adjudication/', {
      signal: controller.signal,
      headers: { 'User-Agent': 'PolicyPulse/1.0' }
    })
    clearTimeout(timeout)

    const html = await res.text()
    const $ = cheerio.load(html)
    const items = []

    // ABAC WordPress: article#content.archive > div (bare divs)
    // Each div has: h2 > a (title + link), p.date (date text)
    // No summary text on listing page
    $('article#content.archive > div, article.archive > div').each((i, el) => {
      if (items.length >= 10) return false
      const $el = $(el)

      const linkEl = $el.find('h2 a').first()
      const title = linkEl.text()?.trim() || $el.find('h2').first().text()?.trim() || ''
      const href = linkEl.attr('href') || ''

      const date = $el.find('p.date').text()?.trim() || ''

      if (!title || title.length < 15 || NAV_PATTERNS.test(title) || !date) return

      items.push({
        title,
        date,
        url: href?.startsWith('http') ? href : href ? `https://abac.org.au${href}` : 'https://abac.org.au/adjudication/',
        body_text: `ABAC adjudication: ${title}. Date: ${date}.`.slice(0, 800),
        source: 'ABAC'
      })
    })

    console.log(`[scraper:abac] Found ${items.length} items`)
    return items
  } catch (err) {
    console.error('ABAC scraper error:', err.message)
    return []
  }
}
