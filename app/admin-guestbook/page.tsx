'use client'

import { useEffect, useRef, useState } from 'react'

interface Coords { x: number; y: number }

interface Guest {
  id: string
  name: string
  category: string
  knownFor: string
  quickFacts: string[]
  imageUrl: string
  wikiUrl: string
  guestbookPage: number
  guestbookCoords: Coords
  dadStory: string
  dadStoryUpdated: string | null
}

// Highlight dimensions (mirror GuestbookScroll)
const HL_W = 0.52
const HL_H = 0.048

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [selected, setSelected] = useState<Guest | null>(null)
  const [story, setStory] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'stories' | 'add' | 'pin'>('stories')

  // Add-guest form state
  const [addName, setAddName] = useState('')
  const [addPage, setAddPage] = useState('')
  const [addLocation, setAddLocation] = useState('')
  const [addCategory, setAddCategory] = useState('')
  const [addKnownFor, setAddKnownFor] = useState('')
  const [addStatus, setAddStatus] = useState<null | 'saving' | 'done' | 'error'>(null)
  const [addedGuest, setAddedGuest] = useState<Guest | null>(null)

  // Pin-coords state
  const [pinGuest, setPinGuest] = useState<Guest | null>(null)
  const [pinCoords, setPinCoords] = useState<Coords | null>(null)
  const [pinSaving, setPinSaving] = useState(false)
  const [pinSaved, setPinSaved] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    fetch('/api/guests').then((r) => r.json()).then(setGuests)
  }, [])

  function openGuest(guest: Guest) {
    setSelected(guest)
    setStory(guest.dadStory)
    setSaved(false)
    setTab('stories')
  }

  function openPin(guest: Guest) {
    setPinGuest(guest)
    setPinCoords(guest.guestbookCoords ?? { x: 0.5, y: 0.5 })
    setPinSaved(false)
    setTab('pin')
  }

  async function save() {
    if (!selected) return
    setSaving(true)
    await fetch(`/api/guests/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dadStory: story }),
    })
    setGuests((prev) =>
      prev.map((g) =>
        g.id === selected.id
          ? { ...g, dadStory: story, dadStoryUpdated: new Date().toISOString() }
          : g
      )
    )
    setSelected((prev) => (prev ? { ...prev, dadStory: story } : null))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function savePin() {
    if (!pinGuest || !pinCoords) return
    setPinSaving(true)
    await fetch(`/api/guests/${pinGuest.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestbookCoords: pinCoords }),
    })
    setGuests((prev) =>
      prev.map((g) => g.id === pinGuest.id ? { ...g, guestbookCoords: pinCoords } : g)
    )
    setPinGuest((prev) => prev ? { ...prev, guestbookCoords: pinCoords } : null)
    setPinSaving(false)
    setPinSaved(true)
    setTimeout(() => setPinSaved(false), 3000)
  }

  function handleImgClick(e: React.MouseEvent<HTMLImageElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setPinCoords({ x: Math.round(x * 1000) / 1000, y: Math.round(y * 1000) / 1000 })
    setPinSaved(false)
  }

  async function addGuest(e: React.FormEvent) {
    e.preventDefault()
    if (!addName.trim() || !addPage.trim()) return
    setAddStatus('saving')
    setAddedGuest(null)
    const res = await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: addName.trim(),
        guestbookPage: Number(addPage),
        location: addLocation.trim() || undefined,
        category: addCategory.trim() || undefined,
        knownFor: addKnownFor.trim() || undefined,
      }),
    })
    if (res.ok) {
      const newGuest = await res.json()
      setGuests((prev) => [...prev, newGuest])
      setAddedGuest(newGuest)
      setAddStatus('done')
      setAddName('')
      setAddPage('')
      setAddLocation('')
      setAddCategory('')
      setAddKnownFor('')
    } else {
      setAddStatus('error')
    }
  }

  const completed = guests.filter((g) => g.dadStory.trim().length > 0).length
  const sorted = [...guests].sort((a, b) => a.guestbookPage - b.guestbookPage)

  const isPlaceholder = (c: Coords) => c.x === 0.5 && c.y === 0.5

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="border-b px-8 py-6" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--gold)' }}>
              Admin
            </p>
            <h1 className="text-2xl" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>
              The Guestbook
            </h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light" style={{ color: 'var(--gold)' }}>
              {completed}/{guests.length}
            </p>
            <p className="text-xs opacity-50" style={{ color: 'var(--parchment)' }}>stories written</p>
          </div>
        </div>

        {/* Tabs + export */}
        <div className="max-w-6xl mx-auto mt-6 flex items-center justify-between">
          <div className="flex gap-6">
            {([
              ['stories', 'Write Stories'],
              ['add', 'Add a Guest'],
              ['pin', 'Pin Signatures'],
            ] as const).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="text-xs tracking-[0.25em] uppercase pb-2 border-b-2 transition-all"
                style={{
                  borderColor: tab === t ? 'var(--gold)' : 'transparent',
                  color: tab === t ? 'var(--gold)' : 'rgba(212,184,150,0.4)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(guests, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `guests-${new Date().toISOString().slice(0, 10)}.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="text-xs tracking-[0.25em] uppercase opacity-40 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--parchment)' }}
          >
            ↓ Export JSON
          </button>
        </div>
      </header>

      {/* ── STORIES TAB ── */}
      {tab === 'stories' && (
        <div className="max-w-6xl mx-auto px-8 py-10 grid md:grid-cols-5 gap-8">
          {/* Guest list */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
              Guests — sorted by page
            </p>
            {sorted.map((guest) => (
              <button
                key={guest.id}
                onClick={() => openGuest(guest)}
                className="w-full text-left p-4 rounded border transition-all hover:border-yellow-600"
                style={{
                  borderColor: selected?.id === guest.id ? 'var(--gold)' : 'rgba(201,168,76,0.2)',
                  background: selected?.id === guest.id ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm italic" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>
                      {guest.name}
                    </p>
                    <p className="text-xs opacity-40 mt-0.5" style={{ color: 'var(--parchment)' }}>
                      p.{guest.guestbookPage} · {guest.category}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded shrink-0"
                    style={{
                      background: guest.dadStory.trim() ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
                      color: guest.dadStory.trim() ? '#4ade80' : '#666',
                    }}
                  >
                    {guest.dadStory.trim() ? '✓' : '·'}
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
                <div>
                  <h2 className="text-3xl italic mb-1" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>
                    {selected.name}
                  </h2>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--gold)' }}>
                    {selected.category} · Page {selected.guestbookPage}
                  </p>
                  {selected.wikiUrl && (
                    <a href={selected.wikiUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs underline opacity-50 hover:opacity-100" style={{ color: 'var(--parchment)' }}>
                      Wikipedia →
                    </a>
                  )}
                </div>

                {selected.quickFacts.length > 0 && (
                  <div className="rounded p-4 border text-sm space-y-1"
                    style={{ borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.04)' }}>
                    <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>Reference</p>
                    {selected.quickFacts.map((fact, i) => (
                      <p key={i} className="opacity-70" style={{ color: 'var(--parchment)' }}>· {fact}</p>
                    ))}
                  </div>
                )}

                <div>
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>Your Story</p>
                  <p className="text-xs mb-3 italic opacity-50" style={{ color: 'var(--parchment)' }}>
                    Write anything you remember or know — a family memory, an anecdote, what they meant to you.
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

                <div className="flex items-center gap-4">
                  <button
                    onClick={save}
                    disabled={saving}
                    className="px-6 py-2 text-sm tracking-widest uppercase border transition-all hover:bg-yellow-900/20 disabled:opacity-50"
                    style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
                  >
                    {saving ? 'Saving…' : 'Save Story'}
                  </button>
                  {saved && <span className="text-sm text-green-400">✓ Saved</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD GUEST TAB ── */}
      {tab === 'add' && (
        <div className="max-w-2xl mx-auto px-8 py-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--gold)' }}>Add a Guest</p>
          <p className="text-sm italic mb-8 opacity-60" style={{ color: 'var(--parchment)' }}>
            Found a name in the guestbook that isn't listed? Add them here. Only name and page number are required.
          </p>

          <form onSubmit={addGuest} className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>
                  Name as written *
                </label>
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  required
                  placeholder="e.g. Miss E. E. McClatchy"
                  className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.3)', color: 'var(--cream)', fontFamily: 'Georgia, serif' }}
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>
                  Page # *
                </label>
                <input
                  type="number"
                  value={addPage}
                  onChange={(e) => setAddPage(e.target.value)}
                  required
                  min={1}
                  max={418}
                  placeholder="e.g. 42"
                  className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.3)', color: 'var(--cream)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>
                Location / Address (optional)
              </label>
              <input
                type="text"
                value={addLocation}
                onChange={(e) => setAddLocation(e.target.value)}
                placeholder="e.g. Sacramento, Cal."
                className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.3)', color: 'var(--cream)', fontFamily: 'Georgia, serif' }}
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>
                Category (optional)
              </label>
              <input
                type="text"
                value={addCategory}
                onChange={(e) => setAddCategory(e.target.value)}
                placeholder="e.g. Actress, Journalist, Local Notable…"
                className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.3)', color: 'var(--cream)', fontFamily: 'Georgia, serif' }}
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>
                Known for (optional)
              </label>
              <textarea
                value={addKnownFor}
                onChange={(e) => setAddKnownFor(e.target.value)}
                rows={3}
                placeholder="A sentence about who this person was or why they were notable…"
                className="w-full rounded border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.3)', color: 'var(--cream)', fontFamily: 'Georgia, serif' }}
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={addStatus === 'saving' || !addName.trim() || !addPage.trim()}
                className="px-6 py-2 text-sm tracking-widest uppercase border transition-all hover:bg-yellow-900/20 disabled:opacity-40"
                style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
              >
                {addStatus === 'saving' ? 'Adding…' : 'Add Guest'}
              </button>
              {addStatus === 'error' && (
                <span className="text-sm text-red-400">Something went wrong. Try again.</span>
              )}
            </div>
          </form>

          {addStatus === 'done' && addedGuest && (
            <div className="mt-8 rounded border p-5" style={{ borderColor: 'rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.06)' }}>
              <p className="text-green-400 text-sm mb-1">✓ Guest added — page {addedGuest.guestbookPage}</p>
              <p className="text-lg italic mb-3" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>
                {addedGuest.name}
              </p>
              <p className="text-xs opacity-50 mb-4" style={{ color: 'var(--parchment)' }}>
                They now appear on the guestbook homepage. Go to the Stories tab to add more details or a personal memory.
              </p>
              <button
                onClick={() => { setSelected(addedGuest); setStory(''); setTab('stories') }}
                className="text-xs tracking-widest uppercase underline opacity-60 hover:opacity-100"
                style={{ color: 'var(--gold)' }}
              >
                Write their story now →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── PIN SIGNATURES TAB ── */}
      {tab === 'pin' && (
        <div className="max-w-6xl mx-auto px-8 py-10 grid md:grid-cols-5 gap-8">
          {/* Guest list */}
          <div className="md:col-span-2 space-y-2">
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--gold)' }}>
              Click a guest to position their highlight
            </p>
            <p className="text-xs italic mb-5 opacity-50" style={{ color: 'var(--parchment)' }}>
              Orange dot = placeholder. Green dot = pinned.
            </p>
            {sorted.map((guest) => {
              const placed = !isPlaceholder(guest.guestbookCoords ?? { x: 0.5, y: 0.5 })
              return (
                <button
                  key={guest.id}
                  onClick={() => openPin(guest)}
                  className="w-full text-left px-4 py-3 rounded border transition-all hover:border-yellow-600"
                  style={{
                    borderColor: pinGuest?.id === guest.id ? 'var(--gold)' : 'rgba(201,168,76,0.2)',
                    background: pinGuest?.id === guest.id ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ color: placed ? '#4ade80' : '#f97316', fontSize: '0.5rem' }}>●</span>
                    <div>
                      <p className="text-sm italic" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>
                        {guest.name}
                      </p>
                      <p className="text-xs opacity-40" style={{ color: 'var(--parchment)' }}>p.{guest.guestbookPage}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Image picker */}
          <div className="md:col-span-3">
            {!pinGuest ? (
              <div
                className="h-64 flex items-center justify-center border rounded text-sm italic opacity-30"
                style={{ borderColor: 'rgba(201,168,76,0.2)', color: 'var(--parchment)' }}
              >
                Select a guest to pin their signature
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl italic mb-1" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>
                    {pinGuest.name}
                  </h2>
                  <p className="text-xs opacity-50 mb-3" style={{ color: 'var(--gold)' }}>
                    Page {pinGuest.guestbookPage} · Click on their signature in the image below
                  </p>
                </div>

                {/* Image with overlay */}
                <div style={{ position: 'relative', cursor: 'crosshair' }}>
                  <img
                    ref={imgRef}
                    src={`/guestbook-pages/pg${String(pinGuest.guestbookPage).padStart(3, '0')}.jpg`}
                    alt={`Page ${pinGuest.guestbookPage}`}
                    onClick={handleImgClick}
                    style={{ width: '100%', display: 'block', borderRadius: '4px' }}
                  />

                  {/* Highlight preview overlay */}
                  {pinCoords && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${(pinCoords.x - HL_W / 2) * 100}%`,
                        top: `${(pinCoords.y - HL_H / 2) * 100}%`,
                        width: `${HL_W * 100}%`,
                        height: `${HL_H * 100}%`,
                        background: 'rgba(251,191,36,0.45)',
                        mixBlendMode: 'multiply',
                        borderRadius: '2px',
                        pointerEvents: 'none',
                        border: '1px solid rgba(251,191,36,0.8)',
                      }}
                    />
                  )}
                </div>

                {pinCoords && (
                  <p className="text-xs opacity-40" style={{ color: 'var(--parchment)' }}>
                    Position: x={pinCoords.x.toFixed(3)}, y={pinCoords.y.toFixed(3)}
                    {isPlaceholder(pinCoords) ? ' (placeholder — click the signature above)' : ''}
                  </p>
                )}

                <div className="flex items-center gap-4">
                  <button
                    onClick={savePin}
                    disabled={pinSaving || !pinCoords || isPlaceholder(pinCoords)}
                    className="px-6 py-2 text-sm tracking-widest uppercase border transition-all hover:bg-yellow-900/20 disabled:opacity-40"
                    style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
                  >
                    {pinSaving ? 'Saving…' : 'Save Position'}
                  </button>
                  {pinSaved && <span className="text-sm text-green-400">✓ Position saved</span>}
                  <span className="text-xs opacity-30 italic" style={{ color: 'var(--parchment)' }}>
                    Don't forget to Export JSON afterward
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
