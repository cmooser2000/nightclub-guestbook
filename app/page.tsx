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
            font-family: 'HotelDeParis';
            src: url('/fonts/hotel_de_paris.ttf') format('truetype');
            font-display: block;
          }
          @font-face {
            font-family: 'UncleBob';
            src: url('/fonts/uncle-bob.ttf') format('truetype');
            font-display: block;
          }
          .cover-link {
            font-family: 'UncleBob', serif;
            color: #9a8458;
            text-decoration: none;
            border-bottom: 1px solid rgba(154,132,88,0.35);
            padding-bottom: 2px;
            transition: color 0.2s, border-color 0.2s;
          }
          .cover-link:hover {
            color: #c4a870;
            border-bottom-color: rgba(196,168,112,0.6);
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
          background: 'linear-gradient(to right, rgba(18,24,32,0.72) 0%, rgba(18,24,32,0.55) 42%, transparent 62%)',
          pointerEvents: 'none',
        }} />

        {/* Overlay text — left side only, clear of the spine text */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: '54%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(24px, 4vw, 60px) clamp(24px, 4vw, 56px)',
        }}>
          <p style={{
            fontFamily: "'HotelDeParis', serif",
            fontSize: 'clamp(1.4rem, 3.2vw, 2.8rem)',
            color: '#b8964e',
            lineHeight: 1.1,
            margin: '0 0 clamp(10px, 1.5vw, 20px)',
            textShadow: '0 2px 14px rgba(0,0,0,0.7)',
            letterSpacing: '0.01em',
          }}>
            Everybody Came to the Aladdin
          </p>

          <div style={{
            width: 'clamp(60px, 8vw, 100px)',
            height: '1px',
            background: 'linear-gradient(90deg, #8a7040, transparent)',
            margin: '0 0 clamp(10px, 1.5vw, 20px)',
            opacity: 0.7,
          }} />

          <p style={{
            fontFamily: 'var(--font-garamond), Georgia, serif',
            fontSize: 'clamp(0.8rem, 1.6vw, 1.15rem)',
            color: '#c8b07a',
            lineHeight: 1.55,
            margin: '0 0 clamp(14px, 2vw, 28px)',
            fontStyle: 'italic',
            textShadow: '0 1px 8px rgba(0,0,0,0.6)',
          }}>
            Vaudeville, Silent Film, and the<br />Mooser Sisters of San Francisco
          </p>

          <Link href="/story" className="cover-link" style={{ fontSize: 'clamp(0.65rem, 1.1vw, 0.85rem)', letterSpacing: '0.08em' }}>
            Hattie &amp; Minnie Mooser →
          </Link>
        </div>
      </div>

      {/* ── GUESTBOOK SCROLL ── */}
      <GuestbookScroll pageMap={pageMap} />
    </>
  )
}
