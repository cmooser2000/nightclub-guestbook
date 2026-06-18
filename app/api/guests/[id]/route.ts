import { getGuest, updateGuestStory } from '@/lib/guests'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const guest = await getGuest(id)
  if (!guest) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(guest)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const ok = await updateGuestStory(id, body.dadStory ?? '')
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ success: true })
}
