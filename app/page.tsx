'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface Guest {
  id: string
  name: string
  knownFor: string
  guestbookPage: number
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

export default function Home() {
  const [guests, setGuests] = useState<Guest[]>([])

  useEffect(() => {
    fetch('/api/guests').then((r) => r.json()).then(setGuests)
  }, [])

  const pageMap = new Map<number, Guest[]>()
  for (const g of guests) {
    const arr = pageMap.get(g.guestbookPage) ?? []
    arr.push(g)
    pageMap.set(g.guestbookPage, arr)
  }

  const allPages = [0, ...Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1)]

  return (
    <main style={{ background: BG }}>
      <style>{`
        @keyframes labelIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .guest-label {
          animation: labelIn 0.4s ease both;
        }
      `}</style>

      {allPages.map((pageNum) => (
        <GuestbookPage
          key={pageNum}
          pageNum={pageNum}
          guests={pageMap.get(pageNum) ?? []}
        />
      ))}

      <footer className="py-10 text-center text-xs tracking-widest uppercase" style={{ color: '#a89070' }}>
        Aladdin Tiffin Room · San Francisco · 1921–1933
      </footer>
    </main>
  )
}

function GuestbookPage({ pageNum, guests }: { pageNum: number; guests: Guest[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setEntered(true) },
      { rootMargin: '0px 0px -10% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
      <img
        src={pageImg(pageNum)}
        alt={`Page ${pageNum}`}
        loading={pageNum <= 4 ? 'eager' : 'lazy'}
        style={{ width: '100%', display: 'block' }}
      />
      {entered && guests.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '6px',
        }}>
          {guests.map((g, i) => (
            <NameLabel key={g.id} guest={g} delay={i * 100} />
          ))}
        </div>
      )}
    </div>
  )
}

function NameLabel({ guest, delay }: { guest: Guest; delay: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <Link href={`/guest/${guest.id}`} style={{ textDecoration: 'none' }}>
        <span
          className="guest-label"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            animationDelay: `${delay}ms`,
            display: 'inline-block',
            padding: '2px 8px 2px 7px',
            fontFamily: "'Palatino Linotype', Palatino, serif",
            fontStyle: 'italic',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: hovered ? '#92400e' : '#78350f',
            background: hovered ? 'rgba(254,243,199,0.97)' : 'rgba(255,251,235,0.92)',
            borderLeft: `2px solid ${hovered ? '#d97706' : '#b45309'}`,
            boxShadow: hovered
              ? '0 0 0 1px #fbbf24, 0 2px 12px rgba(180,83,9,0.3)'
              : '0 1px 4px rgba(0,0,0,0.12)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.01em',
          }}
        >
          ✓ {guest.name}
        </span>
      </Link>

      {hovered && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: 0,
          width: '280px',
          background: 'rgba(20,14,6,0.96)',
          color: '#f5e9d0',
          borderRadius: '3px',
          padding: '10px 12px',
          zIndex: 50,
          pointerEvents: 'none',
          boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
          fontFamily: "'Palatino Linotype', Palatino, serif",
        }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#fbbf24', fontSize: '0.85rem' }}>
            {guest.name}
          </p>
          <p style={{ margin: '0 0 6px', fontSize: '0.75rem', lineHeight: 1.5, opacity: 0.9 }}>
            {shortDesc(guest.knownFor)}
          </p>
          <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.45, letterSpacing: '0.05em' }}>
            CLICK TO READ MORE
          </p>
        </div>
      )}
    </div>
  )
}
