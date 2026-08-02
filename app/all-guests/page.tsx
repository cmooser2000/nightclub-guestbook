import { getGuests } from '@/lib/guests'
import AllGuestsClient from './AllGuestsClient'

export const dynamic = 'force-dynamic'

export default async function AllGuestsPage() {
  const guests = await getGuests()
  return <AllGuestsClient guests={guests} />
}
