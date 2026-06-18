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

const HL_W = 0.52
const HL_H = 0.048

// Compress a File to a JPEG data URL at max 700px wide, quality 0.75
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 700
        const scale = img.width > MAX ? MAX / img.width : 1
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.onerror = reject
      img.src = e.target!.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [selected, setSelected] = useState<Guest | null>(null)
  const [story, setStory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imgSaving, setImgSaving] = useState(false)
  const [imgSaved, setImgSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'stories' | 'add' | 'pin'>('stories')
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setImageUrl(guest.imageUrl)
    setSaved(false)
    setImgSaved(false)
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

  async function saveImage() {
    if (!selected || !imageUrl) return
    setImgSaving(true)
    await fetch(`/api/guests/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    })
    setGuests((prev) =>
      prev.map((g) => g.id === selected.id ? { ...g, imageUrl } : g)
    )
    setSelected((prev) => (prev ? { ...prev, imageUrl } : null))
    setImgSaving(false)
    setImgSaved(true)
    setTimeout(() => setImgSaved(false), 3000)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await compressImage(file)
    setImageUrl(compressed)
    setImgSaved(false)
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

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(201,168,76,0.3)',
    color: 'var(--cream)',
    fontFamily: 'Georgia, serif',
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="border-b px-8 py-6" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--gold)' }}>Admin</p>
            <h1 className="text-2xl" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>
              The Guestbook
            </h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light" style={{ color: 'var(--gold)' }}>{completed}/{guests.length}</p>
            <p className="text-xs opacity-50" style={{ color: 'var(--parchment)' }}>stories written</p>
          </div>
        </div>

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
          <div className="md:col-span-2 space-y-2">
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
              Guests — sorted by page
            </p>
            {sorted.map((guest) => {
              const hasStory = guest.dadStory.trim().length > 0
              const hasPhoto = guest.imageUrl.trim().length > 0
              return (
                <button
                  key={guest.id}
                  onClick={() => openGuest(guest)}
                  className="w-full text-left p-3 rounded border transition-all hover:border-yellow-600"
                  style={{
                    borderColor: selected?.id === guest.id ? 'var(--gold)' : 'rgba(201,168,76,0.2)',
                    background: selected?.id === guest.id ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm italic truncate" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>
                        {guest.name}
                      </p>
                      <p className="text-xs opacity-40 mt-0.5" style={{ color: 'var(--parchment)' }}>
                        p.{guest.guestbookPage}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <span title="Story" style={{ fontSize: '0.65rem', color: hasStory ? '#4ade80' : '#444' }}>✍</span>
                      <span title="Photo" style={{ fontSize: '0.65rem', color: hasPhoto ? '#4ade80' : '#444' }}>📷</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Story editor */}
          <div className="md:col-span-3">
            {!selected ? (
              <div
                className="h-64 flex flex-col items-center justify-center border rounded gap-3"
                style={{ borderColor: 'rgba(201,168,76,0.15)', color: 'var(--parchment)' }}
              >
                <p className="text-sm italic opacity-30">Select a guest from the list</p>
              </div>
            ) : (
              <div className="space-y-8">

                {/* Name + meta */}
                <div>
                  <h2 className="text-3xl italic mb-1" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>
                    {selected.name}
                  </h2>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--gold)' }}>
                    {selected.category} · Page {selected.guestbookPage}
                  </p>
                  {selected.wikiUrl && (
                    <a href={selected.wikiUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs underline opacity-40 hover:opacity-100" style={{ color: 'var(--parchment)' }}>
                      Wikipedia →
                    </a>
                  )}
                </div>

                {/* ── PHOTO ── */}
                <div>
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>
                    Photo
                  </p>

                  {imageUrl ? (
                    <div className="flex gap-4 items-start">
                      <img
                        src={imageUrl}
                        alt={selected.name}
                        className="rounded border"
                        style={{ width: 120, height: 140, objectFit: 'cover', objectPosition: 'top', borderColor: 'rgba(201,168,76,0.3)' }}
                      />
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs px-3 py-1.5 border transition-all hover:bg-yellow-900/20"
                          style={{ borderColor: 'rgba(201,168,76,0.4)', color: 'var(--gold)' }}
                        >
                          Replace photo
                        </button>
                        <button
                          onClick={() => { setImageUrl(''); setImgSaved(false) }}
                          className="text-xs px-3 py-1.5 border transition-all hover:bg-red-900/20"
                          style={{ borderColor: 'rgba(255,100,100,0.3)', color: 'rgba(255,150,150,0.7)' }}
                        >
                          Remove
                        </button>
                        <button
                          onClick={saveImage}
                          disabled={imgSaving}
                          className="text-xs px-3 py-1.5 border transition-all hover:bg-yellow-900/20 disabled:opacity-40"
                          style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
                        >
                          {imgSaving ? 'Saving…' : 'Save Photo'}
                        </button>
                        {imgSaved && <span className="text-xs text-green-400">✓ Saved</span>}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed rounded py-8 text-center transition-all hover:border-yellow-600/60 hover:bg-yellow-900/10"
                      style={{ borderColor: 'rgba(201,168,76,0.2)', color: 'var(--parchment)' }}
                    >
                      <p className="text-sm mb-1" style={{ color: 'var(--gold)', opacity: 0.7 }}>Click to add a photo</p>
                      <p className="text-xs opacity-40">JPG or PNG · compressed automatically</p>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* ── STORY ── */}
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--gold)' }}>
                    {selected.name.split(' ')[0]}'s Story
                  </p>
                  <p className="text-xs italic mb-3 opacity-40" style={{ color: 'var(--parchment)' }}>
                    A memory, an anecdote, what they meant to you or the family.
                  </p>

                  {!story && !saving ? (
                    <button
                      onClick={() => {
                        const el = document.getElementById('story-textarea')
                        if (el) (el as HTMLTextAreaElement).focus()
                      }}
                      className="w-full border-2 border-dashed rounded py-8 text-center transition-all hover:border-yellow-600/60 hover:bg-yellow-900/10 mb-2"
                      style={{ borderColor: 'rgba(201,168,76,0.2)' }}
                    >
                      <p className="text-sm" style={{ color: 'var(--gold)', opacity: 0.7 }}>
                        Click to add {selected.name.split(' ')[0]}'s story
                      </p>
                    </button>
                  ) : null}

                  <textarea
                    id="story-textarea"
                    value={story}
                    onChange={(e) => { setStory(e.target.value); setSaved(false) }}
                    rows={story ? 10 : 3}
                    placeholder={`Write anything you remember about ${selected.name.split(' ')[0]}…`}
                    className="w-full rounded border p-4 text-sm leading-relaxed resize-none focus:outline-none focus:ring-1"
                    style={{ ...inputStyle, display: story ? 'block' : 'none' }}
                  />

                  {/* Show a minimal textarea when empty so focus works */}
                  {!story && (
                    <textarea
                      id="story-textarea"
                      value={story}
                      onChange={(e) => { setStory(e.target.value); setSaved(false) }}
                      rows={1}
                      placeholder={`Write anything you remember about ${selected.name.split(' ')[0]}…`}
                      className="w-full rounded border p-4 text-sm leading-relaxed resize-none focus:outline-none focus:ring-1"
                      style={{ ...inputStyle, height: 0, padding: 0, border: 'none', opacity: 0, position: 'absolute' }}
                    />
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={save}
                      disabled={saving || !story.trim()}
                      className="px-6 py-2 text-sm tracking-widest uppercase border transition-all hover:bg-yellow-900/20 disabled:opacity-40"
                      style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
                    >
                      {saving ? 'Saving…' : 'Save Story'}
                    </button>
                    {saved && <span className="text-sm text-green-400">✓ Saved</span>}
                  </div>
                </div>

                {/* Quick facts ref */}
                {selected.quickFacts.length > 0 && (
                  <details className="rounded border" style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
                    <summary className="px-4 py-3 text-xs tracking-widest uppercase cursor-pointer" style={{ color: 'var(--gold)', opacity: 0.6 }}>
                      Reference facts ▾
                    </summary>
                    <div className="px-4 pb-4 space-y-1">
                      {selected.quickFacts.map((fact, i) => (
                        <p key={i} className="text-sm opacity-60" style={{ color: 'var(--parchment)' }}>· {fact}</p>
                      ))}
                    </div>
                  </details>
                )}

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
                <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>Name as written *</label>
                <input type="text" value={addName} onChange={(e) => setAddName(e.target.value)} required
                  placeholder="e.g. Miss E. E. McClatchy"
                  className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                  style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>Page # *</label>
                <input type="number" value={addPage} onChange={(e) => setAddPage(e.target.value)} required min={1} max={418}
                  placeholder="42"
                  className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                  style={{ ...inputStyle, fontFamily: undefined }} />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>Location / Address (optional)</label>
              <input type="text" value={addLocation} onChange={(e) => setAddLocation(e.target.value)}
                placeholder="e.g. Sacramento, Cal."
                className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                style={inputStyle} />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>Category (optional)</label>
              <input type="text" value={addCategory} onChange={(e) => setAddCategory(e.target.value)}
                placeholder="e.g. Actress, Journalist…"
                className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                style={inputStyle} />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>Known for (optional)</label>
              <textarea value={addKnownFor} onChange={(e) => setAddKnownFor(e.target.value)} rows={3}
                placeholder="A sentence about who this person was…"
                className="w-full rounded border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1"
                style={inputStyle} />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button type="submit" disabled={addStatus === 'saving' || !addName.trim() || !addPage.trim()}
                className="px-6 py-2 text-sm tracking-widest uppercase border transition-all hover:bg-yellow-900/20 disabled:opacity-40"
                style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                {addStatus === 'saving' ? 'Adding…' : 'Add Guest'}
              </button>
              {addStatus === 'error' && <span className="text-sm text-red-400">Something went wrong.</span>}
            </div>
          </form>

          {addStatus === 'done' && addedGuest && (
            <div className="mt-8 rounded border p-5" style={{ borderColor: 'rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.06)' }}>
              <p className="text-green-400 text-sm mb-1">✓ Added — page {addedGuest.guestbookPage}</p>
              <p className="text-lg italic mb-3" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>{addedGuest.name}</p>
              <button onClick={() => { setSelected(addedGuest); setStory(''); setTab('stories') }}
                className="text-xs tracking-widest uppercase underline opacity-60 hover:opacity-100"
                style={{ color: 'var(--gold)' }}>
                Write their story →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── PIN SIGNATURES TAB ── */}
      {tab === 'pin' && (
        <div className="max-w-6xl mx-auto px-8 py-10 grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-2">
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--gold)' }}>Click a guest to position their highlight</p>
            <p className="text-xs italic mb-5 opacity-50" style={{ color: 'var(--parchment)' }}>Orange = placeholder · Green = pinned</p>
            {sorted.map((guest) => {
              const placed = !isPlaceholder(guest.guestbookCoords ?? { x: 0.5, y: 0.5 })
              return (
                <button key={guest.id} onClick={() => openPin(guest)}
                  className="w-full text-left px-4 py-3 rounded border transition-all hover:border-yellow-600"
                  style={{
                    borderColor: pinGuest?.id === guest.id ? 'var(--gold)' : 'rgba(201,168,76,0.2)',
                    background: pinGuest?.id === guest.id ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                  }}>
                  <div className="flex items-center gap-3">
                    <span style={{ color: placed ? '#4ade80' : '#f97316', fontSize: '0.5rem' }}>●</span>
                    <div>
                      <p className="text-sm italic" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>{guest.name}</p>
                      <p className="text-xs opacity-40" style={{ color: 'var(--parchment)' }}>p.{guest.guestbookPage}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="md:col-span-3">
            {!pinGuest ? (
              <div className="h-64 flex items-center justify-center border rounded text-sm italic opacity-30"
                style={{ borderColor: 'rgba(201,168,76,0.2)', color: 'var(--parchment)' }}>
                Select a guest to pin their signature
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl italic mb-1" style={{ color: 'var(--cream)', fontFamily: "'Palatino Linotype', serif" }}>{pinGuest.name}</h2>
                  <p className="text-xs opacity-50 mb-3" style={{ color: 'var(--gold)' }}>
                    Page {pinGuest.guestbookPage} · Click on their signature in the image below
                  </p>
                </div>

                <div style={{ position: 'relative', cursor: 'crosshair' }}>
                  <img
                    ref={imgRef}
                    src={`/guestbook-pages/pg${String(pinGuest.guestbookPage).padStart(3, '0')}.jpg`}
                    alt={`Page ${pinGuest.guestbookPage}`}
                    onClick={handleImgClick}
                    style={{ width: '100%', display: 'block', borderRadius: 4 }}
                  />
                  {pinCoords && (
                    <div style={{
                      position: 'absolute',
                      left: `${(pinCoords.x - HL_W / 2) * 100}%`,
                      top: `${(pinCoords.y - HL_H / 2) * 100}%`,
                      width: `${HL_W * 100}%`,
                      height: `${HL_H * 100}%`,
                      background: 'rgba(251,191,36,0.45)',
                      mixBlendMode: 'multiply',
                      borderRadius: 2,
                      pointerEvents: 'none',
                      border: '1px solid rgba(251,191,36,0.8)',
                    }} />
                  )}
                </div>

                {pinCoords && (
                  <p className="text-xs opacity-40" style={{ color: 'var(--parchment)' }}>
                    x={pinCoords.x.toFixed(3)}, y={pinCoords.y.toFixed(3)}
                    {isPlaceholder(pinCoords) ? ' · click the signature above to set position' : ''}
                  </p>
                )}

                <div className="flex items-center gap-4">
                  <button onClick={savePin} disabled={pinSaving || !pinCoords || isPlaceholder(pinCoords)}
                    className="px-6 py-2 text-sm tracking-widest uppercase border transition-all hover:bg-yellow-900/20 disabled:opacity-40"
                    style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                    {pinSaving ? 'Saving…' : 'Save Position'}
                  </button>
                  {pinSaved && <span className="text-sm text-green-400">✓ Saved</span>}
                  <span className="text-xs opacity-30 italic" style={{ color: 'var(--parchment)' }}>Export JSON to keep</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
