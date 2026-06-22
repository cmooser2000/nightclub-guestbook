import { getGuests } from '@/lib/guests'
import GuestbookScroll from './GuestbookScroll'
import Link from 'next/link'

export default async function Home() {
  const guests = await getGuests()

  const pageMap: Record<number, { id: string; name: string; nameVariants: string[]; knownFor: string; category: string; guestbookCoords: { x: number; y: number } }[]> = {}
  for (const g of guests) {
    if (!pageMap[g.guestbookPage]) pageMap[g.guestbookPage] = []
    pageMap[g.guestbookPage].push({
      id: g.id,
      name: g.name,
      nameVariants: g.nameVariants ?? [],
      knownFor: g.knownFor,
      category: g.category ?? '',
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
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#3a4858' }}>
        <img
          src="/guestbook-pages/pg000.jpg"
          alt=""
          aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'right center', display: 'block' }}
        />
      </div>

      {/* ── HERO — Hattie & Minnie photo, scrolls away to reveal guestbook cover ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: '#1e1a18',
      }}>
        <img
          src="/hero.png"
          alt="Hattie and Minnie Mooser — Guests at the Aladdin"
          style={{ width: '100%', display: 'block' }}
        />
        {/* Scroll hint */}
        <div className="scroll-hint" style={{
          position: 'absolute', bottom: 20, left: '50%',
          fontSize: '1.2rem', color: 'rgba(200,176,122,0.7)',
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
