'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface Guest {
  id: string
  name: string
  knownFor: string
  category: string
  imageUrl: string
  guestbookPage: number
  dadStory: string
}

const INTRO_TEXT = `In the heart of the city, through a door unmarked and unremarkable,
the world's greatest entertainers came to unwind. They laughed, they drank,
they signed their names in a book that outlasted them all.`

const PAGE_ENTRIES: Record<number, string[]> = {
  1: ['al-jolson', 'fanny-brice', 'mae-west'],
  2: ['will-rogers', 'buster-keaton'],
  3: ['harry-houdini'],
}

export default function Home() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/guests').then((r) => r.json()).then(setGuests)
  }, [])

  const guestById = Object.fromEntries(guests.map((g) => [g.id, g]))

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(201,168,76,0.3) 40px,
              rgba(201,168,76,0.3) 41px
            )`,
          }}
        />
        <div className="relative z-10 max-w-2xl fade-up">
          <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: 'var(--gold)' }}>
            Est. 1922
          </p>
          <h1
            className="text-5xl md:text-7xl font-display mb-6 leading-tight"
            style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', Palatino, serif" }}
          >
            The&nbsp;Guestbook
          </h1>
          <div className="art-deco-divider mb-6">
            <span className="text-lg tracking-widest">✦</span>
          </div>
          <p
            className="text-lg md:text-xl leading-relaxed italic mb-10"
            style={{ color: 'var(--parchment)' }}
          >
            {INTRO_TEXT}
          </p>
          <a
            href="#page-1"
            className="inline-block border px-8 py-3 text-sm tracking-[0.3em] uppercase transition-all hover:bg-yellow-900/20"
            style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
          >
            Open the Book
          </a>
        </div>
        <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)' }}>Scroll</span>
          <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
        </div>
      </section>

      {/* Guestbook pages */}
      {[1, 2, 3].map((pageNum) => {
        const pageGuestIds = PAGE_ENTRIES[pageNum] ?? []
        const pageGuests = pageGuestIds.map((id) => guestById[id]).filter(Boolean)

        return (
          <section
            key={pageNum}
            id={`page-${pageNum}`}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
          >
            <div className="art-deco-divider w-full max-w-3xl mb-12">
              <span
                className="text-sm tracking-[0.3em] uppercase whitespace-nowrap"
                style={{ color: 'var(--gold)' }}
              >
                Page {pageNum}
              </span>
            </div>

            {/* Parchment card */}
            <div
              className="relative w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #f5e9d0 0%, #e8d5b0 50%, #d4b896 100%)',
                minHeight: '500px',
              }}
            >
              {/* Ruled lines */}
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full"
                  style={{ top: `${80 + i * 32}px`, height: '1px', background: 'rgba(101,67,33,0.15)' }}
                />
              ))}

              {/* Column header */}
              <div className="relative p-8 pb-4 border-b" style={{ borderColor: 'rgba(101,67,33,0.3)' }}>
                <div className="flex justify-between items-baseline">
                  <p className="text-xs tracking-widest uppercase" style={{ color: '#8b5e3c' }}>Name &amp; Address</p>
                  <p className="text-xs" style={{ color: '#8b5e3c' }}>Remarks</p>
                </div>
              </div>

              {/* Signature entries */}
              <div className="relative p-8 space-y-8">
                {pageGuests.length === 0 && (
                  <p className="text-center italic opacity-50" style={{ color: '#8b5e3c' }}>Loading signatures…</p>
                )}
                {pageGuests.map((guest, i) => (
                  <Link
                    key={guest.id}
                    href={`/guest/${guest.id}`}
                    className="block group"
                    onMouseEnter={() => setHovered(guest.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="flex items-baseline gap-6">
                      <div className="flex-1">
                        <span
                          className="name-highlight text-2xl md:text-3xl"
                          style={{
                            fontFamily: "'Palatino Linotype', cursive",
                            fontStyle: 'italic',
                            animationDelay: `${i * 0.7}s`,
                          }}
                        >
                          {guest.name}
                        </span>
                        <span className="ml-3 text-xs tracking-widest uppercase opacity-60" style={{ color: '#8b5e3c' }}>
                          {guest.category}
                        </span>
                      </div>
                      <span
                        className="text-sm transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                        style={{ color: '#8b5e3c' }}
                      >
                        Read more →
                      </span>
                    </div>
                    <p
                      className="mt-1 text-sm italic leading-snug transition-all max-h-0 overflow-hidden group-hover:max-h-20"
                      style={{ color: '#6b4226' }}
                    >
                      {guest.knownFor.slice(0, 100)}…
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {pageNum < 3 && (
              <a
                href={`#page-${pageNum + 1}`}
                className="mt-16 text-xs tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--gold)' }}
              >
                Turn the page ↓
              </a>
            )}
          </section>
        )
      })}

      {/* Floating portrait on hover */}
      {hovered && guestById[hovered] && (
        <div
          className="fixed bottom-8 right-8 w-40 rounded shadow-2xl overflow-hidden border-2 pointer-events-none z-50 fade-up"
          style={{ borderColor: 'var(--gold)' }}
        >
          <img
            src={guestById[hovered].imageUrl}
            alt={guestById[hovered].name}
            className="w-full h-52 object-cover object-top"
          />
          <div
            className="p-2 text-center text-xs"
            style={{ background: 'var(--ink)', color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}
          >
            {guestById[hovered].name}
          </div>
        </div>
      )}

      <footer
        className="py-16 text-center border-t"
        style={{ borderColor: 'rgba(201,168,76,0.2)', color: 'var(--parchment)' }}
      >
        <p className="text-sm italic opacity-60">A family archive — compiled with love</p>
      </footer>
    </main>
  )
}
