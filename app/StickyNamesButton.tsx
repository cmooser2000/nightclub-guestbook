'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function StickyNamesButton() {
  const pathname = usePathname()
  // Hide on the all-guests page itself and on admin
  if (pathname === '/all-guests' || pathname.startsWith('/admin')) return null

  return (
    <Link
      href="/all-guests"
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        background: '#8b6914',
        color: '#f5f0e6',
        fontFamily: "'LinLibertine', 'Palatino Linotype', Palatino, serif",
        fontSize: '1.05rem',
        letterSpacing: '0.04em',
        padding: '14px 22px',
        textDecoration: 'none',
        border: '2px solid #f5f0e6',
        boxShadow: '0 4px 18px rgba(0,0,0,0.28)',
        borderRadius: 3,
        display: 'block',
        textAlign: 'center',
        lineHeight: 1.3,
        maxWidth: 180,
      }}
    >
      📋 Show me<br />all the names
    </Link>
  )
}
