import { getGuests } from '@/lib/guests'
import GuestbookScroll from './GuestbookScroll'

export default async function GuestbookPage() {
  const guests = await getGuests()

  const pageMap: Record<number, { id: string; name: string; knownFor: string; guestbookCoords: { x: number; y: number } }[]> = {}
  for (const g of guests) {
    if (!pageMap[g.guestbookPage]) pageMap[g.guestbookPage] = []
    pageMap[g.guestbookPage].push({
      id: g.id,
      name: g.name,
      knownFor: g.knownFor,
      guestbookCoords: g.guestbookCoords ?? { x: 0.5, y: 0.5 },
    })
  }

  return <GuestbookScroll pageMap={pageMap} />
}
