import { getGuest, getGuests } from '@/lib/guests'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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
    <main className="min-h-screen py-16 px-6" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href={`/#page-${guest.guestbookPage}`}
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-12 transition-opacity opacity-50 hover:opacity-100"
          style={{ color: 'var(--gold)' }}
        >
          ← Back to the Guestbook
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: 'var(--gold)' }}>
            {guest.category} · {guest.era}
          </p>
          <h1
            className="text-5xl md:text-6xl mb-4 leading-tight"
            style={{
              color: 'var(--cream)',
              fontFamily: "'Palatino Linotype', Palatino, serif",
              fontStyle: 'italic',
            }}
          >
            {guest.name}
          </h1>
          <div className="art-deco-divider">
            <span style={{ color: 'var(--gold)' }}>✦</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="md:col-span-1 space-y-6">
            {/* Portrait — only if we have one */}
            {guest.imageUrl && (
              <div>
                <div className="rounded overflow-hidden border-2 shadow-2xl" style={{ borderColor: 'var(--gold)' }}>
                  <img
                    src={guest.imageUrl}
                    alt={guest.name}
                    className="w-full object-cover object-top"
                    style={{ maxHeight: '320px' }}
                  />
                </div>
                {guest.imageCredit && (
                  <p className="text-xs mt-2 text-center opacity-40" style={{ color: 'var(--parchment)' }}>
                    {guest.imageCredit}
                  </p>
                )}
              </div>
            )}

            {/* Guestbook page */}
            <div>
              <p className="text-xs tracking-widest uppercase mb-2 opacity-50" style={{ color: 'var(--gold)' }}>
                Signed on page {guest.guestbookPage}
              </p>
              <div className="rounded overflow-hidden border shadow-lg" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
                <img
                  src={guestbookPageImg}
                  alt={`Guestbook page ${guest.guestbookPage}`}
                  className="w-full block"
                />
              </div>
            </div>

            {guest.wikiUrl && (
              <a
                href={guest.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs tracking-widest uppercase border py-2 transition-all hover:bg-yellow-900/20"
                style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
              >
                Wikipedia →
              </a>
            )}
          </div>

          {/* Content */}
          <div className="md:col-span-2 space-y-8">
            <p className="text-lg italic leading-relaxed" style={{ color: 'var(--parchment)' }}>
              {guest.knownFor}
            </p>

            {guest.quickFacts.length > 0 && (
              <div>
                <h2 className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
                  Quick Facts
                </h2>
                <ul className="space-y-2">
                  {guest.quickFacts.map((fact, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--parchment)' }}>
                      <span style={{ color: 'var(--gold)' }}>✦</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div
              className="rounded p-6 border"
              style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.2)' }}
            >
              <h2 className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
                A Personal Recollection
              </h2>
              {guest.dadStory ? (
                <p className="text-base leading-relaxed italic" style={{ color: 'var(--cream)' }}>
                  {guest.dadStory}
                </p>
              ) : (
                <p className="text-sm italic opacity-40" style={{ color: 'var(--parchment)' }}>
                  A story is being written for this guest…
                </p>
              )}
              {guest.dadStoryUpdated && (
                <p className="text-xs mt-4 opacity-30" style={{ color: 'var(--parchment)' }}>
                  Last updated {new Date(guest.dadStoryUpdated).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
