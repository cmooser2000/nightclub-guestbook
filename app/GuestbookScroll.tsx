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
    <main style={{ background: BG }}>


      {/* Jump to Next Profile — fixed left pill */}
      <button
        onClick={jumpToNext}
        style={{
          position: 'fixed',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 300,
          background: '#1a1209',
          color: '#c9a84c',
          border: 'none',
          borderRadius: '0 6px 6px 0',
          padding: '14px 10px',
          cursor: 'pointer',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          rotate: '180deg',
          fontSize: '0.6rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: 0.85,
          boxShadow: '2px 0 12px rgba(0,0,0,0.25)',
          transition: 'opacity 0.15s, background 0.15s',
          fontFamily: 'var(--font-playfair), Georgia, serif',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.background = '#2d1f0a' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; (e.currentTarget as HTMLElement).style.background = '#1a1209' }}
        title="Jump to next notable guest"
      >
        Next&nbsp;Profile&nbsp;↓
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
        .gb-tooltip {
          display: none;
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          width: 260px;
          background: #fffcf8;
          color: #1a1209;
          border: 2px solid #c0405a;
          border-radius: 3px;
          padding: 10px 12px;
          z-index: 100;
          pointer-events: none;
          box-shadow: 0 3px 14px rgba(0,0,0,0.18);
          font-family: 'Palatino Linotype', Palatino, serif;
          white-space: normal;
        }
        .gb-guest-row:hover .gb-tooltip {
          display: block;
        }
        .gb-tooltip-name {
          margin: 0 0 4px;
          font-weight: 700;
          color: #c0405a;
          font-size: 0.85rem;
          font-style: italic;
        }
        .gb-tooltip-desc {
          margin: 0 0 6px;
          font-size: 0.72rem;
          line-height: 1.5;
          color: #3a2a1a;
        }
        .gb-tooltip-cta {
          margin: 0;
          font-size: 0.6rem;
          opacity: 0.45;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #1a1209;
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
            <img
              src={pageImg(pageNum)}
              alt={`Page ${pageNum}`}
              loading={pageNum <= 4 ? 'eager' : 'lazy'}
              style={{ width: '100%', display: 'block' }}
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
