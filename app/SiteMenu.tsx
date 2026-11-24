'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const ITEMS = [
  { href: '/about', label: 'About Hattie & Minnie' },
  { href: '/all-guests', label: 'Show me all the names' },
  { href: '/book', label: 'The Book' },
]

// Small "three lines" menu for the full guestbook (home) page.
export default function SiteMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} style={{ position: 'fixed', top: 14, right: 14, zIndex: 9999 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        style={{
          width: 44,
          height: 44,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          background: 'rgba(30,26,24,0.72)',
          border: '1px solid rgba(200,176,122,0.55)',
          borderRadius: 4,
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          padding: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ display: 'block', width: 20, height: 2, background: '#e0c98f', borderRadius: 1 }} />
        ))}
      </button>

      {open && (
        <nav
          style={{
            position: 'absolute',
            top: 52,
            right: 0,
            minWidth: 230,
            background: '#f5f0e6',
            border: '1px solid #c8b89a',
            borderRadius: 4,
            boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
            padding: '6px 0',
          }}
        >
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '12px 20px',
                fontFamily: "'LinLibertine', 'Palatino Linotype', Palatino, serif",
                fontSize: '1.02rem',
                letterSpacing: '0.02em',
                color: '#1a1209',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200,184,154,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
