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
