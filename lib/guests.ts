import { kv } from '@vercel/kv'
import { promises as fs } from 'fs'
import path from 'path'

export interface Guest {
  id: string
  name: string
  nameVariants: string[]
  era: string
  category: string
  knownFor: string
  quickFacts: string[]
  imageUrl: string
  imageCredit: string
  wikiUrl: string
  guestbookPage: number
  guestbookCoords: { x: number; y: number }
  dadStory: string
  dadStoryUpdated: string | null
  signingDate: string | null
  additionalImages: { url: string; caption: string }[]
}

const KV_KEY = 'guests'
const DATA_PATH = path.join(process.cwd(), 'data', 'guests.json')

export async function getGuests(): Promise<Guest[]> {
  const cached = await kv.get<Guest[]>(KV_KEY)
  if (cached && cached.length > 0) return cached
  // First run: seed KV from the JSON file
  const raw = await fs.readFile(DATA_PATH, 'utf-8')
  const guests: Guest[] = JSON.parse(raw)
  await kv.set(KV_KEY, guests)
  return guests
}

async function saveGuests(guests: Guest[]): Promise<void> {
  await kv.set(KV_KEY, guests)
}

export async function getGuest(id: string): Promise<Guest | null> {
  const guests = await getGuests()
  return guests.find((g) => g.id === id) ?? null
}

export async function updateGuestStory(id: string, story: string): Promise<boolean> {
  const guests = await getGuests()
  const idx = guests.findIndex((g) => g.id === id)
  if (idx === -1) return false
  guests[idx].dadStory = story
  guests[idx].dadStoryUpdated = new Date().toISOString()
  await saveGuests(guests)
  return true
}

export async function updateGuestImage(id: string, imageUrl: string): Promise<boolean> {
  const guests = await getGuests()
  const idx = guests.findIndex((g) => g.id === id)
  if (idx === -1) return false
  guests[idx].imageUrl = imageUrl
  await saveGuests(guests)
  return true
}

export async function updateGuestVariants(id: string, nameVariants: string[]): Promise<boolean> {
  const guests = await getGuests()
  const idx = guests.findIndex((g) => g.id === id)
  if (idx === -1) return false
  guests[idx].nameVariants = nameVariants
  await saveGuests(guests)
  return true
}

export async function updateGuestAdditionalImages(id: string, additionalImages: { url: string; caption: string }[]): Promise<boolean> {
  const guests = await getGuests()
  const idx = guests.findIndex((g) => g.id === id)
  if (idx === -1) return false
  guests[idx].additionalImages = additionalImages
  await saveGuests(guests)
  return true
}

export async function updateGuestSigningDate(id: string, signingDate: string | null): Promise<boolean> {
  const guests = await getGuests()
  const idx = guests.findIndex((g) => g.id === id)
  if (idx === -1) return false
  guests[idx].signingDate = signingDate
  await saveGuests(guests)
  return true
}

export async function updateGuestCoords(id: string, coords: { x: number; y: number }): Promise<boolean> {
  const guests = await getGuests()
  const idx = guests.findIndex((g) => g.id === id)
  if (idx === -1) return false
  guests[idx].guestbookCoords = coords
  await saveGuests(guests)
  return true
}

export async function createGuest(fields: {
  name: string
  guestbookPage: number
  location?: string
  category?: string
  knownFor?: string
}): Promise<Guest> {
  const guests = await getGuests()
  const slug = fields.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  let id = slug
  let n = 2
  while (guests.find((g) => g.id === id)) {
    id = `${slug}-${n++}`
  }
  const guest: Guest = {
    id,
    name: fields.name,
    nameVariants: [],
    era: '1920s',
    category: fields.category ?? 'Guest',
    knownFor: fields.knownFor ?? `Signed the Aladdin guestbook on page ${fields.guestbookPage}.`,
    quickFacts: fields.location ? [`From ${fields.location}`] : [],
    imageUrl: '',
    imageCredit: '',
    wikiUrl: '',
    guestbookPage: fields.guestbookPage,
    guestbookCoords: { x: 0.5, y: 0.5 },
    dadStory: '',
    dadStoryUpdated: null,
    signingDate: null,
    additionalImages: [],
  }
  guests.push(guest)
  await saveGuests(guests)
  return guest
}
