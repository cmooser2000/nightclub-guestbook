import { getGuest, getGuests } from '@/lib/guests'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const INK = '#1a1209'
const PAPER = '#f5f0e6'
const RULE = '#c8b89a'
const ACCENT = '#8b6914'

export async function generateStaticParams() {
  const guests = await getGuests()
  return guests.map((g) => ({ id: g.id }))
}

export default async function GuestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const guest = await getGuest(id)
  if (!guest) notFound()

  const pageNum = String(guest.guestbookPage).padStart(3, '0')
  const guestbookPageImg = `/guestbook-pages/pg${pageNum}.jpg`

  return (
    <main style={{ background: PAPER, color: INK, fontFamily: 'var(--font-garamond), Georgia, serif', minHeight: '100vh' }}>

      {/* Nav strip */}
      <div style={{ borderBottom: `1px solid ${RULE}`, padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          href={`/#page-${guest.guestbookPage}`}
          style={{ color: ACCENT, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          ← Back to Guestbook
        </Link>
        <Link
          href="/"
          style={{ color: ACCENT, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', opacity: 0.6 }}
        >
          The Aladdin
        </Link>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 32px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: `2px double ${INK}`, paddingBottom: 32, marginBottom: 44 }}>
          <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 14, color: ACCENT }}>
            {guest.category} · {guest.era}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2.4rem, 7vw, 4.5rem)',
            fontWeight: 900,
            fontStyle: 'italic',
            lineHeight: 1.05,
            margin: '0 0 20px',
            letterSpacing: '0.01em',
            color: INK,
          }}>
            {guest.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', color: RULE }}>
            <div style={{ flex: 1, height: 1, background: RULE }} />
            <span style={{ fontSize: '0.9rem', color: ACCENT }}>✦</span>
            <div style={{ flex: 1, height: 1, background: RULE }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'start' }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {guest.imageUrl && (
              <div>
                <img
                  src={guest.imageUrl}
                  alt={guest.name}
                  style={{ width: '100%', display: 'block', border: `1px solid ${RULE}`, filter: 'sepia(8%)' }}
                />
                {guest.imageCredit && (
                  <p style={{ fontSize: '0.7rem', marginTop: 6, textAlign: 'center', opacity: 0.5, fontStyle: 'italic' }}>
                    {guest.imageCredit}
                  </p>
                )}
              </div>
            )}

            {/* Guestbook page */}
            <div>
              <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 10, color: ACCENT }}>
                Signed on page {guest.guestbookPage}
              </p>
              <img
                src={guestbookPageImg}
                alt={`Guestbook page ${guest.guestbookPage}`}
                style={{ width: '100%', display: 'block', border: `1px solid ${RULE}`, filter: 'sepia(5%)' }}
              />
            </div>

          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

            <p style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
              fontStyle: 'italic',
              lineHeight: 1.7,
              borderLeft: `3px solid ${INK}`,
              paddingLeft: 20,
              margin: 0,
            }}>
              {guest.knownFor}
            </p>

            {guest.quickFacts.length > 0 && (
              <div>
                <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 14, borderBottom: `1px solid ${RULE}`, paddingBottom: 8, color: ACCENT }}>
                  Quick Facts
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {guest.quickFacts.map((fact, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, fontSize: '1rem', lineHeight: 1.65 }}>
                      <span style={{ color: ACCENT, flexShrink: 0 }}>✦</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dad's story */}
            <div style={{ borderTop: `1px solid ${RULE}`, paddingTop: 28 }}>
              <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, color: ACCENT }}>
                A Personal Recollection
              </p>
              {guest.dadStory ? (
                <>
                  <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.8, margin: 0 }}>
                    {guest.dadStory}
                  </p>
                  {guest.dadStoryUpdated && (
                    <p style={{ fontSize: '0.7rem', marginTop: 16, opacity: 0.4, fontStyle: 'italic' }}>
                      Last updated {new Date(guest.dadStoryUpdated).toLocaleDateString()}
                    </p>
                  )}
                </>
              ) : (
                <Link
                  href={`/admin-guestbook?guest=${guest.id}`}
                  style={{
                    display: 'inline-block',
                    fontSize: '0.72rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: ACCENT,
                    textDecoration: 'none',
                    border: `1px solid ${RULE}`,
                    padding: '8px 18px',
                    opacity: 0.6,
                  }}
                >
                  + Add recollection
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${RULE}`, padding: '20px 32px', textAlign: 'center', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.4 }}>
        Aladdin Studio Tiffin Room · San Francisco · 1921–1929
      </footer>
    </main>
  )
}
