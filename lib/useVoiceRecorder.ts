'use client'

import { useState, useRef } from 'react'
import { supabase } from './supabase'

export type RecorderState = 'idle' | 'recording' | 'transcribing' | 'error'

function getSupportedMimeType(): string {
  const types = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav']
  for (const type of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
      return type
    }
  }
  return ''
}

function getExtension(mimeType: string): string {
  if (mimeType.includes('mp4')) return 'mp4'
  if (mimeType.includes('ogg')) return 'ogg'
  if (mimeType.includes('wav')) return 'wav'
  return 'webm'
}

export function useVoiceRecorder(onTranscript: (text: string) => void) {
  const [state, setState] = useState<RecorderState>('idle')
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const mimeTypeRef = useRef<string>('')

  async function start() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = getSupportedMimeType()
      mimeTypeRef.current = mimeType

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const mime = mimeTypeRef.current || 'audio/webm'
        const ext = getExtension(mime)
        const blob = new Blob(chunksRef.current, { type: mime })
        setState('transcribing')

        try {
          const form = new FormData()
          form.append('audio', blob, `recording.${ext}`)
          const token = (await supabase.auth.getSession()).data.session?.access_token
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: form,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          })
          const data = await res.json()

          if (!res.ok || data.error) {
            throw new Error(data.error ?? 'Błąd transkrypcji')
          }

          onTranscript(data.text)
          setState('idle')
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Błąd transkrypcji')
          setState('error')
        }
      }

      mediaRecorder.start(250) // zbieraj dane co 250ms
      setState('recording')
    } catch {
      setError('Brak dostępu do mikrofonu')
      setState('error')
    }
  }

  function stop() {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state === 'recording') {
      recorder.stop()
    }
  }

  function reset() {
    setState('idle')
    setError(null)
  }

  return { state, error, start, stop, reset }
}
