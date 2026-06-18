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
      {/* ── COVER HEADER ── */}
      <div style={{
        background: '#1e2b3a',
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)
        `,
        padding: '36px 40px 32px',
        textAlign: 'center',
      }}>
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
          .hdp {
            font-family: 'HotelDeParis', serif;
            color: #a89060;
            line-height: 1.05;
            text-shadow: 0 1px 6px rgba(0,0,0,0.6);
            margin: 0;
          }
          .ub {
            font-family: 'UncleBob', serif;
            color: #8a7448;
            line-height: 1.2;
            text-shadow: 0 1px 4px rgba(0,0,0,0.5);
            margin: 0;
          }
          .cover-rule {
            width: 140px;
            height: 1px;
            background: linear-gradient(90deg, transparent, #8a7448, transparent);
            margin: 14px auto;
            opacity: 0.5;
          }
          .cover-link {
            font-family: 'UncleBob', serif;
            color: #8a7448;
            text-decoration: none;
            border-bottom: 1px solid rgba(138,116,72,0.35);
            padding-bottom: 2px;
            transition: color 0.2s, border-color 0.2s;
          }
          .cover-link:hover {
            color: #a89060;
            border-bottom-color: rgba(168,144,96,0.6);
          }
        `}</style>

        {/* Hotel De Paris: Aladdin Studio */}
        <p className="hdp" style={{ fontSize: 'clamp(2rem, 6vw, 3.8rem)' }}>
          Aladdin Studio
        </p>

        {/* Hotel De Paris: Tiffin Room */}
        <p className="hdp" style={{ fontSize: 'clamp(2rem, 6vw, 3.8rem)' }}>
          Tiffin Room
        </p>

        <div className="cover-rule" />

        {/* Uncle Bob: Guest Book 1921–1928 */}
        <p className="ub" style={{ fontSize: 'clamp(1rem, 3vw, 2rem)', marginBottom: 10 }}>
          Guest Book 1921–1928
        </p>

        {/* Uncle Bob: Hattie and Minnie Mooser */}
        <Link href="/story" className="cover-link" style={{ fontSize: 'clamp(0.75rem, 2vw, 1.2rem)' }}>
          Hattie and Minnie Mooser
        </Link>
      </div>

      {/* ── GUESTBOOK SCROLL ── */}
      <GuestbookScroll pageMap={pageMap} />
    </>
  )
}
