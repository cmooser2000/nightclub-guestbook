'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'

const GREEN = '#2a6e3a'

const PAPER = '#f5f0e6'
const INK = '#1a1209'
const RULE = '#c8b89a'
const ACCENT = '#8b6914'

interface Guest {
  id: string
  name: string
  category: string
  dadStory: string
  knownFor: string
  quickFacts: string[]
  guestbookPage: number
  tags?: string[]
}

export default function AllGuestsClient({ guests }: { guests: Guest[] }) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [view, setView] = useState<'categories' | 'index'>('categories')

  // Group by category
  const grouped: Record<string, Guest[]> = {}
  for (const g of guests) {
    const cat = g.category || 'Guests'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(g)
  }
  const categories = Object.keys(grouped).sort((a, b) => a.localeCompare(b))

  // Collect all unique tags across guests
  const allTags = Array.from(new Set(guests.flatMap((g) => g.tags ?? []))).sort()

  // Search / tag / category filter
  const q = search.trim().toLowerCase()
  const filtered = (q.length > 0 || activeTag || activeCategory)
    ? guests.filter((g) => {
        const matchesTag = !activeTag || (g.tags ?? []).includes(activeTag)
        const matchesCategory = !activeCategory || (g.category || 'Guests') === activeCategory
        const matchesSearch = !q || [g.name, g.knownFor, g.category, g.dadStory, ...(g.quickFacts ?? [])]
          .some((f) => (f ?? '').toLowerCase().includes(q))
        return matchesTag && matchesCategory && matchesSearch
      }).sort((a, b) => a.name.localeCompare(b.name))
    : null

  const searchRef = useRef<HTMLInputElement>(null)

  function catId(cat: string) {
    return 'cat-' + cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  return (
    <main style={{ background: PAPER, color: INK, minHeight: '100vh' }}>
      <style>{`
        @font-face { font-family: 'MarketDeco'; src: url('/fonts/market-deco.ttf') format('truetype'); font-display: block; }
        @font-face { font-family: 'LinLibertine'; src: url('/fonts/linlibertine.ttf') format('truetype'); font-display: block; }
        .name-link {
          display: block;
          padding: 14px 0;
          border-bottom: 1px solid ${RULE};
          text-decoration: none;
          color: ${INK};
          font-family: 'LinLibertine', serif;
          font-size: 1.4rem;
          transition: background 0.12s, padding-left 0.12s;
        }
        .name-link:hover { background: rgba(139,105,20,0.07); padding-left: 12px; color: ${ACCENT}; }
        .jump-btn {
          background: none;
          border: 1px solid ${RULE};
          color: ${ACCENT};
          font-family: 'LinLibertine', serif;
          font-size: 0.85rem;
          padding: 6px 14px;
          cursor: pointer;
          border-radius: 2px;
          transition: background 0.12s;
          white-space: nowrap;
        }
        .jump-btn:hover { background: rgba(139,105,20,0.1); }
      `}</style>

      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, background: PAPER, zIndex: 10, borderBottom: `2px solid ${RULE}`, padding: '20px 40px 16px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: ACCENT, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'LinLibertine, serif', flexShrink: 0 }}>
              ← Back
            </Link>
            <h1 style={{ fontFamily: 'MarketDeco, serif', fontSize: 'clamp(1.6rem, 5vw, 2.6rem)', fontWeight: 400, margin: 0, color: INK }}>
              All Guestbook Names
            </h1>
            <span style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.85rem', color: ACCENT, opacity: 0.6 }}>
              {guests.length} guests
            </span>
          </div>

          {/* Search */}
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, occupation, keyword…"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: 'LinLibertine, serif',
              fontSize: '1.15rem',
              padding: '12px 16px',
              border: `2px solid ${ACCENT}`,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.6)',
              color: INK,
              outline: 'none',
              marginBottom: 14,
            }}
          />

          {/* Tag filter buttons — always visible if tags exist */}
          {allTags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10, alignItems: 'center' }}>
              <span style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.8rem', color: INK, opacity: 0.45, alignSelf: 'center' }}>
                Collections:
              </span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className="jump-btn"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  style={{
                    borderColor: activeTag === tag ? '#c0405a' : RULE,
                    color: activeTag === tag ? '#c0405a' : ACCENT,
                    background: activeTag === tag ? 'rgba(192,64,90,0.08)' : 'none',
                    fontWeight: activeTag === tag ? 700 : 400,
                  }}
                >
                  {tag} {activeTag === tag ? '✕' : ''}
                </button>
              ))}
            </div>
          )}

          {/* View toggle + jump links — only shown when not searching or tag-filtering */}
          {!q && !activeTag && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {/* View toggle */}
              <button
                className="jump-btn"
                onClick={() => { setView(view === 'categories' ? 'index' : 'categories'); setActiveCategory(null) }}
                style={{ fontWeight: 600, borderColor: ACCENT, color: ACCENT }}
              >
                {view === 'categories' ? '📄 Index (A–Z)' : '📂 By Category'}
              </button>
              <Link
                href="/most-interesting"
                style={{
                  fontFamily: 'LinLibertine, serif',
                  fontSize: '0.85rem',
                  padding: '6px 14px',
                  border: `2px solid ${GREEN}`,
                  borderRadius: 2,
                  background: GREEN,
                  color: '#f5f0e6',
                  textDecoration: 'none',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                ★ Most Interesting
              </Link>
              <span style={{ width: 1, height: 20, background: RULE, flexShrink: 0 }} />
              {/* Category filter buttons */}
              <span style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.8rem', color: INK, opacity: 0.45, alignSelf: 'center' }}>
                Jump to:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="jump-btn"
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  style={{
                    borderColor: activeCategory === cat ? ACCENT : RULE,
                    color: activeCategory === cat ? '#f5f0e6' : ACCENT,
                    background: activeCategory === cat ? ACCENT : 'none',
                    fontWeight: activeCategory === cat ? 700 : 400,
                  }}
                >
                  {cat}{activeCategory === cat ? ' ✕' : ''}
                </button>
              ))}
            </div>
          )}

          {/* Result count when filtering */}
          {filtered !== null && (
            <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.9rem', color: ACCENT, margin: 0 }}>
              {filtered.length === 0 ? 'No matches found.' : `${filtered.length} guest${filtered.length === 1 ? '' : 's'}`}
              {activeCategory && !q && (
                <button onClick={() => setActiveCategory(null)} style={{ background: 'none', border: 'none', color: ACCENT, fontFamily: 'LinLibertine, serif', fontSize: '0.9rem', cursor: 'pointer', marginLeft: 12, opacity: 0.6 }}>
                  ✕ clear
                </button>
              )}
            </p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 40px 80px' }}>

        {/* Search results */}
        {filtered !== null ? (
          <div>
            {filtered.map((g) => (
              <Link key={g.id} href={`/guest/${g.id}`} className="name-link">
                {g.name}
                <span style={{ fontSize: '0.78rem', marginLeft: 12, color: ACCENT, opacity: 0.55, fontStyle: 'italic' }}>
                  {g.category}
                </span>
                {g.dadStory?.trim() ? (
                  <span style={{ fontSize: '0.7rem', marginLeft: 8, color: '#2a7a3a', opacity: 0.7, fontStyle: 'italic' }}>· has a story</span>
                ) : null}
              </Link>
            ))}
          </div>
        ) : view === 'index' ? (
          /* A–Z index */
          (() => {
            const sorted = [...guests].sort((a, b) => a.name.localeCompare(b.name))
            let lastLetter = ''
            return sorted.map((g) => {
              const letter = g.name[0]?.toUpperCase() ?? '#'
              const showLetter = letter !== lastLetter
              if (showLetter) lastLetter = letter
              return (
                <div key={g.id}>
                  {showLetter && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0 4px' }}>
                      <span style={{ fontFamily: 'LinLibertine, serif', fontSize: '1.6rem', color: ACCENT, fontWeight: 400, flexShrink: 0 }}>{letter}</span>
                      <div style={{ flex: 1, height: 1, background: RULE }} />
                    </div>
                  )}
                  <Link href={`/guest/${g.id}`} className="name-link">
                    {g.name}
                    {g.dadStory?.trim() ? (
                      <span style={{ fontSize: '0.7rem', marginLeft: 10, color: '#2a7a3a', opacity: 0.7, fontStyle: 'italic' }}>· has a story</span>
                    ) : null}
                  </Link>
                </div>
              )
            })
          })()
        ) : (
          /* Full grouped list */
          categories.map((cat) => (
            <div
              key={cat}
              id={catId(cat)}
              style={{ marginBottom: 48, scrollMarginTop: 180 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                <h2 style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: ACCENT, margin: 0, flexShrink: 0 }}>
                  {cat}
                </h2>
                <div style={{ flex: 1, height: 1, background: RULE }} />
              </div>
              {grouped[cat]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((g) => (
                  <Link key={g.id} href={`/guest/${g.id}`} className="name-link">
                    {g.name}
                    {g.dadStory?.trim() ? (
                      <span style={{ fontSize: '0.7rem', marginLeft: 10, color: '#2a7a3a', opacity: 0.7, fontStyle: 'italic' }}>· has a story</span>
                    ) : null}
                  </Link>
                ))}
            </div>
          ))
        )}
      </div>

      <footer style={{ borderTop: `1px solid ${RULE}`, padding: '20px 40px', textAlign: 'center', fontFamily: 'LinLibertine, serif', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.4 }}>
        Aladdin Studio Tiffin Room · San Francisco · 1921–1929
      </footer>
    </main>
  )
}
