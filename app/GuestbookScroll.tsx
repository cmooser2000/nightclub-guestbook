'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface GuestEntry {
  id: string
  name: string
  knownFor: string
  category: string
  guestbookCoords: { x: number; y: number }
}

interface Props {
  pageMap: Record<number, GuestEntry[]>
}

const TOTAL_PAGES = 418

const CATEGORIES = [
  {
    label: 'Political Figures',
    match: (c: string) => /politic|mayor|governor|senator|congress|assembly|presidential|diplomacy|judge|supervisor|official/i.test(c),
  },
  {
    label: 'Musicians',
    match: (c: string) => /music|violinist|pianist|composer|conductor|singer|vocalist|cellist|orchestra|opera|songwriter/i.test(c),
  },
  {
    label: 'Vaudeville Performers',
    match: (c: string) => /vaudeville/i.test(c),
  },
  {
    label: 'Silent Film Stars',
    match: (c: string) => /silent film/i.test(c),
  },
  {
    label: 'Journalists',
    match: (c: string) => /journalist|reporter|newspaper|examiner|columnist|publisher|editor/i.test(c),
  },
  {
    label: 'Authors & Playwrights',
    match: (c: string) => /author|playwright|poet|novelist|writer|humorist|dramatist/i.test(c),
  },
  {
    label: 'Athletes',
    match: (c: string) => /boxer|baseball|football|athlete|sports|champion/i.test(c),
  },
  {
    label: 'Aviators',
    match: (c: string) => /aviator|aviation|pilot|flier/i.test(c),
  },
  {
    label: 'Society Guests',
    match: (c: string) => /society/i.test(c),
  },
]

function pageImg(n: number) {
  return `/guestbook-pages/pg${String(n).padStart(3, '0')}.jpg`
}

function shortDesc(knownFor: string): string {
  const sentence = knownFor.split(/[.—]/)[0].trim()
  return sentence.length > 140 ? sentence.slice(0, 137) + '…' : sentence
}

export default function GuestbookScroll({ pageMap }: Props) {
  const allPages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1)
  const [showPanel, setShowPanel] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setShowPanel(window.scrollY > 120)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const sortedGuests = useMemo(() => {
    return Object.entries(pageMap)
      .flatMap(([page, guests]) =>
        guests.map((g) => ({ ...g, pageNum: Number(page) }))
      )
      .sort((a, b) => a.pageNum !== b.pageNum ? a.pageNum - b.pageNum : a.guestbookCoords.y - b.guestbookCoords.y)
  }, [pageMap])

  const jumpToNext = useCallback(() => {
    if (sortedGuests.length === 0) return
    const mid = window.scrollY + window.innerHeight * 0.4
    for (const g of sortedGuests) {
      const el = document.getElementById(`page-${g.pageNum}`)
      if (!el) continue
      const pageTop = el.getBoundingClientRect().top + window.scrollY
      if (pageTop > mid) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    const firstEl = document.getElementById(`page-${sortedGuests[0].pageNum}`)
    firstEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [sortedGuests])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return sortedGuests.filter(g => g.name.toLowerCase().includes(q)).slice(0, 12)
  }, [searchQuery, sortedGuests])

  const categoryGuests = useMemo(() => {
    if (!activeCategory) return []
    const cat = CATEGORIES.find(c => c.label === activeCategory)
    if (!cat) return []
    return sortedGuests.filter(g => cat.match(g.category))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [activeCategory, sortedGuests])

  function jumpToGuest(pageNum: number) {
    setSearchQuery('')
    const el = document.getElementById(`page-${pageNum}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main style={{ background: 'transparent' }}>

      {/* ── LEFT PANEL — search + browse, appears after hero ── */}
      <style>{`
        @font-face { font-family: 'USDeclaration'; src: url('/fonts/us-declaration.ttf') format('truetype'); font-display: block; }
        @font-face { font-family: 'Decary'; src: url('/fonts/decary.otf') format('opentype'); font-display: block; }
        @font-face { font-family: 'LinLibertine'; src: url('/fonts/linlibertine.ttf') format('truetype'); font-display: block; }

        /* ── Floating search bar (top right) ── */
        .gb-panel {
          position: fixed;
          right: 20px;
          top: 16px;
          z-index: 200;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
          filter: drop-shadow(2px 3px 8px rgba(0,0,0,0.45));
        }
        .gb-panel.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .gb-search-bar {
          display: flex;
          align-items: center;
          background: #f0deb8;
          border: 2.5px solid #c0405a;
          outline: 2px solid #1a1209;
          outline-offset: -5px;
        }

        .gb-search-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: 'LinLibertine', 'Palatino Linotype', Palatino, serif;
          font-size: 0.95rem;
          color: #1a1209;
          padding: 9px 12px 9px 8px;
          width: 160px;
        }
        .gb-search-input::placeholder { color: rgba(26,18,9,0.4); }

        /* ── Modal overlay ── */
        .gb-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(20,16,12,0.7);
          z-index: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .gb-modal {
          background: #f0deb8;
          border: 2px solid #c0405a;
          box-shadow: 0 8px 48px rgba(0,0,0,0.6);
          width: 100%;
          max-width: 520px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
        }
        .gb-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(192,64,90,0.4);
          flex-shrink: 0;
        }
        .gb-modal-title {
          font-family: 'LinLibertine', serif;
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c0405a;
          margin: 0;
        }
        .gb-modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #3a4858;
          font-size: 1.4rem;
          line-height: 1;
          padding: 0 2px;
          opacity: 0.7;
          transition: opacity 0.1s;
        }
        .gb-modal-close:hover { opacity: 1; color: #1a2a38; }

        .gb-modal-body {
          overflow-y: auto;
          flex: 1;
        }
        .gb-modal-body::-webkit-scrollbar { width: 4px; }
        .gb-modal-body::-webkit-scrollbar-track { background: transparent; }
        .gb-modal-body::-webkit-scrollbar-thumb { background: rgba(192,64,90,0.4); border-radius: 2px; }

        .gb-cat-btn {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'LinLibertine', 'Palatino Linotype', Palatino, serif;
          font-size: 1.05rem;
          color: #3a4858;
          padding: 13px 20px;
          letter-spacing: 0.04em;
          border-bottom: 1px solid rgba(192,64,90,0.2);
          transition: background 0.12s;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .gb-cat-btn:hover { background: rgba(192,64,90,0.12); color: #1a2a38; }

        .gb-result-item {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          border-bottom: 1px solid rgba(192,64,90,0.15);
          padding: 12px 20px;
          cursor: pointer;
          font-family: 'LinLibertine', 'Palatino Linotype', Palatino, serif;
          font-size: 1rem;
          color: #3a4858;
          line-height: 1.3;
          transition: background 0.1s;
          text-decoration: none;
        }
        .gb-result-item:hover { background: rgba(192,64,90,0.12); }
        .gb-result-item .pg { font-size: 0.75rem; color: #c0405a; display: block; margin-top: 3px; }

        .gb-guest-row {
          position: absolute;
          left: -132px;
          right: 0;
          height: 5%;
          min-height: 36px;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          cursor: pointer;
          text-decoration: none;
          z-index: 10;
        }
        .gb-guest-row:hover { z-index: 20; }
        .gb-arrow-svg {
          flex-shrink: 0;
          filter: drop-shadow(1px 2px 4px rgba(0,0,0,0.4));
          transition: filter 0.15s ease;
        }
        .gb-guest-row:hover .gb-arrow-svg {
          filter: drop-shadow(1px 3px 8px rgba(0,0,0,0.55)) brightness(1.08);
        }
        .gb-tooltip {
          display: none;
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          width: 220px;
          background: #f0deb8;
          color: #1a1209;
          border: 2px solid #c0405a;
          border-radius: 3px;
          padding: 10px 12px;
          z-index: 100;
          pointer-events: none;
          box-shadow: 0 3px 14px rgba(0,0,0,0.18);
          white-space: normal;
        }
        .gb-guest-row:hover .gb-tooltip { display: block; }
        .gb-tooltip-name {
          margin: 0 0 6px;
          color: #1a1209;
          font-family: 'Palatino Linotype', Palatino, Georgia, serif;
          font-size: 0.95rem;
          font-style: italic;
          font-weight: normal;
          line-height: 1.3;
        }
        .gb-tooltip-desc { display: none; }
        .gb-tooltip-cta {
          margin: 0;
          font-size: 0.6rem;
          opacity: 0.45;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #1a1209;
          font-family: 'Palatino Linotype', Palatino, serif;
        }
        .gb-page-num {
          position: absolute;
          top: 8px;
          right: 10px;
          font-size: 0.65rem;
          font-family: Georgia, serif;
          color: rgba(100,70,40,0.4);
          letter-spacing: 0.05em;
          user-select: none;
          pointer-events: none;
        }
      `}</style>

      {/* ── Floating search bar (right side) ── */}
      <div className={`gb-panel${showPanel ? ' visible' : ''}`}>
        <div className="gb-search-bar">
          <svg style={{ marginLeft: 10, flexShrink: 0, opacity: 0.45 }} width="14" height="14" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="#1a1209" strokeWidth="1.4"/>
            <line x1="9" y1="9" x2="12" y2="12" stroke="#1a1209" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            ref={searchInputRef}
            className="gb-search-input"
            placeholder="Search a name…"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setModalOpen(true) }}
            onFocus={() => setModalOpen(true)}
          />
        </div>
      </div>

      {/* ── Modal ── */}
      {showPanel && modalOpen && (
        <div className="gb-modal-backdrop" onClick={() => { setModalOpen(false); setSearchQuery(''); setActiveCategory(null) }}>
          <div className="gb-modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="gb-modal-header">
              <p className="gb-modal-title">
                {activeCategory ? activeCategory : searchQuery ? 'Search results' : 'Browse the guestbook'}
              </p>
              <button
                className="gb-modal-close"
                onClick={() => { setModalOpen(false); setSearchQuery(''); setActiveCategory(null) }}
              >×</button>
            </div>

            <div className="gb-modal-body">
              {/* Category guest list */}
              {activeCategory ? (
                <>
                  <button
                    onClick={() => setActiveCategory(null)}
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid rgba(192,64,90,0.2)', padding: '11px 20px', cursor: 'pointer', fontFamily: 'LinLibertine, serif', fontSize: '0.85rem', color: '#c0405a', letterSpacing: '0.08em', fontStyle: 'italic' }}
                  >
                    ← All categories
                  </button>
                  {categoryGuests.length === 0 ? (
                    <p style={{ padding: '16px 20px', fontFamily: 'LinLibertine, serif', fontStyle: 'italic', color: '#3a4858', fontSize: '0.95rem', opacity: 0.6 }}>None found</p>
                  ) : categoryGuests.map(g => (
                    <Link key={g.id} href={`/guest/${g.id}`} className="gb-result-item" onClick={() => { setModalOpen(false); setActiveCategory(null) }}>
                      {g.name}
                      <span className="pg">p. {g.pageNum}</span>
                    </Link>
                  ))}
                </>
              ) : searchQuery ? (
                /* Search results */
                searchResults.length > 0 ? searchResults.map(g => (
                  <button key={g.id} className="gb-result-item" onClick={() => { jumpToGuest(g.pageNum); setModalOpen(false) }}>
                    {g.name}
                    <span className="pg">p. {g.pageNum} — jump to page</span>
                  </button>
                )) : (
                  <p style={{ padding: '16px 20px', fontFamily: 'LinLibertine, serif', fontStyle: 'italic', color: '#3a4858', fontSize: '0.95rem', opacity: 0.6 }}>No matches found</p>
                )
              ) : (
                /* Browse by type */
                CATEGORIES.map(cat => (
                  <button key={cat.label} className="gb-cat-btn" onClick={() => setActiveCategory(cat.label)}>
                    {cat.label}
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>›</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Jump to Next Profile — downward arrow */}
      {showPanel && (
        <button
          onClick={jumpToNext}
          title="Jump to next notable guest"
          style={{ position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 300, background: 'none', border: 'none', padding: 0, cursor: 'pointer', filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.4))', transition: 'filter 0.15s', opacity: 0.9 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'drop-shadow(2px 3px 10px rgba(0,0,0,0.6)) brightness(1.08)'; (e.currentTarget as HTMLElement).style.opacity = '1' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'drop-shadow(2px 2px 6px rgba(0,0,0,0.4))'; (e.currentTarget as HTMLElement).style.opacity = '0.9' }}
        >
          <svg width="46" height="148" viewBox="0 0 46 148" xmlns="http://www.w3.org/2000/svg">
            <path d="M 8,2 L 38,2 A 6,6 0 0 1 44,8 L 44,108 L 23,146 L 2,108 L 2,8 A 6,6 0 0 1 8,2 Z"
                  fill="#f0deb8" stroke="#1a1209" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M 12,8 L 34,8 A 3,3 0 0 1 37,11 L 37,105 L 23,136 L 9,105 L 9,11 A 3,3 0 0 1 12,8 Z"
                  fill="#c0405a"/>
            <path d="M 15,13 L 31,13 A 2,2 0 0 1 33,15 L 33,102 L 23,127 L 13,102 L 13,15 A 2,2 0 0 1 15,13 Z"
                  fill="#f0deb8"/>
            <text x="23" y="28" fontFamily="'Decary', sans-serif" fontSize="15" fontWeight="700" fill="#c0405a" textAnchor="middle">N</text>
            <text x="23" y="45" fontFamily="'Decary', sans-serif" fontSize="15" fontWeight="700" fill="#c0405a" textAnchor="middle">E</text>
            <text x="23" y="62" fontFamily="'Decary', sans-serif" fontSize="15" fontWeight="700" fill="#c0405a" textAnchor="middle">X</text>
            <text x="23" y="79" fontFamily="'Decary', sans-serif" fontSize="15" fontWeight="700" fill="#c0405a" textAnchor="middle">T</text>
          </svg>
        </button>
      )}

      {allPages.map((pageNum) => {
        const guests = pageMap[pageNum] ?? []
        return (
          <div
            key={pageNum}
            id={`page-${pageNum}`}
            style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}
          >
            {pageNum === 70 && (
              <div className="gb-guest-row" style={{ top: '46%', cursor: 'default' }}>
                <svg className="gb-arrow-svg" width="130" height="40" viewBox="0 0 130 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 10,2 L 92,2 L 128,20 L 92,38 L 10,38 A 8,8 0 0 1 2,30 L 2,10 A 8,8 0 0 1 10,2 Z" fill="#f0deb8" stroke="#1a1209" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M 11,8 L 88,8 L 120,20 L 88,32 L 11,32 A 4,4 0 0 1 7,28 L 7,12 A 4,4 0 0 1 11,8 Z" fill="#c0405a"/>
                  <path d="M 13,13 L 83,13 L 111,20 L 83,27 L 13,27 A 2,2 0 0 1 11,25 L 11,15 A 2,2 0 0 1 13,13 Z" fill="#f0deb8"/>
                </svg>
                <div className="gb-tooltip">
                  <p className="gb-tooltip-name">Japanese Visitors — Page 70</p>
                  <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.68rem', color: '#3a2a1a', lineHeight: 1.7, marginBottom: '4px' }}>
                    <tbody>
                      <tr><td style={{ paddingRight: '8px', fontWeight: 600 }}>林 正 吉</td><td>Hayashi Masayoshi — Tokyo</td></tr>
                      <tr><td style={{ paddingRight: '8px', fontWeight: 600 }}>永 井 定 治</td><td>Nagai Teiji — Tokyo</td></tr>
                      <tr><td style={{ paddingRight: '8px', fontWeight: 600 }}>石 黒 孫 康</td><td>Ishiguro Magoyasu — Kobe</td></tr>
                    </tbody>
                  </table>
                  <p className="gb-tooltip-cta">Names written in Japanese kanji</p>
                </div>
              </div>
            )}
            <img
              src={pageImg(pageNum)}
              alt={`Page ${pageNum}`}
              loading={pageNum <= 4 ? 'eager' : 'lazy'}
              style={{ width: '100%', display: 'block', boxShadow: '0 4px 32px rgba(0,0,0,0.45)' }}
            />
            {pageNum > 0 && (
              <div className="gb-page-num">p.&nbsp;{pageNum}</div>
            )}
            {guests.map((g) => (
              <Link
                key={g.id}
                href={`/guest/${g.id}`}
                className="gb-guest-row"
                style={{ top: `${g.guestbookCoords.y * 100}%` }}
                title={g.name}
              >
                <svg className="gb-arrow-svg" width="130" height="40" viewBox="0 0 130 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 10,2 L 92,2 L 128,20 L 92,38 L 10,38 A 8,8 0 0 1 2,30 L 2,10 A 8,8 0 0 1 10,2 Z" fill="#f0deb8" stroke="#1a1209" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M 11,8 L 88,8 L 120,20 L 88,32 L 11,32 A 4,4 0 0 1 7,28 L 7,12 A 4,4 0 0 1 11,8 Z" fill="#c0405a"/>
                  <path d="M 13,13 L 83,13 L 111,20 L 83,27 L 13,27 A 2,2 0 0 1 11,25 L 11,15 A 2,2 0 0 1 13,13 Z" fill="#f0deb8"/>
                </svg>
                <div className="gb-tooltip">
                  <p className="gb-tooltip-name">{g.name}</p>
                  <p className="gb-tooltip-desc">{shortDesc(g.knownFor)}</p>
                  <p className="gb-tooltip-cta">Click to read more</p>
                </div>
              </Link>
            ))}
          </div>
        )
      })}

      <footer style={{ padding: '40px 0', textAlign: 'center', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a89070' }}>
        Aladdin Tiffin Room · San Francisco · 1921–1933
      </footer>
    </main>
  )
}
