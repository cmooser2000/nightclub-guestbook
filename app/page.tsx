import { getGuests } from '@/lib/guests'
import GuestbookScroll from './GuestbookScroll'
import Link from 'next/link'

export default async function Home() {
  const guests = await getGuests()

  const pageMap: Record<number, { id: string; name: string; knownFor: string; guestbookCoords: { x: number; y: number } }[]> = {}
  for (const g of guests) {
    if (!pageMap[g.guestbookPage]) pageMap[g.guestbookPage] = []
    pageMap[g.guestbookPage].push({
      id: g.id,
      name: g.name,
      knownFor: g.knownFor,
      guestbookCoords: g.guestbookCoords ?? { x: 0.5, y: 0.5 },
    })
  }

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'UncleBob';
          src: url('/fonts/uncle-bob.ttf') format('truetype');
          font-display: block;
        }
        @font-face {
          font-family: 'Hornbill';
          src: url('/fonts/hornbill.ttf') format('truetype');
          font-display: block;
        }
        .cover-link {
          font-family: 'Hornbill', serif;
          color: #c8b07a;
          text-decoration: none;
          border-bottom: 1px solid rgba(200,176,122,0.4);
          padding-bottom: 2px;
          transition: color 0.2s;
        }
        .cover-link:hover { color: #e0c070; }
        .scroll-hint {
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.45; }
          50% { transform: translateX(-50%) translateY(7px); opacity: 0.9; }
        }
      `}</style>

      {/* ── FIXED COVER — dark background matches hero, book cover reveals on scroll ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#1e1a18' }}>
        <img
          src="/guestbook-pages/pg000.jpg"
          alt=""
          aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '28% center', display: 'block' }}
        />
      </div>

      {/* ── HERO — Hattie & Minnie photo, scrolls away to reveal guestbook cover ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        background: '#1e1a18',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Hero photo — full bleed */}
        <img
          src="/hero.png"
          alt="Hattie and Minnie Mooser"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center center',
            display: 'block',
          }}
        />
        {/* Overlay so our title text pops */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(18,12,8,0.4)', pointerEvents: 'none' }} />

        {/* Text */}
        <div style={{
          position: 'relative', zIndex: 2,
          padding: 'clamp(40px, 8vw, 100px) clamp(32px, 8vw, 120px)',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        }}>
          <svg
            viewBox="0 0 600 215"
            style={{ width: 'min(600px, 88vw)', display: 'block', overflow: 'visible', marginBottom: 'clamp(16px, 2.5vw, 32px)', filter: 'drop-shadow(0 2px 14px rgba(0,0,0,0.8))' }}
            aria-label="Everybody Came to the Aladdin"
          >
            <text x="0" y="62" fontFamily="UncleBob, serif" fill="#c0405a"
              fontSize="62" textLength="600" lengthAdjust="spacingAndGlyphs">
              Everybody
            </text>
            <text x="0" y="132" fontFamily="UncleBob, serif" fill="#c0405a"
              fontSize="62" textLength="600" lengthAdjust="spacingAndGlyphs">
              Came to the
            </text>
            <text x="0" y="215" fontFamily="UncleBob, serif" fill="#c0405a"
              fontSize="88" textLength="600" lengthAdjust="spacingAndGlyphs">
              Aladdin
            </text>
          </svg>

          <div style={{ width: 'clamp(60px, 12vw, 140px)', height: '1px', background: 'linear-gradient(90deg, #c8b07a, transparent)', margin: '0 0 clamp(12px, 2vw, 24px)', opacity: 0.6 }} />

          <Link href="/story" className="cover-link" style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)' }}>
            Hattie and Minnie Mooser →
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint" style={{
          position: 'absolute', bottom: 36, left: '50%',
          fontSize: '1.4rem', color: 'rgba(200,176,122,0.7)',
        }}>
          ↓
        </div>
      </div>

      {/* ── GUESTBOOK PAGES — scroll over the fixed cover ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <GuestbookScroll pageMap={pageMap} />
      </div>
    </>
  )
}
