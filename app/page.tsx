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
      {/* ── COVER HERO ── */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(280px, 38vw, 520px)', overflow: 'hidden' }}>
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
          @font-face {
            font-family: 'HornbillItalic';
            src: url('/fonts/hornbill-italic.ttf') format('truetype');
            font-display: block;
          }
          .cover-link {
            font-family: 'Hornbill', serif;
            color: #c8b07a;
            text-decoration: none;
            border-bottom: 1px solid rgba(200,176,122,0.4);
            padding-bottom: 2px;
            transition: color 0.2s, border-color 0.2s;
          }
          .cover-link:hover {
            color: #e0c88a;
            border-bottom-color: rgba(224,200,138,0.7);
          }
        `}</style>

        {/* Cover image */}
        <img
          src="/guestbook-pages/pg000.jpg"
          alt="Aladdin Studio Tiffin Room Guest Book cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
        />

        {/* Dark gradient on the left so text reads clearly */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(18,24,32,0.32) 0%, rgba(18,24,32,0.18) 44%, transparent 64%)',
          pointerEvents: 'none',
        }} />

        {/* Overlay text — left side only, clear of the spine text */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: '58%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(24px, 4vw, 60px) clamp(24px, 4vw, 56px)',
        }}>
          {/* SVG title — textLength forces all 3 lines to equal width */}
          <svg
            viewBox="0 0 600 215"
            style={{ width: '100%', display: 'block', overflow: 'visible', marginBottom: 'clamp(10px, 1.8vw, 22px)', filter: 'drop-shadow(0 2px 16px rgba(0,0,0,0.85))' }}
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

          <div style={{
            width: 'clamp(60px, 10vw, 120px)',
            height: '1px',
            background: 'linear-gradient(90deg, #8a7040, transparent)',
            margin: '0 0 clamp(10px, 1.5vw, 20px)',
            opacity: 0.7,
          }} />

          <p style={{
            fontFamily: "'Hornbill', serif",
            fontSize: 'clamp(0.85rem, 1.7vw, 1.2rem)',
            color: '#c8b07a',
            lineHeight: 1.5,
            margin: '0 0 clamp(14px, 2vw, 28px)',
            textShadow: '0 1px 8px rgba(0,0,0,0.6)',
          }}>
            Vaudeville, Silent Film, and the Mooser Sisters of San Francisco
          </p>

          <Link href="/story" className="cover-link" style={{ fontSize: 'clamp(0.72rem, 1.2vw, 0.95rem)' }}>
            Hattie and Minnie Mooser →
          </Link>
        </div>
      </div>

      {/* ── GUESTBOOK SCROLL ── */}
      <GuestbookScroll pageMap={pageMap} />
    </>
  )
}
