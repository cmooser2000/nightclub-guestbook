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
        // Subtle fabric/linen weave texture
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.015) 2px,
            rgba(255,255,255,0.015) 4px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.015) 2px,
            rgba(255,255,255,0.015) 4px
          )
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 40px',
        gap: 0,
      }}>
        <style>{`
          .cover-text {
            font-family: var(--font-cinzel), 'Palatino Linotype', serif;
            color: #c9a84c;
            text-align: center;
            line-height: 1.15;
            letter-spacing: 0.12em;
            text-shadow:
              0 1px 3px rgba(0,0,0,0.6),
              0 0 40px rgba(201,168,76,0.12);
          }
          .cover-rule {
            width: 120px;
            height: 1px;
            background: linear-gradient(90deg, transparent, #c9a84c, transparent);
            margin: 28px auto;
            opacity: 0.6;
          }
          .cover-link {
            font-family: var(--font-cinzel), serif;
            color: #c9a84c;
            letter-spacing: 0.14em;
            text-decoration: none;
            border-bottom: 1px solid rgba(201,168,76,0.4);
            padding-bottom: 2px;
            transition: color 0.2s, border-color 0.2s;
            text-shadow: 0 1px 3px rgba(0,0,0,0.5);
          }
          .cover-link:hover {
            color: #e8c96a;
            border-bottom-color: rgba(232,201,106,0.8);
          }
          .scroll-cue {
            position: absolute;
            bottom: 32px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(201,168,76,0.4);
            font-family: var(--font-cinzel), serif;
            font-size: 0.6rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            animation: bounce 2.5s ease-in-out infinite;
          }
          @keyframes bounce {
            0%, 100% { opacity: 0.4; transform: translateX(-50%) translateY(0); }
            50% { opacity: 0.9; transform: translateX(-50%) translateY(6px); }
          }
        `}</style>

        <p className="cover-text" style={{ fontSize: 'clamp(1.6rem, 5vw, 3rem)', fontWeight: 900, marginBottom: 0 }}>
          GUEST BOOK
        </p>

        <div className="cover-rule" />

        <p className="cover-text" style={{ fontSize: 'clamp(2rem, 6.5vw, 3.8rem)', fontWeight: 900, margin: 0 }}>
          ALADDIN
        </p>
        <p className="cover-text" style={{ fontSize: 'clamp(2rem, 6.5vw, 3.8rem)', fontWeight: 900, margin: '0 0 36px' }}>
          STUDIO
        </p>

        <p className="cover-text" style={{ fontSize: 'clamp(2rem, 6.5vw, 3.8rem)', fontWeight: 900, margin: 0 }}>
          TIFFIN
        </p>
        <p className="cover-text" style={{ fontSize: 'clamp(2rem, 6.5vw, 3.8rem)', fontWeight: 900, margin: '0 0 36px' }}>
          ROOM
        </p>

        <div className="cover-rule" />

        <p className="cover-text" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 700, marginBottom: 48 }}>
          1921–28
        </p>

        <Link href="/story" className="cover-link" style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)', fontWeight: 400 }}>
          Hattie and Minnie Mooser
        </Link>

        <div className="scroll-cue" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', marginTop: 80 }}>
          ↓ &nbsp; open the guestbook
        </div>
      </div>

      {/* ── GUESTBOOK SCROLL ── */}
      <GuestbookScroll pageMap={pageMap} />
    </>
  )
}
