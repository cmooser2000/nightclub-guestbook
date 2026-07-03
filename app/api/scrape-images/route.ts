export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) return Response.json({ error: 'Missing url' }, { status: 400 })

  let html: string
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GuestbookBot/1.0)' },
    })
    if (!res.ok) return Response.json({ error: `Fetch failed: ${res.status}` }, { status: 502 })
    html = await res.text()
  } catch {
    return Response.json({ error: 'Could not reach that URL' }, { status: 502 })
  }

  // Extract src from <img> tags, resolve relative URLs
  const base = new URL(url)
  const srcRegex = /<img[^>]+src=["']([^"']+)["']/gi
  const seen = new Set<string>()
  const images: string[] = []
  let match: RegExpExecArray | null
  while ((match = srcRegex.exec(html)) !== null) {
    try {
      const abs = new URL(match[1], base).href
      if (!seen.has(abs)) {
        seen.add(abs)
        images.push(abs)
      }
    } catch {
      // skip malformed URLs
    }
  }

  // Also grab srcset entries
  const srcsetRegex = /srcset=["']([^"']+)["']/gi
  while ((match = srcsetRegex.exec(html)) !== null) {
    for (const part of match[1].split(',')) {
      const src = part.trim().split(/\s+/)[0]
      try {
        const abs = new URL(src, base).href
        if (!seen.has(abs)) {
          seen.add(abs)
          images.push(abs)
        }
      } catch {
        // skip
      }
    }
  }

  return Response.json({ images })
}
