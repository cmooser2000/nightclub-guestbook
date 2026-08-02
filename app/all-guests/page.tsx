import { getGuests } from '@/lib/guests'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PAPER = '#f5f0e6'
const INK = '#1a1209'
const RULE = '#c8b89a'
const ACCENT = '#8b6914'

// Category display order
const CATEGORY_ORDER = [
  'Political Figures',
  'Politicians',
  'Mayors',
  'Governors',
  'Musicians',
  'Vaudeville Performers',
  'Vaudeville',
  'Silent Film Stars',
  'Actors',
  'Actresses',
  'Actors & Actresses',
  'Film Stars',
  'Journalists',
  'Authors & Playwrights',
  'Authors',
  'Playwrights',
  'Athletes',
  'Aviators',
  'Society Guests',
  'Guest',
  'Guests',
]

function categorySort(cat: string): number {
  const idx = CATEGORY_ORDER.findIndex(
    (c) => c.toLowerCase() === cat.toLowerCase()
  )
  return idx === -1 ? 999 : idx
}

export default async function AllGuestsPage() {
  const guests = await getGuests()

  // Group by category
  const grouped: Record<string, typeof guests> = {}
  for (const g of guests) {
    const cat = g.category || 'Guests'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(g)
  }

  const categories = Object.keys(grouped).sort(
    (a, b) => categorySort(a) - categorySort(b)
  )

  return (
    <main style={{ background: PAPER, color: INK, minHeight: '100vh' }}>
      <style>{`
        @font-face {
          font-family: 'MarketDeco';
          src: url('/fonts/market-deco.ttf') format('truetype');
          font-display: block;
        }
        @font-face {
          font-family: 'LinLibertine';
          src: url('/fonts/linlibertine.ttf') format('truetype');
          font-display: block;
        }
        .name-link {
          display: block;
          padding: 16px 0;
          border-bottom: 1px solid ${RULE};
          text-decoration: none;
          color: ${INK};
          font-family: 'LinLibertine', 'Palatino Linotype', Palatino, serif;
          font-size: 1.45rem;
          transition: background 0.15s, padding-left 0.15s;
        }
        .name-link:hover {
          background: rgba(139,105,20,0.07);
          padding-left: 12px;
          color: ${ACCENT};
        }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `2px solid ${RULE}`, padding: '32px 40px 24px', position: 'sticky', top: 0, background: PAPER, zIndex: 10 }}>
        <Link href="/" style={{ color: ACCENT, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'LinLibertine, serif' }}>
          ← Back to The Aladdin
        </Link>
        <h1 style={{ fontFamily: 'MarketDeco, serif', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 400, margin: '12px 0 4px', color: INK }}>
          All Guestbook Names
        </h1>
        <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '1rem', color: ACCENT, opacity: 0.7 }}>
          {guests.length} guests · tap any name to read their story
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 40px 80px' }}>
        {categories.map((cat) => (
          <div key={cat} style={{ marginBottom: 48 }}>
            {/* Category heading */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <h2 style={{
                fontFamily: 'LinLibertine, serif',
                fontSize: '0.75rem',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: ACCENT,
                margin: 0,
                flexShrink: 0,
              }}>
                {cat}
              </h2>
              <div style={{ flex: 1, height: 1, background: RULE }} />
            </div>

            {/* Names list */}
            <div>
              {grouped[cat]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((g) => (
                  <Link key={g.id} href={`/guest/${g.id}`} className="name-link">
                    {g.name}
                    {g.dadStory?.trim() ? (
                      <span style={{ fontSize: '0.7rem', marginLeft: 10, color: ACCENT, opacity: 0.6, fontStyle: 'italic' }}>
                        has a story
                      </span>
                    ) : null}
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: `1px solid ${RULE}`, padding: '20px 40px', textAlign: 'center', fontFamily: 'LinLibertine, serif', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.4 }}>
        Aladdin Studio Tiffin Room · San Francisco · 1921–1929
      </footer>
    </main>
  )
}
