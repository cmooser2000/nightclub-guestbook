import { getGuests } from '@/lib/guests'
import GuestbookScroll from './GuestbookScroll'

export default async function Home() {
  const guests = await getGuests()

  const pageMap: Record<number, { id: string; name: string; knownFor: string }[]> = {}
  for (const g of guests) {
    if (!pageMap[g.guestbookPage]) pageMap[g.guestbookPage] = []
    pageMap[g.guestbookPage].push({ id: g.id, name: g.name, knownFor: g.knownFor })
  }

  return <GuestbookScroll pageMap={pageMap} />
}
