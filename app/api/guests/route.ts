import { getGuests } from '@/lib/guests'

export async function GET() {
  const guests = await getGuests()
  return Response.json(guests)
}
