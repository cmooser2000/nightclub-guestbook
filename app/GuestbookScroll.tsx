'use client'

import Link from 'next/link'
import { useCallback, useMemo } from 'react'

interface GuestEntry {
  id: string
  name: string
  knownFor: string
  guestbookCoords: { x: number; y: number }
}

interface Props {
  pageMap: Record<number, GuestEntry[]>
}

const TOTAL_PAGES = 418
const BG = '#f7f2ea'


function pageImg(n: number) {
  return `/guestbook-pages/pg${String(n).padStart(3, '0')}.jpg`
}

function shortDesc(knownFor: string): string {
  const sentence = knownFor.split(/[.—]/)[0].trim()
  return sentence.length > 140 ? sentence.slice(0, 137) + '…' : sentence
}

export default function GuestbookScroll({ pageMap }: Props) {
  const allPages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1)

  // Sorted list of all guests by page (then y) for jump navigation
  const sortedGuests = useMemo(() => {
    return Object.entries(pageMap)
      .flatMap(([page, guests]) =>
        guests.map((g) => ({ ...g, pageNum: Number(page) }))
      )
      .sort((a, b) => a.pageNum !== b.pageNum ? a.pageNum - b.pageNum : a.guestbookCoords.y - b.guestbookCoords.y)
  }, [pageMap])

  const jumpToNext = useCallback(() => {
    if (sortedGuests.length === 0) return

    // Viewport midpoint in document coordinates
    const mid = window.scrollY + window.innerHeight * 0.4

    // Find first guest whose page top is beyond mid
    for (const g of sortedGuests) {
      const el = document.getElementById(`page-${g.pageNum}`)
      if (!el) continue
      const pageTop = el.getBoundingClientRect().top + window.scrollY
      if (pageTop > mid) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    // Wrap: jump back to first guest
    const firstEl = document.getElementById(`page-${sortedGuests[0].pageNum}`)
    firstEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [sortedGuests])

  return (
    <main style={{ background: 'transparent' }}>


      {/* Jump to Next Profile — downward arrow */}
      <button
        onClick={jumpToNext}
        title="Jump to next notable guest"
        style={{ position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 300, background: 'none', border: 'none', padding: 0, cursor: 'pointer', filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.4))', transition: 'filter 0.15s', opacity: 0.9 }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'drop-shadow(2px 3px 10px rgba(0,0,0,0.6)) brightness(1.08)'; (e.currentTarget as HTMLElement).style.opacity = '1' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'drop-shadow(2px 2px 6px rgba(0,0,0,0.4))'; (e.currentTarget as HTMLElement).style.opacity = '0.9' }}
      >
        <svg width="46" height="148" viewBox="0 0 46 148" xmlns="http://www.w3.org/2000/svg">
          {/* Outer: cream fill + black stroke, points down */}
          <path d="M 8,2 L 38,2 A 6,6 0 0 1 44,8 L 44,108 L 23,146 L 2,108 L 2,8 A 6,6 0 0 1 8,2 Z"
                fill="#f0deb8" stroke="#1a1209" strokeWidth="2.5" strokeLinejoin="round"/>
          {/* Fuchsia band */}
          <path d="M 12,8 L 34,8 A 3,3 0 0 1 37,11 L 37,105 L 23,136 L 9,105 L 9,11 A 3,3 0 0 1 12,8 Z"
                fill="#c0405a"/>
          {/* Inner cream */}
          <path d="M 15,13 L 31,13 A 2,2 0 0 1 33,15 L 33,102 L 23,127 L 13,102 L 13,15 A 2,2 0 0 1 15,13 Z"
                fill="#f0deb8"/>
          {/* NEXT text — vertical, in Decary */}
          <text
            x="23" y="30"
            fontFamily="decary, sans-serif"
            fontSize="10"
            fill="#1a1209"
            textAnchor="middle"
            letterSpacing="3"
            writingMode="tb"
          >NEXT</text>
        </svg>
      </button>

      <style>{`
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
        .gb-guest-row:hover {
          z-index: 20;
        }
        .gb-arrow-svg {
          flex-shrink: 0;
          filter: drop-shadow(1px 2px 4px rgba(0,0,0,0.4));
          transition: filter 0.15s ease;
        }
        .gb-guest-row:hover .gb-arrow-svg {
          filter: drop-shadow(1px 3px 8px rgba(0,0,0,0.55)) brightness(1.08);
        }
        @font-face { font-family: 'USDeclaration'; src: url('/fonts/us-declaration.ttf') format('truetype'); font-display: block; }
        @font-face { font-family: 'Decary'; src: url('/fonts/decary.otf') format('opentype'); font-display: block; }
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
        .gb-guest-row:hover .gb-tooltip {
          display: block;
        }
        .gb-tooltip-name {
          margin: 0 0 6px;
          color: #c0405a;
          font-family: 'USDeclaration', serif;
          font-size: 1rem;
          font-style: normal;
          font-weight: normal;
          line-height: 1.3;
        }
        .gb-tooltip-desc {
          display: none;
        }
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

      {allPages.map((pageNum) => {
        const guests = pageMap[pageNum] ?? []
        return (
          <div
            key={pageNum}
            id={`page-${pageNum}`}
            style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}
          >
            {pageNum === 70 && (
              <div
                className="gb-guest-row"
                style={{ top: '46%', cursor: 'default' }}
              >
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
                {/* Vintage arrow sign: cream center, red band, black outline */}
                <svg className="gb-arrow-svg" width="130" height="40" viewBox="0 0 130 40" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer: cream fill + black stroke */}
                  <path
                    d="M 10,2 L 92,2 L 128,20 L 92,38 L 10,38 A 8,8 0 0 1 2,30 L 2,10 A 8,8 0 0 1 10,2 Z"
                    fill="#f0deb8" stroke="#1a1209" strokeWidth="2.5" strokeLinejoin="round"
                  />
                  {/* Red band */}
                  <path
                    d="M 11,8 L 88,8 L 120,20 L 88,32 L 11,32 A 4,4 0 0 1 7,28 L 7,12 A 4,4 0 0 1 11,8 Z"
                    fill="#c0405a"
                  />
                  {/* Inner cream */}
                  <path
                    d="M 13,13 L 83,13 L 111,20 L 83,27 L 13,27 A 2,2 0 0 1 11,25 L 11,15 A 2,2 0 0 1 13,13 Z"
                    fill="#f0deb8"
                  />
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
