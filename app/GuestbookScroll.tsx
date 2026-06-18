'use client'

import Link from 'next/link'

interface GuestEntry {
  id: string
  name: string
  knownFor: string
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
  const allPages = [0, ...Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1)]

  return (
    <main style={{ background: BG }}>
      <style>{`
        .gb-label {
          display: inline-block;
          padding: 3px 10px 3px 8px;
          font-family: 'Palatino Linotype', Palatino, serif;
          font-style: italic;
          font-size: 0.85rem;
          font-weight: 600;
          color: #78350f;
          background: rgba(255,251,235,0.95);
          border-left: 2px solid #b45309;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          cursor: pointer;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: all 0.15s ease;
        }
        .gb-label:hover {
          color: #92400e;
          background: rgba(254,243,199,1);
          border-left-color: #d97706;
          box-shadow: 0 0 0 1px #fbbf24, 0 2px 12px rgba(180,83,9,0.25);
        }
        .gb-label-wrap {
          position: relative;
          display: inline-block;
        }
        .gb-tooltip {
          display: none;
          position: absolute;
          bottom: calc(100% + 8px);
          left: 0;
          width: 280px;
          background: rgba(20,14,6,0.96);
          color: #f5e9d0;
          border-radius: 3px;
          padding: 10px 12px;
          z-index: 50;
          pointer-events: none;
          box-shadow: 0 4px 24px rgba(0,0,0,0.45);
          font-family: 'Palatino Linotype', Palatino, serif;
        }
        .gb-label-wrap:hover .gb-tooltip {
          display: block;
        }
        .gb-tooltip-name {
          margin: 0 0 4px;
          font-weight: 700;
          color: #fbbf24;
          font-size: 0.85rem;
        }
        .gb-tooltip-desc {
          margin: 0 0 6px;
          font-size: 0.75rem;
          line-height: 1.5;
          opacity: 0.9;
        }
        .gb-tooltip-cta {
          margin: 0;
          font-size: 0.65rem;
          opacity: 0.45;
          letter-spacing: 0.05em;
        }
        .gb-page-num {
          position: absolute;
          top: 8px;
          right: 10px;
          font-size: 0.65rem;
          font-family: Georgia, serif;
          color: rgba(100,70,40,0.45);
          letter-spacing: 0.05em;
          user-select: none;
          pointer-events: none;
        }
        .gb-labels {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
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

            {guests.length > 0 && (
              <div className="gb-labels">
                {guests.map((g) => (
                  <div key={g.id} className="gb-label-wrap">
                    <Link href={`/guest/${g.id}`} className="gb-label">
                      ✓ {g.name}
                    </Link>
                    <div className="gb-tooltip">
                      <p className="gb-tooltip-name">{g.name}</p>
                      <p className="gb-tooltip-desc">{shortDesc(g.knownFor)}</p>
                      <p className="gb-tooltip-cta">CLICK TO READ MORE</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <footer style={{ padding: '40px 0', textAlign: 'center', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a89070' }}>
        Aladdin Tiffin Room · San Francisco · 1921–1933
      </footer>
    </main>
  )
}
