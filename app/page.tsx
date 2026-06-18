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
      <div style={{
        minHeight: '100vh',
        background: '#1e2b3a',
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 40px',
      }}>
        <style>{`
          @font-face {
            font-family: 'HotelDeParis';
            src: url('/fonts/hotel_de_paris.ttf') format('truetype');
            font-display: block;
          }
          .hdp {
            font-family: 'HotelDeParis', 'Palatino Linotype', serif;
            color: #c9a84c;
            text-align: center;
            line-height: 1.1;
            text-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 60px rgba(201,168,76,0.1);
          }
          .cover-rule {
            width: 180px;
            height: 1px;
            background: linear-gradient(90deg, transparent, #c9a84c, transparent);
            margin: 24px auto;
            opacity: 0.5;
          }
          .cover-link {
            font-family: 'HotelDeParis', serif;
            color: #c9a84c;
            text-decoration: none;
            border-bottom: 1px solid rgba(201,168,76,0.35);
            padding-bottom: 3px;
            transition: color 0.2s, border-color 0.2s;
            text-shadow: 0 1px 4px rgba(0,0,0,0.5);
            opacity: 0.75;
          }
          .cover-link:hover {
            color: #e8c96a;
            border-bottom-color: rgba(232,201,106,0.7);
            opacity: 1;
          }
          @keyframes bobdown {
            0%, 100% { opacity: 0.35; transform: translateY(0); }
            50% { opacity: 0.75; transform: translateY(5px); }
          }
          .scroll-cue {
            font-family: 'HotelDeParis', serif;
            color: #c9a84c;
            font-size: clamp(0.7rem, 1.5vw, 0.9rem);
            letter-spacing: 0.15em;
            animation: bobdown 2.8s ease-in-out infinite;
            margin-top: 64px;
          }
        `}</style>

        {/* Line 1: Aladdin Studio */}
        <p className="hdp" style={{ fontSize: 'clamp(2.8rem, 9vw, 6rem)', margin: 0 }}>
          Aladdin Studio
        </p>

        {/* Line 2: Tiffin Room */}
        <p className="hdp" style={{ fontSize: 'clamp(2.8rem, 9vw, 6rem)', margin: '0 0 4px' }}>
          Tiffin Room
        </p>

        <div className="cover-rule" />

        {/* Line 3: Guest Book 1921–1928 */}
        <p className="hdp" style={{ fontSize: 'clamp(1.4rem, 4.5vw, 3rem)', margin: '0 0 32px', opacity: 0.9 }}>
          Guest Book 1921–1928
        </p>

        {/* Hattie and Minnie — smaller, links to story */}
        <Link href="/story" className="cover-link" style={{ fontSize: 'clamp(1rem, 3vw, 1.8rem)' }}>
          Hattie and Minnie Mooser
        </Link>

        <div className="scroll-cue">↓ &nbsp; open the guestbook</div>
      </div>

      {/* ── GUESTBOOK SCROLL ── */}
      <GuestbookScroll pageMap={pageMap} />
    </>
  )
}
