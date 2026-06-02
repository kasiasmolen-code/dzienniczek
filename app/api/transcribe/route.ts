export async function POST(req: Request) {
  const formData = await req.formData()
  const audio = formData.get('audio') as File | null

  if (!audio) {
    return Response.json({ error: 'Brak pliku audio' }, { status: 400 })
  }

  const groqForm = new FormData()
  groqForm.append('file', audio, 'recording.webm')
  groqForm.append('model', 'whisper-large-v3-turbo')
  groqForm.append('language', 'pl')

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: groqForm,
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Groq API error:', err)
    return Response.json({ error: 'Błąd transkrypcji' }, { status: 500 })
  }

  const data = await res.json()
  return Response.json({ text: data.text })
}
