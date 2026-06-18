import { createGuest, getGuests } from '@/lib/guests'

export async function GET() {
  const guests = await getGuests()
  return Response.json(guests)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, guestbookPage, location, category, knownFor } = body
  if (!name || !guestbookPage) {
    return Response.json({ error: 'name and guestbookPage are required' }, { status: 400 })
  }
  const guest = await createGuest({ name, guestbookPage: Number(guestbookPage), location, category, knownFor })
  return Response.json(guest, { status: 201 })
}
