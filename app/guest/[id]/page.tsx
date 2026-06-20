import { getGuest, getGuests } from '@/lib/guests'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const PAGE_BG = '#0d0b08'
const CREAM = '#f0deb8'
const GOLD = '#c8a050'
const FUCHSIA = '#c0405a'
const RULE = '#2a1e10'
const RULE_LIGHT = 'rgba(240,222,184,0.18)'

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
    <main style={{ background: PAGE_BG, color: CREAM, minHeight: '100vh' }}>
      <style>{`
        @font-face {
          font-family: 'Hipstravaganza';
          src: url('/fonts/hipstravaganza.ttf') format('truetype');
          font-display: block;
        }
        @font-face {
          font-family: 'LinLibertine';
          src: url('/fonts/linlibertine.ttf') format('truetype');
          font-display: block;
        }
        .profile-body {
          font-family: 'LinLibertine', 'Palatino Linotype', Palatino, serif;
        }
      `}</style>

      {/* Nav strip */}
      <div style={{ borderBottom: `1px solid ${RULE_LIGHT}`, padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          href={`/#page-${guest.guestbookPage}`}
          style={{ color: GOLD, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'LinLibertine, serif' }}
        >
          ← Back to Guestbook
        </Link>
        <Link
          href="/"
          style={{ color: GOLD, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', opacity: 0.6, fontFamily: 'LinLibertine, serif' }}
        >
          The Aladdin
        </Link>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 32px 80px' }}>

        {/* Header box */}
        <div style={{
          border: `2px solid ${RULE_LIGHT}`,
          padding: '36px 40px 32px',
          marginBottom: 44,
          textAlign: 'center',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <p style={{
            fontFamily: 'LinLibertine, serif',
            fontSize: '0.7rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: 18,
            color: GOLD,
          }}>
            {guest.category}{guest.era ? ` · ${guest.era}` : ''}
          </p>
          <h1 style={{
            fontFamily: 'Hipstravaganza, serif',
            fontSize: 'clamp(2.4rem, 7vw, 4.5rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            margin: '0 0 24px',
            letterSpacing: '0.01em',
            color: CREAM,
          }}>
            {guest.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
            <div style={{ flex: 1, height: 1, background: RULE_LIGHT }} />
            <span style={{ fontSize: '0.9rem', color: FUCHSIA }}>✦</span>
            <div style={{ flex: 1, height: 1, background: RULE_LIGHT }} />
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
                  style={{ width: '100%', display: 'block', border: `1px solid ${RULE_LIGHT}`, filter: 'sepia(8%)' }}
                />
                {guest.imageCredit && (
                  <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.7rem', marginTop: 6, textAlign: 'center', opacity: 0.45, fontStyle: 'italic', color: CREAM }}>
                    {guest.imageCredit}
                  </p>
                )}
              </div>
            )}

            {/* Guestbook page */}
            <div>
              <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 10, color: GOLD }}>
                Signed on page {guest.guestbookPage}
              </p>
              <img
                src={guestbookPageImg}
                alt={`Guestbook page ${guest.guestbookPage}`}
                style={{ width: '100%', display: 'block', border: `1px solid ${RULE_LIGHT}`, filter: 'sepia(5%)' }}
              />
            </div>

          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

            <p style={{
              fontFamily: 'LinLibertine, serif',
              fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
              fontStyle: 'italic',
              lineHeight: 1.75,
              borderLeft: `3px solid ${FUCHSIA}`,
              paddingLeft: 20,
              margin: 0,
              color: CREAM,
            }}>
              {guest.knownFor}
            </p>

            {guest.quickFacts.length > 0 && (
              <div>
                <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 14, borderBottom: `1px solid ${RULE_LIGHT}`, paddingBottom: 8, color: GOLD }}>
                  Quick Facts
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {guest.quickFacts.map((fact, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, fontFamily: 'LinLibertine, serif', fontSize: '1rem', lineHeight: 1.65, color: CREAM }}>
                      <span style={{ color: FUCHSIA, flexShrink: 0 }}>✦</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dad's story */}
            <div style={{ borderTop: `1px solid ${RULE_LIGHT}`, paddingTop: 28 }}>
              <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, color: GOLD }}>
                A Personal Recollection
              </p>
              {guest.dadStory ? (
                <>
                  <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.85, margin: 0, color: CREAM }}>
                    {guest.dadStory}
                  </p>
                  {guest.dadStoryUpdated && (
                    <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.7rem', marginTop: 16, opacity: 0.4, fontStyle: 'italic', color: CREAM }}>
                      Last updated {new Date(guest.dadStoryUpdated).toLocaleDateString()}
                    </p>
                  )}
                </>
              ) : (
                <Link
                  href={`/admin-guestbook?guest=${guest.id}`}
                  style={{
                    display: 'inline-block',
                    fontFamily: 'LinLibertine, serif',
                    fontSize: '0.72rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: GOLD,
                    textDecoration: 'none',
                    border: `1px solid rgba(200,160,80,0.35)`,
                    padding: '8px 18px',
                    opacity: 0.7,
                  }}
                >
                  + Add recollection
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${RULE_LIGHT}`, padding: '20px 32px', textAlign: 'center', fontFamily: 'LinLibertine, serif', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.35, color: CREAM }}>
        Aladdin Studio Tiffin Room · San Francisco · 1921–1929
      </footer>
    </main>
  )
}
