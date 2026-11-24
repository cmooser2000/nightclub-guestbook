import type { Metadata } from 'next'
import { getGuests } from '@/lib/guests'
import visitDates from '@/data/visit-dates.json'
import FlipBook, { type BookGuest } from './FlipBook'

// Dates read off the guestbook pages themselves, keyed by guest id.
// Pages with no written date are left out, so some guests have no years.
const VISITS = visitDates as Record<string, { page: number; date: string; year: number }[]>

function visitYears(id: string): number[] {
  return Array.from(new Set((VISITS[id] ?? []).map((v) => v.year))).sort((a, b) => a - b)
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Oh, What a Time We Had — The Aladdin Book',
  description:
    'Vaudeville and the Early Days of Film Through the Aladdin Tiffin Room in San Francisco',
}

// Only finished stories go in the book. Rough notes (short, mostly ALL CAPS,
// or containing an ALL-CAPS aside) stay on the website until written up.
function isFinishedStory(story: string): boolean {
  const words = story.trim().split(/\s+/).filter(Boolean).length
  if (words < 60) return false
  if (/\b[A-Z]{2,}(?:[\s-]+[A-Z]{2,}){3,}\b/.test(story)) return false
  const letters = story.replace(/[^A-Za-z]/g, '')
  const upper = letters.replace(/[^A-Z]/g, '').length
  return upper / Math.max(1, letters.length) <= 0.5
}

export default async function BookPage() {
  const guests = await getGuests()
  const seen = new Set<string>()
  const bookGuests: BookGuest[] = []
  for (const g of guests) {
    if (seen.has(g.id)) continue
    const story = (g.dadStory ?? '').trim()
    if (!isFinishedStory(story)) continue
    seen.add(g.id)
    // Some people appear more than once (signed on more than one page).
    const pages = Array.from(
      new Set(guests.filter((x) => x.id === g.id).map((x) => x.guestbookPage))
    ).sort((a, b) => a - b)
    bookGuests.push({
      id: g.id,
      name: g.name,
      category: g.category,
      era: g.era,
      imageUrl: g.imageUrl,
      story,
      guestbookPages: pages,
      visitYears: visitYears(g.id),
    })
  }
  bookGuests.sort((a, b) => a.name.localeCompare(b.name))

  return <FlipBook guests={bookGuests} />
}
