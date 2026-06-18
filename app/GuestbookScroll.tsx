'use client'

import Link from 'next/link'

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

// Highlight dimensions as fraction of image size
// x/y are the center of the highlight
const HL_W = 0.52   // width: covers name column
const HL_H = 0.048  // height: one ruled line

function pageImg(n: number) {
  return `/guestbook-pages/pg${String(n).padStart(3, '0')}.jpg`
}

function shortDesc(knownFor: string): string {
  const sentence = knownFor.split(/[.—]/)[0].trim()
  return sentence.length > 140 ? sentence.slice(0, 137) + '…' : sentence
}

export default function GuestbookScroll({ pageMap }: Props) {
  const allPages = [0, ...Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1)]

  return (
    <main style={{ background: BG }}>
      <style>{`
        .gb-highlight {
          position: absolute;
          background: rgba(251,191,36,0.28);
          mix-blend-mode: multiply;
          border-radius: 2px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease;
          display: block;
        }
        .gb-highlight:hover {
          background: rgba(251,191,36,0.52);
        }
        .gb-tooltip {
          display: none;
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          width: 260px;
          background: rgba(20,14,6,0.95);
          color: #f5e9d0;
          border-radius: 3px;
          padding: 10px 12px;
          z-index: 100;
          pointer-events: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          font-family: 'Palatino Linotype', Palatino, serif;
          white-space: normal;
        }
        .gb-highlight:hover .gb-tooltip {
          display: block;
        }
        .gb-tooltip-name {
          margin: 0 0 4px;
          font-weight: 700;
          color: #fbbf24;
          font-size: 0.85rem;
          font-style: italic;
        }
        .gb-tooltip-desc {
          margin: 0 0 6px;
          font-size: 0.72rem;
          line-height: 1.5;
          opacity: 0.88;
        }
        .gb-tooltip-cta {
          margin: 0;
          font-size: 0.6rem;
          opacity: 0.4;
          letter-spacing: 0.06em;
          text-transform: uppercase;
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

            {guests.map((g) => {
              const left = `${(g.guestbookCoords.x - HL_W / 2) * 100}%`
              const top = `${(g.guestbookCoords.y - HL_H / 2) * 100}%`
              const width = `${HL_W * 100}%`
              const height = `${HL_H * 100}%`
              return (
                <Link
                  key={g.id}
                  href={`/guest/${g.id}`}
                  className="gb-highlight"
                  style={{ left, top, width, height }}
                >
                  <div className="gb-tooltip">
                    <p className="gb-tooltip-name">{g.name}</p>
                    <p className="gb-tooltip-desc">{shortDesc(g.knownFor)}</p>
                    <p className="gb-tooltip-cta">Click to read more</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )
      })}

      <footer style={{ padding: '40px 0', textAlign: 'center', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a89070' }}>
        Aladdin Tiffin Room · San Francisco · 1921–1933
      </footer>
    </main>
  )
}
