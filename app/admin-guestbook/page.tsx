'use client'

import { useEffect, useState } from 'react'

interface Guest {
  id: string
  name: string
  category: string
  knownFor: string
  quickFacts: string[]
  imageUrl: string
  wikiUrl: string
  dadStory: string
  dadStoryUpdated: string | null
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [selected, setSelected] = useState<Guest | null>(null)
  const [story, setStory] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/guests').then((r) => r.json()).then(setGuests)
  }, [])

  function openGuest(guest: Guest) {
    setSelected(guest)
    setStory(guest.dadStory)
    setSaved(false)
  }

  async function save() {
    if (!selected) return
    setSaving(true)
    await fetch(`/api/guests/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dadStory: story }),
    })
    // Update local state
    setGuests((prev) =>
      prev.map((g) =>
        g.id === selected.id
          ? { ...g, dadStory: story, dadStoryUpdated: new Date().toISOString() }
          : g
      )
    )
    setSelected((prev) => prev ? { ...prev, dadStory: story } : null)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const completed = guests.filter((g) => g.dadStory.trim().length > 0).length

  return (
    <main
      className="min-h-screen"
      style={{ background: 'var(--background)' }}
    >
      {/* Header */}
      <header
        className="border-b px-8 py-6"
        style={{ borderColor: 'rgba(201,168,76,0.3)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--gold)' }}>
              Admin
            </p>
            <h1
              className="text-2xl"
              style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}
            >
              The Guestbook — Stories
            </h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light" style={{ color: 'var(--gold)' }}>
              {completed}/{guests.length}
            </p>
            <p className="text-xs opacity-50" style={{ color: 'var(--parchment)' }}>
              stories written
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-10 grid md:grid-cols-5 gap-8">
        {/* Guest list */}
        <div className="md:col-span-2 space-y-3">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
            Guests
          </p>
          {guests.map((guest) => (
            <button
              key={guest.id}
              onClick={() => openGuest(guest)}
              className="w-full text-left p-4 rounded border transition-all hover:border-yellow-600"
              style={{
                borderColor:
                  selected?.id === guest.id
                    ? 'var(--gold)'
                    : 'rgba(201,168,76,0.2)',
                background:
                  selected?.id === guest.id
                    ? 'rgba(201,168,76,0.08)'
                    : 'rgba(255,255,255,0.02)',
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={guest.imageUrl}
                    alt={guest.name}
                    className="w-10 h-10 rounded object-cover object-top"
                  />
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{
                        color: 'var(--cream)',
                        fontFamily: "'Palatino Linotype', serif",
                        fontStyle: 'italic',
                      }}
                    >
                      {guest.name}
                    </p>
                    <p className="text-xs opacity-50" style={{ color: 'var(--parchment)' }}>
                      {guest.category}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    background: guest.dadStory.trim()
                      ? 'rgba(74,222,128,0.15)'
                      : 'rgba(255,255,255,0.05)',
                    color: guest.dadStory.trim() ? '#4ade80' : '#666',
                  }}
                >
                  {guest.dadStory.trim() ? '✓ Done' : 'Pending'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Story editor */}
        <div className="md:col-span-3">
          {!selected ? (
            <div
              className="h-64 flex items-center justify-center border rounded text-sm italic opacity-30"
              style={{ borderColor: 'rgba(201,168,76,0.2)', color: 'var(--parchment)' }}
            >
              Select a guest to write their story
            </div>
          ) : (
            <div className="space-y-6">
              {/* Guest header */}
              <div className="flex gap-4 items-start">
                <img
                  src={selected.imageUrl}
                  alt={selected.name}
                  className="w-20 h-24 object-cover object-top rounded border"
                  style={{ borderColor: 'var(--gold)' }}
                />
                <div>
                  <h2
                    className="text-3xl italic mb-1"
                    style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}
                  >
                    {selected.name}
                  </h2>
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>
                    {selected.category}
                  </p>
                  <a
                    href={selected.wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline opacity-50 hover:opacity-100"
                    style={{ color: 'var(--parchment)' }}
                  >
                    Wikipedia →
                  </a>
                </div>
              </div>

              {/* Quick facts reference */}
              <div
                className="rounded p-4 border text-sm space-y-1"
                style={{
                  borderColor: 'rgba(201,168,76,0.2)',
                  background: 'rgba(201,168,76,0.04)',
                }}
              >
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>
                  Reference — Quick Facts
                </p>
                {selected.quickFacts.map((fact, i) => (
                  <p key={i} className="opacity-70" style={{ color: 'var(--parchment)' }}>
                    · {fact}
                  </p>
                ))}
              </div>

              {/* Textarea */}
              <div>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>
                  Your Story
                </p>
                <p className="text-xs mb-3 italic opacity-50" style={{ color: 'var(--parchment)' }}>
                  Write anything you remember or know about this person — a family memory, an anecdote, or just what they meant to you.
                </p>
                <textarea
                  value={story}
                  onChange={(e) => { setStory(e.target.value); setSaved(false) }}
                  rows={10}
                  placeholder="Start writing…"
                  className="w-full rounded border p-4 text-sm leading-relaxed resize-none focus:outline-none focus:ring-1"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(201,168,76,0.3)',
                    color: 'var(--cream)',
                    fontFamily: 'Georgia, serif',
                  }}
                />
              </div>

              {/* Save */}
              <div className="flex items-center gap-4">
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-6 py-2 text-sm tracking-widest uppercase border transition-all hover:bg-yellow-900/20 disabled:opacity-50"
                  style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
                >
                  {saving ? 'Saving…' : 'Save Story'}
                </button>
                {saved && (
                  <span className="text-sm text-green-400 fade-up">✓ Saved</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
