'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Coords { x: number; y: number }

interface Guest {
  id: string
  name: string
  nameVariants: string[]
  category: string
  knownFor: string
  quickFacts: string[]
  imageUrl: string
  wikiUrl: string
  guestbookPage: number
  guestbookCoords: Coords
  dadStory: string
  dadStoryUpdated: string | null
  additionalImages: string[]
}

const HL_W = 0.52
const HL_H = 0.048

const PAPER = '#f5f0e6'
const INK = '#1a1209'
const RULE = '#c8b89a'
const ACCENT = '#8b6914'
const RULE_DIM = 'rgba(200,184,154,0.4)'
const BODY_FONT = "'LinLibertine', 'Palatino Linotype', Palatino, serif"

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

function AdminInner({ guests, setGuests }: { guests: Guest[]; setGuests: React.Dispatch<React.SetStateAction<Guest[]>> }) {
  const searchParams = useSearchParams()
  const [selected, setSelected] = useState<Guest | null>(null)
  const [story, setStory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imgSaving, setImgSaving] = useState(false)
  const [imgSaved, setImgSaved] = useState(false)
  const [additionalImages, setAdditionalImages] = useState<string[]>([])
  const [addlSaving, setAddlSaving] = useState(false)
  const [addlSaved, setAddlSaved] = useState(false)
  const addlFileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [tab, setTab] = useState<'stories' | 'add' | 'pin'>('stories')
  const [akaInput, setAkaInput] = useState('')
  const [akaVariants, setAkaVariants] = useState<string[]>([])
  const [akaSaving, setAkaSaving] = useState(false)
  const [akaSaved, setAkaSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)

  const [addName, setAddName] = useState('')
  const [addPage, setAddPage] = useState('')
  const [addLocation, setAddLocation] = useState('')
  const [addCategory, setAddCategory] = useState('')
  const [addKnownFor, setAddKnownFor] = useState('')
  const [addStatus, setAddStatus] = useState<null | 'saving' | 'done' | 'error'>(null)
  const [addedGuest, setAddedGuest] = useState<Guest | null>(null)

  const [pinGuest, setPinGuest] = useState<Guest | null>(null)
  const [pinCoords, setPinCoords] = useState<Coords | null>(null)
  const [pinSaving, setPinSaving] = useState(false)
  const [pinSaved, setPinSaved] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Auto-select guest from URL params (e.g. coming from profile "Add story" link)
  useEffect(() => {
    if (guests.length === 0) return
    const guestId = searchParams.get('guest')
    const focus = searchParams.get('focus')
    if (guestId) {
      const g = guests.find((x) => x.id === guestId)
      if (g) {
        setSelected(g)
        setStory(g.dadStory)
        setImageUrl(g.imageUrl)
        setTab('stories')
        if (focus === 'story') {
          setTimeout(() => {
            storyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            const el = document.getElementById('story-textarea')
            if (el) (el as HTMLTextAreaElement).focus()
          }, 300)
        }
      }
    }
  }, [guests, searchParams])

  function openGuest(guest: Guest) {
    setSelected(guest)
    setStory(guest.dadStory)
    setImageUrl(guest.imageUrl)
    setAkaVariants(guest.nameVariants ?? [])
    setAkaInput('')
    setAdditionalImages(guest.additionalImages ?? [])
    setSaved(false)
    setImgSaved(false)
    setAkaSaved(false)
    setAddlSaved(false)
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
    setSaveError(false)
    const res = await fetch(`/api/guests/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dadStory: story }),
    })
    setSaving(false)
    if (!res.ok) { setSaveError(true); return }
    setGuests((prev) =>
      prev.map((g) =>
        g.id === selected.id
          ? { ...g, dadStory: story, dadStoryUpdated: new Date().toISOString() }
          : g
      )
    )
    setSelected((prev) => (prev ? { ...prev, dadStory: story } : null))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function saveImage() {
    if (!selected || !imageUrl) return
    setImgSaving(true)
    const res = await fetch(`/api/guests/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    })
    setImgSaving(false)
    if (!res.ok) { alert('Save failed — use Export JSON to preserve changes locally.'); return }
    setGuests((prev) =>
      prev.map((g) => g.id === selected.id ? { ...g, imageUrl } : g)
    )
    setSelected((prev) => (prev ? { ...prev, imageUrl } : null))
    setImgSaved(true)
    setTimeout(() => setImgSaved(false), 3000)
  }

  async function saveAka() {
    if (!selected) return
    setAkaSaving(true)
    await fetch(`/api/guests/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nameVariants: akaVariants }),
    })
    setGuests((prev) =>
      prev.map((g) => g.id === selected.id ? { ...g, nameVariants: akaVariants } : g)
    )
    setSelected((prev) => prev ? { ...prev, nameVariants: akaVariants } : null)
    setAkaSaving(false)
    setAkaSaved(true)
    setTimeout(() => setAkaSaved(false), 3000)
  }

  async function saveAdditionalImages(images: string[]) {
    if (!selected) return
    setAddlSaving(true)
    const res = await fetch(`/api/guests/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ additionalImages: images }),
    })
    setAddlSaving(false)
    if (!res.ok) { alert('Save failed — use Export JSON to preserve changes locally.'); return }
    setGuests((prev) =>
      prev.map((g) => g.id === selected.id ? { ...g, additionalImages: images } : g)
    )
    setSelected((prev) => prev ? { ...prev, additionalImages: images } : null)
    setAddlSaved(true)
    setTimeout(() => setAddlSaved(false), 3000)
  }

  async function handleAddlFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const compressed = await Promise.all(files.map(compressImage))
    const updated = [...additionalImages, ...compressed]
    setAdditionalImages(updated)
    setAddlSaved(false)
    e.target.value = ''
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
    const res = await fetch(`/api/guests/${pinGuest.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestbookCoords: pinCoords }),
    })
    setPinSaving(false)
    if (!res.ok) { alert('Save failed — use Export JSON to preserve changes locally.'); return }
    setGuests((prev) =>
      prev.map((g) => g.id === pinGuest.id ? { ...g, guestbookCoords: pinCoords } : g)
    )
    setPinGuest((prev) => prev ? { ...prev, guestbookCoords: pinCoords } : null)
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
    background: 'rgba(0,0,0,0.03)',
    borderColor: RULE,
    color: INK,
    fontFamily: BODY_FONT,
  }

  return (
    <>
      {/* Header */}
      <header className="border-b px-8 py-6" style={{ borderColor: RULE }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: ACCENT, fontFamily: BODY_FONT }}>Admin</p>
            <h1 className="text-2xl" style={{ color: INK, fontFamily: "'MarketDeco', serif" }}>
              The Guestbook
            </h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light" style={{ color: ACCENT }}>{completed}/{guests.length}</p>
            <p className="text-xs opacity-50" style={{ color: INK, fontFamily: BODY_FONT }}>stories written</p>
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
                  borderColor: tab === t ? ACCENT : 'transparent',
                  color: tab === t ? ACCENT : 'rgba(26,18,9,0.35)',
                  fontFamily: BODY_FONT,
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
            style={{ color: INK, fontFamily: BODY_FONT }}
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
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: ACCENT, fontFamily: BODY_FONT }}>
              Guests — sorted by page
            </p>
            {sorted.map((guest) => {
              const hasStory = guest.dadStory.trim().length > 0
              const hasPhoto = guest.imageUrl.trim().length > 0
              return (
                <button
                  key={guest.id}
                  onClick={() => openGuest(guest)}
                  className="w-full text-left p-3 rounded border transition-all"
                  style={{
                    borderColor: selected?.id === guest.id ? ACCENT : RULE_DIM,
                    background: selected?.id === guest.id ? 'rgba(139,105,20,0.06)' : 'transparent',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm italic truncate" style={{ color: INK, fontFamily: BODY_FONT }}>
                        {guest.name}
                      </p>
                      <p className="text-xs opacity-40 mt-0.5" style={{ color: INK, fontFamily: BODY_FONT }}>
                        p.{guest.guestbookPage}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <span title="Story" style={{ fontSize: '0.65rem', color: hasStory ? '#2a7a3a' : '#bbb' }}>✍</span>
                      <span title="Photo" style={{ fontSize: '0.65rem', color: hasPhoto ? '#2a7a3a' : '#bbb' }}>📷</span>
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
                style={{ borderColor: RULE_DIM, color: INK }}
              >
                <p className="text-sm italic opacity-30" style={{ fontFamily: BODY_FONT }}>Select a guest from the list</p>
              </div>
            ) : (
              <div className="space-y-8">

                {/* Name + meta */}
                <div>
                  <a href={`/guest/${selected.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <h2 className="text-3xl mb-1 hover:opacity-70 transition-opacity" style={{ color: INK, fontFamily: "'MarketDeco', serif" }}>
                      {selected.name} ↗
                    </h2>
                  </a>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: ACCENT, fontFamily: BODY_FONT }}>
                    {selected.category} · Page {selected.guestbookPage}
                  </p>
                  {selected.wikiUrl && (
                    <a href={selected.wikiUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs underline opacity-40 hover:opacity-100" style={{ color: INK, fontFamily: BODY_FONT }}>
                      Wikipedia →
                    </a>
                  )}
                </div>

                {/* ── AKA / NAME VARIANTS ── */}
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: ACCENT, fontFamily: BODY_FONT }}>
                    Also Known As
                  </p>
                  <p className="text-xs italic mb-3 opacity-40" style={{ color: INK, fontFamily: BODY_FONT }}>
                    Real name, nickname, or any alternate spelling someone might search for.
                  </p>

                  {/* Tag list */}
                  {akaVariants.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {akaVariants.map((v, i) => (
                        <span key={i} className="flex items-center gap-1 px-2 py-1 rounded text-xs border" style={{ borderColor: RULE, color: INK, fontFamily: BODY_FONT, background: 'rgba(200,184,154,0.15)' }}>
                          {v}
                          <button
                            onClick={() => { setAkaVariants(akaVariants.filter((_, j) => j !== i)); setAkaSaved(false) }}
                            style={{ opacity: 0.4, lineHeight: 1, fontSize: '0.8rem', marginLeft: 2 }}
                          >×</button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Add input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={akaInput}
                      onChange={(e) => setAkaInput(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ',') && akaInput.trim()) {
                          e.preventDefault()
                          const v = akaInput.trim().replace(/,$/, '')
                          if (v && !akaVariants.includes(v)) setAkaVariants([...akaVariants, v])
                          setAkaInput('')
                          setAkaSaved(false)
                        }
                      }}
                      placeholder="Type a name and press Enter"
                      className="flex-1 rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                      style={inputStyle}
                    />
                    <button
                      onClick={() => {
                        const v = akaInput.trim()
                        if (v && !akaVariants.includes(v)) setAkaVariants([...akaVariants, v])
                        setAkaInput('')
                        setAkaSaved(false)
                      }}
                      className="px-3 py-2 text-xs border transition-all"
                      style={{ borderColor: RULE, color: ACCENT, fontFamily: BODY_FONT }}
                    >Add</button>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={saveAka}
                      disabled={akaSaving}
                      className="px-6 py-2 text-sm tracking-widest uppercase border transition-all disabled:opacity-40"
                      style={{ borderColor: ACCENT, color: ACCENT, fontFamily: BODY_FONT }}
                    >
                      {akaSaving ? 'Saving…' : 'Save Names'}
                    </button>
                    {akaSaved && <span className="text-sm" style={{ color: '#2a7a3a' }}>✓ Saved</span>}
                  </div>
                </div>

                {/* ── PHOTO ── */}
                <div>
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: ACCENT, fontFamily: BODY_FONT }}>
                    Photo
                  </p>

                  {imageUrl ? (
                    <div className="flex gap-4 items-start">
                      <img
                        src={imageUrl}
                        alt={selected.name}
                        className="rounded border"
                        style={{ width: 120, height: 140, objectFit: 'cover', objectPosition: 'top', borderColor: RULE }}
                      />
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs px-3 py-1.5 border transition-all"
                          style={{ borderColor: RULE, color: ACCENT, fontFamily: BODY_FONT }}
                        >
                          Replace photo
                        </button>
                        <button
                          onClick={() => { setImageUrl(''); setImgSaved(false) }}
                          className="text-xs px-3 py-1.5 border transition-all"
                          style={{ borderColor: 'rgba(180,60,60,0.3)', color: 'rgba(160,60,60,0.8)', fontFamily: BODY_FONT }}
                        >
                          Remove
                        </button>
                        <button
                          onClick={saveImage}
                          disabled={imgSaving}
                          className="text-xs px-3 py-1.5 border transition-all disabled:opacity-40"
                          style={{ borderColor: ACCENT, color: ACCENT, fontFamily: BODY_FONT }}
                        >
                          {imgSaving ? 'Saving…' : 'Save Photo'}
                        </button>
                        {imgSaved && <span className="text-xs" style={{ color: '#2a7a3a' }}>✓ Saved</span>}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed rounded py-8 text-center transition-all"
                      style={{ borderColor: RULE_DIM, color: INK }}
                    >
                      <p className="text-sm mb-1" style={{ color: ACCENT, opacity: 0.7, fontFamily: BODY_FONT }}>Click to add a photo</p>
                      <p className="text-xs opacity-40" style={{ fontFamily: BODY_FONT }}>JPG or PNG · compressed automatically</p>
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

                {/* ── ADDITIONAL IMAGES ── */}
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: ACCENT, fontFamily: BODY_FONT }}>
                    Additional Images
                  </p>
                  <p className="text-xs italic mb-3 opacity-40" style={{ color: INK, fontFamily: BODY_FONT }}>
                    Family photos, newspaper clippings, memorabilia — scroll below the guestbook signature on the profile page.
                  </p>

                  {additionalImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {additionalImages.map((src, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={src} alt={`Additional ${i + 1}`}
                            style={{ width: 80, height: 90, objectFit: 'cover', border: `1px solid ${RULE}`, borderRadius: 2 }} />
                          <button
                            onClick={() => { const updated = additionalImages.filter((_, j) => j !== i); setAdditionalImages(updated); setAddlSaved(false) }}
                            style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#c0405a', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.65rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => addlFileInputRef.current?.click()}
                    className="w-full border-2 border-dashed rounded py-5 text-center transition-all mb-3"
                    style={{ borderColor: RULE_DIM }}
                  >
                    <p className="text-sm" style={{ color: ACCENT, opacity: 0.7, fontFamily: BODY_FONT }}>+ Add images</p>
                    <p className="text-xs opacity-40" style={{ fontFamily: BODY_FONT }}>Select one or more · compressed automatically</p>
                  </button>

                  <input
                    ref={addlFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleAddlFileUpload}
                    className="hidden"
                  />

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => saveAdditionalImages(additionalImages)}
                      disabled={addlSaving}
                      className="px-6 py-2 text-sm tracking-widest uppercase border transition-all disabled:opacity-40"
                      style={{ borderColor: ACCENT, color: ACCENT, fontFamily: BODY_FONT }}
                    >
                      {addlSaving ? 'Saving…' : 'Save Images'}
                    </button>
                    {addlSaved && <span className="text-sm" style={{ color: '#2a7a3a' }}>✓ Saved</span>}
                  </div>
                </div>

                {/* ── STORY ── */}
                <div ref={storyRef}>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: ACCENT, fontFamily: BODY_FONT }}>
                    {selected.name.split(' ')[0]}'s Story
                  </p>
                  <p className="text-xs italic mb-3 opacity-40" style={{ color: INK, fontFamily: BODY_FONT }}>
                    A memory, an anecdote, what they meant to you or the family.
                  </p>

                  <textarea
                    id="story-textarea"
                    value={story}
                    onChange={(e) => { setStory(e.target.value); setSaved(false) }}
                    rows={10}
                    placeholder={`Add more information about ${selected.name}…`}
                    className="w-full rounded border p-4 text-sm leading-relaxed resize-y focus:outline-none focus:ring-1"
                    style={inputStyle}
                  />

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={save}
                      disabled={saving || !story.trim()}
                      className="px-6 py-2 text-sm tracking-widest uppercase border transition-all disabled:opacity-40"
                      style={{ borderColor: ACCENT, color: ACCENT, fontFamily: BODY_FONT }}
                    >
                      {saving ? 'Saving…' : 'Save Story'}
                    </button>
                    {saved && <span className="text-sm" style={{ color: '#2a7a3a' }}>✓ Saved</span>}
                    {saveError && (
                      <span className="text-xs leading-snug" style={{ color: '#b94040', fontFamily: BODY_FONT, maxWidth: 260 }}>
                        Save failed — Vercel's filesystem is read-only. Use <strong>Export JSON</strong> above, replace <code>data/guests.json</code>, then redeploy.
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick facts ref */}
                {selected.quickFacts.length > 0 && (
                  <details className="rounded border" style={{ borderColor: RULE_DIM }}>
                    <summary className="px-4 py-3 text-xs tracking-widest uppercase cursor-pointer" style={{ color: ACCENT, opacity: 0.6, fontFamily: BODY_FONT }}>
                      Reference facts ▾
                    </summary>
                    <div className="px-4 pb-4 space-y-1">
                      {selected.quickFacts.map((fact, i) => (
                        <p key={i} className="text-sm opacity-60" style={{ color: INK, fontFamily: BODY_FONT }}>· {fact}</p>
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
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: ACCENT, fontFamily: BODY_FONT }}>Add a Guest</p>
          <p className="text-sm italic mb-8 opacity-60" style={{ color: INK, fontFamily: BODY_FONT }}>
            Found a name in the guestbook that isn't listed? Add them here. Only name and page number are required.
          </p>

          <form onSubmit={addGuest} className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: ACCENT, fontFamily: BODY_FONT }}>Name as written *</label>
                <input type="text" value={addName} onChange={(e) => setAddName(e.target.value)} required
                  placeholder="e.g. Miss E. E. McClatchy"
                  className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                  style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: ACCENT, fontFamily: BODY_FONT }}>Page # *</label>
                <input type="number" value={addPage} onChange={(e) => setAddPage(e.target.value)} required min={1} max={418}
                  placeholder="42"
                  className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                  style={{ ...inputStyle, fontFamily: undefined }} />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: ACCENT, fontFamily: BODY_FONT }}>Location / Address (optional)</label>
              <input type="text" value={addLocation} onChange={(e) => setAddLocation(e.target.value)}
                placeholder="e.g. Sacramento, Cal."
                className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                style={inputStyle} />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: ACCENT, fontFamily: BODY_FONT }}>Category (optional)</label>
              <input type="text" value={addCategory} onChange={(e) => setAddCategory(e.target.value)}
                placeholder="e.g. Actress, Journalist…"
                className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                style={inputStyle} />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: ACCENT, fontFamily: BODY_FONT }}>Known for (optional)</label>
              <textarea value={addKnownFor} onChange={(e) => setAddKnownFor(e.target.value)} rows={3}
                placeholder="A sentence about who this person was…"
                className="w-full rounded border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1"
                style={inputStyle} />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button type="submit" disabled={addStatus === 'saving' || !addName.trim() || !addPage.trim()}
                className="px-6 py-2 text-sm tracking-widest uppercase border transition-all disabled:opacity-40"
                style={{ borderColor: ACCENT, color: ACCENT, fontFamily: BODY_FONT }}>
                {addStatus === 'saving' ? 'Adding…' : 'Add Guest'}
              </button>
              {addStatus === 'error' && <span className="text-sm text-red-600">Something went wrong.</span>}
            </div>
          </form>

          {addStatus === 'done' && addedGuest && (
            <div className="mt-8 rounded border p-5" style={{ borderColor: 'rgba(42,122,58,0.3)', background: 'rgba(42,122,58,0.05)' }}>
              <p className="text-sm mb-1" style={{ color: '#2a7a3a', fontFamily: BODY_FONT }}>✓ Added — page {addedGuest.guestbookPage}</p>
              <p className="text-lg italic mb-3" style={{ color: INK, fontFamily: BODY_FONT }}>{addedGuest.name}</p>
              <button onClick={() => { setSelected(addedGuest); setStory(''); setTab('stories') }}
                className="text-xs tracking-widest uppercase underline opacity-60 hover:opacity-100"
                style={{ color: ACCENT, fontFamily: BODY_FONT }}>
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
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: ACCENT, fontFamily: BODY_FONT }}>Click a guest to position their highlight</p>
            <p className="text-xs italic mb-5 opacity-50" style={{ color: INK, fontFamily: BODY_FONT }}>Orange = placeholder · Green = pinned</p>
            {sorted.map((guest) => {
              const placed = !isPlaceholder(guest.guestbookCoords ?? { x: 0.5, y: 0.5 })
              return (
                <button key={guest.id} onClick={() => openPin(guest)}
                  className="w-full text-left px-4 py-3 rounded border transition-all"
                  style={{
                    borderColor: pinGuest?.id === guest.id ? ACCENT : RULE_DIM,
                    background: pinGuest?.id === guest.id ? 'rgba(139,105,20,0.06)' : 'transparent',
                  }}>
                  <div className="flex items-center gap-3">
                    <span style={{ color: placed ? '#2a7a3a' : '#f97316', fontSize: '0.5rem' }}>●</span>
                    <div>
                      <p className="text-sm italic" style={{ color: INK, fontFamily: BODY_FONT }}>{guest.name}</p>
                      <p className="text-xs opacity-40" style={{ color: INK, fontFamily: BODY_FONT }}>p.{guest.guestbookPage}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="md:col-span-3">
            {!pinGuest ? (
              <div className="h-64 flex items-center justify-center border rounded text-sm italic opacity-30"
                style={{ borderColor: RULE_DIM, color: INK, fontFamily: BODY_FONT }}>
                Select a guest to pin their signature
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl italic mb-1" style={{ color: INK, fontFamily: BODY_FONT }}>{pinGuest.name}</h2>
                  <p className="text-xs opacity-50 mb-3" style={{ color: ACCENT, fontFamily: BODY_FONT }}>
                    Page {pinGuest.guestbookPage} · Click on their signature in the image below
                  </p>
                </div>

                <div style={{ position: 'relative', cursor: 'crosshair' }}>
                  <img
                    ref={imgRef}
                    src={`/guestbook-pages/pg${String(pinGuest.guestbookPage).padStart(3, '0')}.jpg`}
                    alt={`Page ${pinGuest.guestbookPage}`}
                    onClick={handleImgClick}
                    style={{ width: '100%', display: 'block', borderRadius: 4, border: `1px solid ${RULE}` }}
                  />
                  {pinCoords && (
                    <>
                      {/* horizontal highlight bar */}
                      <div style={{
                        position: 'absolute',
                        left: `${(pinCoords.x - HL_W / 2) * 100}%`,
                        top: `${(pinCoords.y - HL_H / 2) * 100}%`,
                        width: `${HL_W * 100}%`,
                        height: `${HL_H * 100}%`,
                        background: 'rgba(251,191,36,0.55)',
                        borderRadius: 2,
                        pointerEvents: 'none',
                        border: '2px solid rgba(220,160,0,0.9)',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
                      }} />
                      {/* center dot */}
                      <div style={{
                        position: 'absolute',
                        left: `calc(${pinCoords.x * 100}% - 5px)`,
                        top: `calc(${pinCoords.y * 100}% - 5px)`,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#e53e3e',
                        border: '2px solid white',
                        pointerEvents: 'none',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                      }} />
                    </>
                  )}
                </div>

                {pinCoords && (
                  <p className="text-xs opacity-40" style={{ color: INK, fontFamily: BODY_FONT }}>
                    x={pinCoords.x.toFixed(3)}, y={pinCoords.y.toFixed(3)}
                    {isPlaceholder(pinCoords) ? ' · click the signature above to set position' : ''}
                  </p>
                )}

                <div className="flex items-center gap-4">
                  <button onClick={savePin} disabled={pinSaving || !pinCoords || isPlaceholder(pinCoords)}
                    className="px-6 py-2 text-sm tracking-widest uppercase border transition-all disabled:opacity-40"
                    style={{ borderColor: ACCENT, color: ACCENT, fontFamily: BODY_FONT }}>
                    {pinSaving ? 'Saving…' : 'Save Position'}
                  </button>
                  {pinSaved && <span className="text-sm" style={{ color: '#2a7a3a' }}>✓ Saved</span>}
                  <span className="text-xs opacity-30 italic" style={{ color: INK, fontFamily: BODY_FONT }}>Export JSON to keep</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])

  useEffect(() => {
    fetch('/api/guests').then((r) => r.json()).then(setGuests)
  }, [])

  return (
    <main className="min-h-screen" style={{ background: PAPER, fontFamily: BODY_FONT }}>
      <style>{`
        @font-face { font-family: 'MarketDeco'; src: url('/fonts/market-deco.ttf') format('truetype'); font-display: block; }
        @font-face { font-family: 'LinLibertine'; src: url('/fonts/linlibertine.ttf') format('truetype'); font-display: block; }
      `}</style>
      <Suspense>
        <AdminInner guests={guests} setGuests={setGuests} />
      </Suspense>
    </main>
  )
}
