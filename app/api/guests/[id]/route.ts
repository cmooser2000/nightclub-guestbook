import { getGuest, updateGuestStory, updateGuestCoords, updateGuestImage, updateGuestVariants, updateGuestAdditionalImages, updateGuestSigningDate, updateGuestReferences, updateGuestTags } from '@/lib/guests'

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
  if (body.guestbookCoords !== undefined) {
    const ok = await updateGuestCoords(id, body.guestbookCoords)
    if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ success: true })
  }
  if (body.imageUrl !== undefined) {
    const ok = await updateGuestImage(id, body.imageUrl)
    if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ success: true })
  }
  if (body.nameVariants !== undefined) {
    const ok = await updateGuestVariants(id, body.nameVariants)
    if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ success: true })
  }
  if (body.additionalImages !== undefined) {
    const ok = await updateGuestAdditionalImages(id, body.additionalImages)
    if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ success: true })
  }
  if (body.tags !== undefined) {
    const ok = await updateGuestTags(id, body.tags)
    if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ success: true })
  }
  if (body.references !== undefined) {
    const ok = await updateGuestReferences(id, body.references)
    if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ success: true })
  }
  if (body.signingDate !== undefined) {
    const ok = await updateGuestSigningDate(id, body.signingDate)
    if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ success: true })
  }
  const ok = await updateGuestStory(id, body.dadStory ?? '')
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ success: true })
}
