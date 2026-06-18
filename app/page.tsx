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

function pageImg(n: number) {
  return `/guestbook-pages/pg${String(n).padStart(3, '0')}.jpg`
}

function shortDesc(knownFor: string): string {
  const sentence = knownFor.split(/[.—]/)[0].trim()
  return sentence.length > 130 ? sentence.slice(0, 127) + '…' : sentence
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
    <main className="bg-white">
      {allPages.map((pageNum) => (
        <GuestbookPage
          key={pageNum}
          pageNum={pageNum}
          guests={pageMap.get(pageNum) ?? []}
        />
      ))}
      <footer className="py-10 text-center text-xs text-gray-400 tracking-widest uppercase">
        Aladdin Tiffin Room · San Francisco · 1921–1933
      </footer>
    </main>
  )
}

function GuestbookPage({ pageNum, guests }: { pageNum: number; guests: Guest[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative mx-auto max-w-3xl">
      <img
        src={pageImg(pageNum)}
        alt={`Guestbook page ${pageNum}`}
        loading={pageNum <= 3 ? 'eager' : 'lazy'}
        className="w-full block"
      />
      {guests.length > 0 && (
        <div className="absolute bottom-3 left-3 flex flex-col items-start gap-1.5">
          {guests.map((g, i) => (
            <NameLabel key={g.id} guest={g} visible={visible} delay={i * 120} />
          ))}
        </div>
      )}
    </div>
  )
}

function NameLabel({
  guest,
  visible,
  delay,
}: {
  guest: Guest
  visible: boolean
  delay: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/guest/${guest.id}`}>
        <span
          className="inline-block px-2 py-0.5 text-sm font-medium tracking-wide cursor-pointer transition-all duration-500"
          style={{
            fontFamily: "'Palatino Linotype', Palatino, serif",
            fontStyle: 'italic',
            color: '#92400e',
            background: 'rgba(255,255,255,0.88)',
            borderLeft: '2px solid #b45309',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(6px)',
            transitionDelay: `${delay}ms`,
            boxShadow: hovered
              ? '0 0 0 1px #b45309, 0 2px 8px rgba(180,83,9,0.25)'
              : '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          {guest.name}
        </span>
      </Link>

      {hovered && (
        <div
          className="absolute bottom-full left-0 mb-2 w-72 rounded p-3 text-sm z-50 pointer-events-none"
          style={{
            background: 'rgba(28, 20, 10, 0.95)',
            color: '#f5e9d0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            fontFamily: "'Palatino Linotype', Palatino, serif",
          }}
        >
          <p className="font-semibold mb-1" style={{ color: '#d97706' }}>
            {guest.name}
          </p>
          <p className="leading-snug text-xs opacity-90">{shortDesc(guest.knownFor)}</p>
          <p className="mt-2 text-xs opacity-50 tracking-wide">Click to read more →</p>
        </div>
      )}
    </div>
  )
}
