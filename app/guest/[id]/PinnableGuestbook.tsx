'use client'

import Link from 'next/link'
import { useState } from 'react'

const HL_W = 0.52
const HL_H = 0.048
const RULE = '#c8b89a'
const ACCENT = '#8b6914'

export default function PinnableGuestbook({ id, page, src, coords }: {
  id: string
  page: number
  src: string
  coords: { x: number; y: number }
}) {
  const [editing, setEditing] = useState(false)
  const [pos, setPos] = useState(coords)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function handleClick(e: React.MouseEvent<HTMLImageElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    const next = {
      x: Math.round(((e.clientX - r.left) / r.width) * 1000) / 1000,
      y: Math.round(((e.clientY - r.top) / r.height) * 1000) / 1000,
    }
    setPos(next)
    setStatus('saving')
    const res = await fetch(`/api/guests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestbookCoords: next }),
    })
    setStatus(res.ok ? 'saved' : 'error')
  }

  const img = (
    <img
      src={src}
      alt={`Guestbook page ${page}`}
      onClick={editing ? handleClick : undefined}
      style={{ width: '100%', display: 'block', border: `1px solid ${RULE}`, filter: 'sepia(5%)', cursor: editing ? 'crosshair' : 'pointer' }}
    />
  )

  return (
    <div>
      <div style={{ position: 'relative', outline: editing ? `4px solid ${ACCENT}` : 'none' }}>
        {editing ? img : <Link href={`/#page-${page}`} title="Open in guestbook" style={{ display: 'block' }}>{img}</Link>}
        <div style={{
          position: 'absolute',
          left: `${(pos.x - HL_W / 2) * 100}%`,
          top: `${(pos.y - HL_H / 2) * 100}%`,
          width: `${HL_W * 100}%`,
          height: `${HL_H * 100}%`,
          background: editing ? 'rgba(251,191,36,0.45)' : 'transparent',
          border: editing ? '2px solid rgba(220,160,0,0.9)' : 'none',
          pointerEvents: 'none',
        }} />
      </div>

      {editing && (
        <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '1.05rem', margin: '12px 0 0', lineHeight: 1.5 }}>
          {status === 'saving' && 'Saving…'}
          {status === 'saved' && <span style={{ color: '#2a7a3a' }}>✓ Saved! Click again to adjust, or press Done.</span>}
          {status === 'error' && <span style={{ color: '#c0405a' }}>Something went wrong. Please try clicking again.</span>}
          {status === 'idle' && 'Click right on the signature in the page above. The yellow bar shows where it is now.'}
        </p>
      )}

      <button
        onClick={() => { setEditing(!editing); setStatus('idle') }}
        style={{
          marginTop: 12,
          width: '100%',
          fontFamily: 'LinLibertine, serif',
          fontSize: '1.05rem',
          padding: '12px 16px',
          border: `2px solid ${ACCENT}`,
          borderRadius: 3,
          background: editing ? ACCENT : 'transparent',
          color: editing ? '#f5f0e6' : ACCENT,
          cursor: 'pointer',
        }}
      >
        {editing ? '✓ Done' : '📍 Move signature marker'}
      </button>
    </div>
  )
}
