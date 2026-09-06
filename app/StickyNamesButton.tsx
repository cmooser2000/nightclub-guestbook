'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

interface Guest { id: string; name: string; category: string; guestbookPage: number }

export default function StickyNamesButton() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch guest list once
  useEffect(() => {
    fetch('/api/guests')
      .then((r) => r.json())
      .then((data: Guest[]) => setGuests(data))
      .catch(() => {})
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  if (pathname === '/all-guests' || pathname === '/most-interesting' || pathname.startsWith('/admin')) return null

  const q = query.trim().toLowerCase()
  const results = q.length > 0
    ? guests.filter((g) => g.name.toLowerCase().includes(q)).slice(0, 12)
    : []

  function handleSelect(guest: Guest) {
    setQuery('')
    setOpen(false)
    router.push(`/#page-${guest.guestbookPage}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        width: 210,
      }}
    >
      {/* Main button */}
      <Link
        href="/all-guests"
        style={{
          display: 'block',
          background: '#8b6914',
          color: '#f5f0e6',
          fontFamily: "'LinLibertine', 'Palatino Linotype', Palatino, serif",
          fontSize: '1.05rem',
          letterSpacing: '0.04em',
          padding: '12px 16px',
          textDecoration: 'none',
          border: '2px solid #f5f0e6',
          borderBottom: 'none',
          boxShadow: '0 4px 18px rgba(0,0,0,0.28)',
          borderRadius: '3px 3px 0 0',
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        📋 Show me all the names
      </Link>

      {/* Search input */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { if (query.trim()) setOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder="Search a name…"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            fontFamily: "'LinLibertine', 'Palatino Linotype', Palatino, serif",
            fontSize: '0.95rem',
            padding: '9px 12px',
            border: '2px solid #f5f0e6',
            borderTop: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '0 0 3px 3px',
            background: '#6b5010',
            color: '#f5f0e6',
            outline: 'none',
            boxShadow: '0 4px 18px rgba(0,0,0,0.28)',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false) }}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: '#f5f0e6', opacity: 0.6,
              cursor: 'pointer', fontSize: '0.9rem', padding: 0,
            }}
          >✕</button>
        )}

        {/* Dropdown results */}
        {open && results.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: 260,
            background: '#f5f0e6',
            border: '1px solid #c8b89a',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
            maxHeight: 320,
            overflowY: 'auto',
            zIndex: 10000,
          }}>
            {results.map((g) => (
              <button
                key={g.id}
                onClick={() => handleSelect(g)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid #e8ddc8',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontFamily: "'LinLibertine', 'Palatino Linotype', Palatino, serif",
                  fontSize: '1rem',
                  color: '#1a1209',
                  lineHeight: 1.3,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(139,105,20,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                {g.name}
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#8b6914', opacity: 0.7, marginTop: 1 }}>
                  {g.category} · p. {g.guestbookPage}
                </span>
              </button>
            ))}
            {guests.filter((g) => g.name.toLowerCase().includes(q)).length > 12 && (
              <Link
                href={`/all-guests`}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block', padding: '8px 14px', textAlign: 'center',
                  fontFamily: "'LinLibertine', serif", fontSize: '0.8rem',
                  color: '#8b6914', textDecoration: 'none', opacity: 0.7,
                  borderTop: '1px solid #e8ddc8',
                }}
              >
                See all results →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
