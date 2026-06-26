const BASE = 'http://localhost:3000/api/lyrics'

export async function searchLyrics(query) {
  const params = new URLSearchParams(query)
  const res = await fetch(`${BASE}/search?${params}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function getLyrics({ trackName, artistName, albumName, duration }) {
  const params = new URLSearchParams({
    track_name: trackName,
    artist_name: artistName,
    ...(albumName && { album_name: albumName }),
    ...(duration && { duration }),
  })
  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) throw new Error('Lyrics fetch failed')
  return res.json()
}
