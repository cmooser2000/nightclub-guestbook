/**
 * Fetches Wikipedia thumbnail images for guests missing photos.
 * Uses MediaWiki batch API (50 titles per request) to stay well within rate limits.
 * Run: node scripts/fetch-wiki-images.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_PATH = join(__dirname, '../data/guests.json')

// Explicit Wikipedia title overrides for guests whose title differs from name
const KNOWN_WIKI = {
  'Warren G. Harding':     'Warren G. Harding',
  'D.W. Griffith':         'D. W. Griffith',
  'Fanny Brice':           'Fanny Brice',
  'Bela Lugosi':           'Bela Lugosi',
  'Bert Wheeler':          'Bert Wheeler',
  'Edward Everett Horton': 'Edward Everett Horton',
  'Jason Robards Sr.':     'Jason Robards Sr.',
  'Yehudi Menuhin':        'Yehudi Menuhin',
  'Peggy Hopkins Joyce':   'Peggy Hopkins Joyce',
  'Tom Moore':             'Tom Moore (actor)',
  'Oliver Morosco':        'Oliver Morosco',
  'Ben Blue':              'Ben Blue',
  'Skeet Gallagher':       'Richard Skeets Gallagher',
  'Charmian London':       'Charmian London',
  'Angelo J. Rossi':       'Angelo Rossi (politician)',
  'James Rolph Jr.':       'James Rolph',
  'Vicki Baum':            'Vicki Baum',
  'Jackie Fields':         'Jackie Fields',
  'Mike Donlin':           'Mike Donlin',
  'Paul Ash':              'Paul Ash (musician)',
  'Rex Cherryman':         'Rex Cherryman',
  'Bill Desmond':          'William Desmond',
  'Jim Tully':             'Jim Tully',
  'Nana Bryant':           'Nana Bryant',
  'Adele Blood':           'Adele Blood',
  'Roy Rogers':            'Roy Rogers (vaudeville performer)',
  'Ruth Budd':             'Ruth Budd',
  'Barrie Norton':         'Barry Norton',
  'Dinty Moore':           'Dinty Moore (actor)',
  'Gus Edwards':           'Gus Edwards (songwriter)',
  'Nancy Carroll':         'Nancy Carroll',
  'Lew Brice':             'Lew Brice',
  'Garland Anderson':      'Garland Anderson',
  'Mary Duncan':           'Mary Duncan (actress)',
  'Larry Fine':            'Larry Fine',
  'Bessie Friganza':       'Trixie Friganza',
  'Ole Olsen':             'Ole Olsen (comedian)',
  'Glenn Tryon':           'Glenn Tryon',
  'Helen Ferguson':        'Helen Ferguson (actress)',
  'William Russell':       'William Russell (actor)',
  'Truly Shattuck':        'Truly Shattuck',
  'Kay Hammond':           'Kay Hammond',
  'Louis Persinger':       'Louis Persinger',
  'R.G. "Bob" Fowler':    'Robert G. Fowler',
  'Doris Lloyd':           'Doris Lloyd',
}

function titleFromUrl(wikiUrl) {
  try {
    const u = new URL(wikiUrl)
    return decodeURIComponent(u.pathname.replace('/wiki/', '')).replace(/_/g, ' ')
  } catch {
    return null
  }
}

// Use curl to avoid Node.js User-Agent issues with Wikimedia
function curlWiki(titles) {
  const titleParam = titles.map(t => encodeURIComponent(t)).join('|')
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${titleParam}&prop=pageimages&format=json&pithumbsize=500`
  try {
    const out = execSync(`curl -s -A "nightclub-guestbook/1.0 (educational project)" "${url}"`, { timeout: 15000 })
    return JSON.parse(out.toString())
  } catch {
    return null
  }
}

async function main() {
  const guests = JSON.parse(readFileSync(DATA_PATH, 'utf8'))

  // Build list of guests that need images + their wiki title
  const todo = []
  for (const guest of guests) {
    if (guest.imageUrl && guest.imageUrl.trim()) continue
    const title = guest.wikiUrl ? titleFromUrl(guest.wikiUrl) : (KNOWN_WIKI[guest.name] || null)
    if (title) todo.push({ guest, title })
    else console.log(`  SKIP  ${guest.name} — no wiki title`)
  }

  console.log(`\nFetching images for ${todo.length} guests in batches...\n`)

  // Process in batches of 20
  const BATCH = 20
  for (let i = 0; i < todo.length; i += BATCH) {
    const batch = todo.slice(i, i + BATCH)
    const titles = batch.map(x => x.title)

    const data = curlWiki(titles)
    if (!data) {
      console.log(`  ERROR fetching batch ${i}–${i + batch.length}`)
      continue
    }

    const pages = data?.query?.pages || {}
    // Build a map: normalized/matched title → thumbnail
    const imgMap = {}
    for (const page of Object.values(pages)) {
      if (page.thumbnail?.source) {
        imgMap[page.title.toLowerCase()] = page.thumbnail.source
      }
    }

    for (const { guest, title } of batch) {
      const img = imgMap[title.toLowerCase()]
      if (img) {
        guest.imageUrl = img
        console.log(`  OK    ${guest.name}`)
      } else {
        console.log(`  MISS  ${guest.name} (${title})`)
      }
    }

    // Pause between batches to respect rate limits
    if (i + BATCH < todo.length) {
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  writeFileSync(DATA_PATH, JSON.stringify(guests, null, 2))

  const now = JSON.parse(readFileSync(DATA_PATH, 'utf8'))
  const withPhoto = now.filter(g => g.imageUrl && g.imageUrl.trim()).length
  console.log(`\nDone. ${withPhoto}/${now.length} guests now have photos.`)
}

main().catch(console.error)
