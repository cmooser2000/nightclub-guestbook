'use client'

import Link from 'next/link'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PageFlip } from 'page-flip'
import { INTRO, STORY, type Block, type StoryPage } from './storyPages'

export interface BookGuest {
  id: string
  name: string
  category: string
  era: string
  imageUrl: string
  story: string
  guestbookPages: number[]
  visitYears: number[]
}

// The Aladdin closed in 1929; later signatures were added after it closed
// (some pages are headed "Beach Chalet"), so they aren't club visits.
const CLUB_CLOSED = 1929

function visitLine(years: number[]): string {
  const club = years.filter((y) => y <= CLUB_CLOSED)
  const later = years.filter((y) => y > CLUB_CLOSED)
  const parts: string[] = []
  if (club.length) parts.push(`Visited the club in ${listJoin(club)}`)
  if (later.length) parts.push(`${club.length ? 'signed' : 'Signed'} the guestbook in ${listJoin(later)}`)
  return parts.join('; ')
}

function listJoin(items: (string | number)[]): string {
  const s = items.map(String)
  if (s.length <= 1) return s.join('')
  return `${s.slice(0, -1).join(', ')} and ${s[s.length - 1]}`
}

const TITLE = 'Oh, What a Time We Had'
const SUBTITLE = 'Vaudeville and the Early Days of Film Through the Aladdin Tiffin Room in San Francisco'
const CREDIT = 'From the Mooser personal collection'
const NAMES_PER_CONTENTS_PAGE = 20
// Reference page size. Every measurement inside a page is in cqw (percent of
// page width), so a page fitted at this size looks identical at any size.
const PAGE_W = 500
const PAGE_H = 700

type PageDef =
  | { kind: 'cover' }
  | { kind: 'title' }
  | { kind: 'contents'; part: number; parts: number; entries: { label: string; page: number }[] }
  | { kind: 'story'; page: StoryPage }
  | { kind: 'guest'; guest: BookGuest }
  | { kind: 'blank' }
  | { kind: 'back' }

function buildPages(guests: BookGuest[]): PageDef[] {
  const entryCount = guests.length + 2
  const contentsParts = Math.ceil(entryCount / NAMES_PER_CONTENTS_PAGE)
  // Spread the names evenly so the last contents page isn't nearly empty.
  const perPage = Math.ceil(entryCount / contentsParts)
  // cover, title page, contents…, intro, story…, guests…
  const introIndex = 2 + contentsParts
  const storyStart = introIndex + 1
  const guestStart = storyStart + STORY.length

  const entries: { label: string; page: number }[] = [
    { label: 'Introduction', page: introIndex },
    { label: 'Hattie & Minnie Mooser', page: storyStart },
    ...guests.map((g, i) => ({ label: g.name, page: guestStart + i })),
  ]

  const pages: PageDef[] = [{ kind: 'cover' }, { kind: 'title' }]
  for (let p = 0; p < contentsParts; p++) {
    pages.push({
      kind: 'contents',
      part: p,
      parts: contentsParts,
      entries: entries.slice(p * perPage, (p + 1) * perPage),
    })
  }
  pages.push({ kind: 'story', page: INTRO })
  for (const s of STORY) pages.push({ kind: 'story', page: s })
  for (const g of guests) pages.push({ kind: 'guest', guest: g })
  // With a separate front cover, the back cover only sits alone on the left
  // when the total page count is even.
  if ((pages.length + 1) % 2 !== 0) pages.push({ kind: 'blank' })
  pages.push({ kind: 'back' })
  return pages
}

function Folio({ n }: { n: number }) {
  return <div className="bp-folio">{n}</div>
}

function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case 'heading':
      return <h2 className="bp-h2">{b.text}</h2>
    case 'p':
      return <p className="bp-p">{b.text}</p>
    case 'quote':
      return <blockquote className="bp-quote">{b.text}</blockquote>
    case 'boxTitle':
      return <p className="bp-boxtitle">{b.text}</p>
    case 'img':
      return (
        <figure className={`bp-fig ${b.size === 'half' ? 'bp-fig-half' : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.src} alt={b.caption} />
          <figcaption>
            {b.caption}
            {b.collection && <span className="bp-credit">{CREDIT}</span>}
          </figcaption>
        </figure>
      )
  }
}

function PageView({ def, index }: { def: PageDef; index: number }) {
  switch (def.kind) {
    case 'cover':
      return (
        <div className="bp bp-hard" data-density="hard">
          <div className="bp-cover">
            <div className="bp-cover-frame">
              <p className="bp-cover-kicker">The Aladdin Studio Tiffin Room · 1921–1929</p>
              <h1 className="bp-cover-title">{TITLE}</h1>
              <div className="bp-cover-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/memorabilia/book-cover-hattie-minnie.jpg" alt="Hattie and Minnie Mooser" />
              </div>
              <p className="bp-cover-sub">{SUBTITLE}</p>
              <p className="bp-cover-names">Hattie &amp; Minnie Mooser</p>
            </div>
          </div>
        </div>
      )
    case 'title':
      return (
        <div className="bp">
          <div className="bp-inner bp-center">
            <div className="bp-body bp-titlepage">
              <span className="bp-star">✦</span>
              <h1 className="bp-title">{TITLE}</h1>
              <p className="bp-subtitle">{SUBTITLE}</p>
              <div className="bp-rule" />
              <p className="bp-small">From the guestbook of Hattie &amp; Minnie Mooser</p>
              <p className="bp-small">363 Sutter Street · San Francisco</p>
            </div>
          </div>
        </div>
      )
    case 'contents':
      return (
        <div className="bp">
          <div className="bp-inner">
            <div className="bp-body">
              {def.part === 0 ? (
                <h2 className="bp-h2">Contents</h2>
              ) : (
                <h2 className="bp-h2 bp-h2-cont">Contents, continued</h2>
              )}
              <ul className="bp-toc">
                {def.entries.map((e) => (
                  <li key={e.label + e.page}>
                    <a href={`#page-${e.page}`} data-goto={e.page}>
                      <span className="bp-toc-name">{e.label}</span>
                      <span className="bp-toc-dots" />
                      <span className="bp-toc-num">{e.page}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <Folio n={index} />
          </div>
        </div>
      )
    case 'story':
      return (
        <div className="bp">
          <div className="bp-inner">
            <div className={`bp-body ${def.page.fullImage ? 'bp-full' : ''}`}>
              {def.page.blocks.map((b, i) => (
                <BlockView key={i} b={b} />
              ))}
            </div>
            <Folio n={index} />
          </div>
        </div>
      )
    case 'guest': {
      const g = def.guest
      return (
        <div className="bp">
          <div className="bp-inner">
            <div className="bp-body">
              <p className="bp-kicker">
                {[g.category, g.era].filter(Boolean).join(' · ')}
              </p>
              <h2 className="bp-name">{g.name}</h2>
              {g.visitYears.length > 0 && <p className="bp-visited">{visitLine(g.visitYears)}</p>}
              <div className="bp-rule bp-rule-left" />
              {g.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="bp-portrait" src={g.imageUrl} alt={g.name} />
              )}
              {g.story.split(/\n\s*\n/).map((para, i) => (
                <p key={i} className="bp-p bp-story">
                  {para.trim()}
                </p>
              ))}
              <p className="bp-signed">
                Signed on {g.guestbookPages.length > 1 ? 'pages' : 'page'} {listJoin(g.guestbookPages)} of the guestbook ·{' '}
                <a href={`/guest/${g.id}`}>see the signature</a>
              </p>
            </div>
            <Folio n={index} />
          </div>
        </div>
      )
    }
    case 'blank':
      return (
        <div className="bp">
          <div className="bp-inner bp-center">
            <span className="bp-star bp-faint">✦</span>
          </div>
        </div>
      )
    case 'back':
      return (
        <div className="bp bp-hard" data-density="hard">
          <div className="bp-cover bp-back">
            <div className="bp-cover-frame bp-center">
              <span className="bp-star bp-gold">✦</span>
              <p className="bp-back-text">
                Aladdin Studio Tiffin Room
                <br />
                363 Sutter Street · San Francisco
                <br />
                1921–1929
              </p>
            </div>
          </div>
        </div>
      )
  }
}

// The source pages never re-render: page-flip works on a clone of them.
const SourcePages = memo(function SourcePages({ pages }: { pages: PageDef[] }) {
  return (
    <>
      {pages.map((def, i) => (
        <PageView key={i} def={def} index={i} />
      ))}
    </>
  )
})

function waitForImages(root: HTMLElement, timeoutMs: number): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'))
  const pending = imgs
    .filter((img) => !img.complete)
    .map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
        })
    )
  return Promise.race([
    Promise.all(pending).then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ])
}

// Shrink a page's text until it fits, measured at the reference page size.
function fitPages(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('.bp').forEach((page) => {
    const body = page.querySelector<HTMLElement>('.bp-body')
    if (!body || body.classList.contains('bp-full')) return
    // Set on the body, not the page: page-flip rewrites the page's style attribute.
    let fs = 1
    body.style.setProperty('--fs', '1')
    while (body.scrollHeight > body.clientHeight + 1 && fs > 0.5) {
      fs = Math.round((fs - 0.03) * 100) / 100
      body.style.setProperty('--fs', String(fs))
    }
  })
}

export default function FlipBook({ guests }: { guests: BookGuest[] }) {
  const pages = useMemo(() => buildPages(guests), [guests])
  const sourceRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const flipRef = useRef<PageFlip | null>(null)
  const [ready, setReady] = useState(false)
  const [current, setCurrent] = useState(0)
  const [jump, setJump] = useState('')
  const total = pages.length
  const contentsPage = 2

  useEffect(() => {
    let cancelled = false
    let flip: PageFlip | null = null
    let block: HTMLDivElement | null = null

    ;(async () => {
      const source = sourceRef.current
      const host = hostRef.current
      if (!source || !host) return
      await waitForImages(source, 8000)
      if (document.fonts?.ready) await document.fonts.ready
      if (cancelled) return
      fitPages(source)

      const { PageFlip } = await import('page-flip')
      if (cancelled) return
      block = document.createElement('div')
      block.className = 'bp-block'
      host.appendChild(block)
      const clones = Array.from(source.children).map((n) => n.cloneNode(true) as HTMLElement)
      clones.forEach((c) => block!.appendChild(c))

      flip = new PageFlip(block, {
        width: PAGE_W,
        height: PAGE_H,
        size: 'stretch',
        minWidth: 260,
        maxWidth: 720,
        minHeight: 364,
        maxHeight: 1008,
        showCover: true,
        usePortrait: true,
        maxShadowOpacity: 0.45,
        flippingTime: 700,
        mobileScrollSupport: false,
        showPageCorners: true,
      })
      flip.loadFromHTML(clones)
      flip.on('flip', (e) => setCurrent(Number(e.data)))
      flip.on('init', () => {
        if (!cancelled) setReady(true)
      })
      flipRef.current = flip

      // Table-of-contents links jump to their page.
      block.addEventListener('click', (ev) => {
        const target = (ev.target as HTMLElement).closest<HTMLElement>('[data-goto]')
        if (!target) return
        ev.preventDefault()
        ev.stopPropagation()
        flip?.flip(Number(target.dataset.goto))
      })
    })()

    return () => {
      cancelled = true
      flipRef.current = null
      if (flip) flip.destroy()
      else block?.remove()
    }
  }, [pages])

  const go = useCallback((n: number) => {
    const f = flipRef.current
    if (!f) return
    const target = Math.max(0, Math.min(total - 1, n))
    f.flip(target)
  }, [total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      if (e.key === 'ArrowRight') flipRef.current?.flipNext()
      if (e.key === 'ArrowLeft') flipRef.current?.flipPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const pageLabel = current === 0 ? 'Cover' : current === total - 1 ? 'Back cover' : `Page ${current}`

  return (
    <main className="book-shell">
      <style>{CSS}</style>

      <header className="book-bar">
        <Link href="/" className="book-link">← View Full Guestbook</Link>
        <span className="book-bar-title">{TITLE}</span>
        <Link href="/about" className="book-link book-link-right">Hattie &amp; Minnie</Link>
      </header>

      <div className="book-stage">
        {!ready && <p className="book-loading">Opening the book…</p>}
        <div ref={hostRef} className={`book-host ${ready ? 'is-ready' : ''}`} />
      </div>

      <nav className="book-controls" aria-label="Book navigation">
        <button onClick={() => go(0)} disabled={!ready || current === 0} aria-label="Front cover">«</button>
        <button onClick={() => flipRef.current?.flipPrev()} disabled={!ready || current === 0} aria-label="Previous page">‹</button>
        <button onClick={() => go(contentsPage)} disabled={!ready} className="book-contents-btn">Contents</button>
        <span className="book-pos">{pageLabel} <span className="book-of">of {total - 1}</span></span>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const n = parseInt(jump, 10)
            if (!Number.isNaN(n)) go(n)
            setJump('')
          }}
        >
          <input
            value={jump}
            onChange={(e) => setJump(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Go to"
            inputMode="numeric"
            aria-label="Go to page"
            disabled={!ready}
          />
        </form>
        <button onClick={() => flipRef.current?.flipNext()} disabled={!ready || current >= total - 1} aria-label="Next page">›</button>
        <button onClick={() => go(total - 1)} disabled={!ready || current >= total - 1} aria-label="Back cover">»</button>
      </nav>

      {/* Hidden, fixed-size source pages used for measuring and cloning */}
      <div ref={sourceRef} className="book-source" aria-hidden="true">
        <SourcePages pages={pages} />
      </div>
    </main>
  )
}

const CSS = `
@font-face { font-family: 'MarketDeco'; src: url('/fonts/market-deco.ttf') format('truetype'); font-display: block; }
@font-face { font-family: 'LinLibertine'; src: url('/fonts/linlibertine.ttf') format('truetype'); font-display: block; }

.book-shell {
  --ink: #1a1209; --paper: #f5f0e6; --rule: #c8b89a; --accent: #8b6914; --fuchsia: #c0405a;
  --leather: #4a1c1f; --gold: #d8b45c;
  min-height: 100dvh; display: flex; flex-direction: column;
  background: radial-gradient(ellipse at center, #3a2c22 0%, #1d1510 75%);
  color: var(--paper); font-family: 'LinLibertine', Georgia, serif;
}
.book-bar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 12px 20px; border-bottom: 1px solid rgba(216,180,92,0.25);
}
.book-bar-title { font-family: 'MarketDeco', serif; font-size: 1.1rem; color: var(--gold); text-align: center; }
.book-link { color: var(--gold); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; opacity: 0.8; min-width: 110px; }
.book-link-right { text-align: right; }
.book-stage { flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px 16px; position: relative; }
.book-host {
  width: min(96vw, calc((100dvh - 150px) * ${(2 * PAGE_W) / PAGE_H}));
  opacity: 0; transition: opacity 0.4s;
}
.book-host.is-ready { opacity: 1; }
.book-loading { position: absolute; font-style: italic; color: var(--gold); opacity: 0.8; }
.book-controls {
  display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;
  padding: 10px 16px 16px; border-top: 1px solid rgba(216,180,92,0.25);
}
.book-controls button, .book-controls input {
  font-family: 'LinLibertine', serif; background: rgba(245,240,230,0.08); color: var(--paper);
  border: 1px solid rgba(216,180,92,0.4); border-radius: 3px; height: 36px; min-width: 40px; font-size: 1.1rem; cursor: pointer;
}
.book-controls button:disabled { opacity: 0.35; cursor: default; }
.book-controls button:not(:disabled):hover { background: rgba(216,180,92,0.2); }
.book-contents-btn { font-size: 0.8rem !important; letter-spacing: 0.12em; text-transform: uppercase; padding: 0 12px; }
.book-controls input { width: 72px; font-size: 0.85rem; text-align: center; cursor: text; }
.book-pos { font-size: 0.9rem; min-width: 120px; text-align: center; }
.book-of { opacity: 0.55; }
.book-source { position: absolute; left: -10000px; top: 0; visibility: hidden; pointer-events: none; }
.book-source .bp { width: ${PAGE_W}px; height: ${PAGE_H}px; position: relative; margin-bottom: 4px; }

/* ── Pages ── */
.bp { background: var(--paper); color: var(--ink); overflow: hidden; container-type: inline-size; }
.bp-inner { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 8cqw 8.5cqw 5cqw; }
.bp-body { flex: 1; min-height: 0; overflow: hidden; font-size: calc(3.1cqw * var(--fs, 1)); line-height: 1.6; }
.bp-center { align-items: center; justify-content: center; text-align: center; }
.bp-folio { text-align: center; font-size: 2.4cqw; letter-spacing: 0.2em; color: var(--accent); padding-top: 2.5cqw; }
.bp-h2 { font-family: 'MarketDeco', serif; font-weight: 400; font-size: 2.2em; line-height: 1.1; margin: 0 0 0.7em; text-align: center; }
.bp-h2-cont { font-size: 1.5em; }
.bp-p { margin: 0 0 0.85em; text-align: justify; hyphens: auto; }
.bp-quote { margin: 0.9em 0; padding-left: 0.9em; border-left: 0.6cqw solid var(--ink); font-style: italic; font-size: 1.08em; line-height: 1.55; }
.bp-boxtitle { font-size: 0.72em; letter-spacing: 0.28em; text-transform: uppercase; color: var(--accent); border-top: 1px solid var(--rule); padding-top: 0.9em; margin: 1.1em 0 0.7em; }
.bp-fig { margin: 0.6em 0 0.9em; text-align: center; }
.bp-fig img { width: 100%; display: block; border: 1px solid var(--rule); filter: sepia(10%); }
.bp-fig-half img { width: 70%; margin: 0 auto; }
.bp-fig figcaption, .bp-full figcaption { font-size: 0.72em; font-style: italic; opacity: 0.65; margin-top: 0.45em; line-height: 1.4; }
.bp-credit { display: block; font-style: normal; font-size: 0.85em; letter-spacing: 0.06em; margin-top: 0.2em; }
.bp-full { display: flex; flex-direction: column; font-size: 3.1cqw; }
.bp-full .bp-fig { flex: 1; min-height: 0; display: flex; flex-direction: column; margin: 0; }
.bp-full .bp-fig img { flex: 1; min-height: 0; width: 100%; height: 100%; object-fit: contain; border: none; }
.bp-full .bp-fig figcaption { flex: none; }

.bp-kicker { font-size: 0.68em; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent); margin: 0 0 0.5em; }
.bp-name { font-family: 'MarketDeco', serif; font-weight: 400; font-size: 2.3em; line-height: 1.05; margin: 0; }
.bp-rule { height: 1px; background: var(--rule); margin: 0.8em auto; width: 40%; }
.bp-rule-left { margin: 0.7em 0 1em; width: 30%; }
.bp-visited { font-style: italic; font-size: 0.78em; color: var(--accent); margin: 0.35em 0 0; letter-spacing: 0.02em; }
.bp-portrait { float: right; width: 38%; max-height: 52cqw; object-fit: cover; object-position: top; margin: 0.25em 0 0.6em 1em; border: 1px solid var(--rule); filter: sepia(15%); }
.bp-story { font-style: italic; }
.bp-signed { clear: both; font-size: 0.72em; letter-spacing: 0.04em; color: var(--accent); margin-top: 1em; }
.bp-signed a { color: var(--accent); }

.bp-titlepage { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.bp-title { font-family: 'MarketDeco', serif; font-weight: 400; font-size: 2.9em; line-height: 1.05; margin: 0.4em 0 0.5em; }
.bp-subtitle { font-style: italic; font-size: 1.15em; line-height: 1.5; max-width: 85%; margin: 0; }
.bp-small { font-size: 0.75em; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin: 0.3em 0; }
.bp-star { color: var(--fuchsia); font-size: 1.4em; }
.bp-faint { opacity: 0.35; font-size: 5cqw; }

.bp-toc { list-style: none; margin: 0; padding: 0; }
.bp-toc li { margin: 0 0 0.28em; }
.bp-toc a { display: flex; align-items: baseline; gap: 0.4em; color: var(--ink); text-decoration: none; cursor: pointer; }
.bp-toc a:hover .bp-toc-name { color: var(--fuchsia); }
.bp-toc-dots { flex: 1; border-bottom: 1px dotted var(--rule); transform: translateY(-0.25em); }
.bp-toc-num { color: var(--accent); font-variant-numeric: oldstyle-nums; }

.bp-hard .bp-cover, .bp-cover { position: absolute; inset: 0; background: linear-gradient(135deg, #5a2226 0%, var(--leather) 55%, #36131a 100%); color: var(--gold); padding: 5cqw; }
.bp-cover-frame { height: 100%; border: 0.5cqw double var(--gold); outline: 1px solid rgba(216,180,92,0.35); outline-offset: 1.5cqw; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5cqw 6cqw; text-align: center; }
.bp-cover-kicker { font-size: 2.3cqw; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 3cqw; opacity: 0.85; }
.bp-cover-title { font-family: 'MarketDeco', serif; font-weight: 400; font-size: 8.4cqw; line-height: 1.02; margin: 0 0 4cqw; color: #f0d98c; text-shadow: 0 1px 0 rgba(0,0,0,0.4); }
.bp-cover-photo { width: 78%; padding: 1.6cqw; background: #efe6d2; box-shadow: 0 1.5cqw 3cqw rgba(0,0,0,0.45); transform: rotate(-1.2deg); }
.bp-cover-photo img { width: 100%; display: block; filter: sepia(25%) contrast(1.05); }
.bp-cover-sub { font-style: italic; font-size: 3.3cqw; line-height: 1.4; margin: 5cqw 0 2.5cqw; color: #f3e7c4; max-width: 90%; }
.bp-cover-names { font-size: 2.2cqw; letter-spacing: 0.3em; text-transform: uppercase; margin: 0; opacity: 0.8; }
.bp-back-text { font-size: 2.8cqw; letter-spacing: 0.18em; text-transform: uppercase; line-height: 2; margin-top: 3cqw; }
.bp-gold { color: var(--gold); font-size: 5cqw; }

@media (max-width: 600px) {
  .book-bar-title { display: none; }
  .book-host { width: min(94vw, calc((100dvh - 190px) * ${PAGE_W / PAGE_H})); }
  .book-pos { min-width: 90px; font-size: 0.8rem; }
}
`
