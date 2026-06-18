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
}

const DATA_PATH = path.join(process.cwd(), 'data', 'guests.json')

export async function getGuests(): Promise<Guest[]> {
  const raw = await fs.readFile(DATA_PATH, 'utf-8')
  return JSON.parse(raw)
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
  await fs.writeFile(DATA_PATH, JSON.stringify(guests, null, 2))
  return true
}

export async function updateGuestCoords(id: string, coords: { x: number; y: number }): Promise<boolean> {
  const guests = await getGuests()
  const idx = guests.findIndex((g) => g.id === id)
  if (idx === -1) return false
  guests[idx].guestbookCoords = coords
  await fs.writeFile(DATA_PATH, JSON.stringify(guests, null, 2))
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
  // ensure unique id
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
  }
  guests.push(guest)
  await fs.writeFile(DATA_PATH, JSON.stringify(guests, null, 2))
  return guest
}
