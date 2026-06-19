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
          background: 'linear-gradient(to right, rgba(18,24,32,0.78) 0%, rgba(18,24,32,0.6) 44%, transparent 64%)',
          pointerEvents: 'none',
        }} />

        {/* Overlay text — left side only, clear of the spine text */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: '58%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(24px, 4vw, 60px) clamp(24px, 4vw, 56px)',
        }}>
          <p style={{
            fontFamily: "'UncleBob', serif",
            fontSize: 'clamp(2.2rem, 6.5vw, 6rem)',
            color: '#b84a42',
            lineHeight: 1.0,
            margin: '0 0 clamp(10px, 1.8vw, 22px)',
            textShadow: '0 2px 18px rgba(0,0,0,0.85)',
          }}>
            Everybody Came to the Aladdin
          </p>

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
