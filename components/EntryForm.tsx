'use client'

import { useState, type FormEvent } from 'react'
import type { Mood, Entry } from '@/lib/types'
import { MoodSelector } from './MoodSelector'
import { TagInput } from './TagInput'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { useVoiceRecorder } from '@/lib/useVoiceRecorder'

interface FormData {
  title: string
  content: string
  mood: Mood | null
  tags: string[]
}

interface Props {
  heading: string
  initial?: Partial<Entry>
  onSave: (data: FormData) => void
  onCancel: () => void
}

export function EntryForm({ heading, initial, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [mood, setMood] = useState<Mood | null>(initial?.mood ?? null)
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])

  const { state: recorderState, error: recorderError, start, stop, reset } = useVoiceRecorder(
    (text) => setContent(prev => prev ? prev + ' ' + text : text)
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title, content, mood, tags })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-8 pb-10">
      {/* Nawigacja */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="text-muted hover:text-foreground transition-colors text-sm px-2 py-1 -ml-2"
        >
          ← Wróć
        </button>
        <h1 className="text-base font-bold text-foreground">{heading}</h1>
        <button
          type="submit"
          className="bg-foreground text-background px-5 py-2 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          Zapisz
        </button>
      </div>

      {/* Tytuł */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Tytuł wpisu..."
        required
        className="text-2xl font-bold bg-transparent text-foreground placeholder:text-muted outline-none border-b border-foreground/10 pb-3"
      />

      {/* Nastrój */}
      <div>
        <p className="text-sm text-muted mb-3">Jak się czujesz?</p>
        <MoodSelector value={mood} onChange={setMood} />
      </div>

      {/* Treść */}
      <div className="relative">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Co chcesz zapisać dzisiaj..."
          rows={8}
          className="w-full bg-foreground/5 rounded-2xl p-4 pr-14 text-foreground placeholder:text-muted outline-none resize-none text-base leading-relaxed"
        />

        {/* Pasek fal dźwiękowych podczas nagrywania */}
        {recorderState === 'recording' && (
          <div className="absolute bottom-14 right-2 flex items-end gap-[3px] h-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-red-500"
                style={{
                  animation: `soundwave 0.8s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.12}s`,
                  height: '100%',
                }}
              />
            ))}
          </div>
        )}

        {/* Pasek przetwarzania transkrypcji */}
        {recorderState === 'transcribing' && (
          <div className="absolute bottom-14 right-2 flex items-center gap-1.5">
            <span className="text-[11px] text-muted">Przetwarzam...</span>
            <div className="flex gap-[3px] items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-foreground/40"
                  style={{
                    animation: 'dotpulse 1s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            if (recorderState === 'idle' || recorderState === 'error') {
              reset()
              start()
            } else if (recorderState === 'recording') {
              stop()
            }
          }}
          disabled={recorderState === 'transcribing'}
          title={
            recorderState === 'recording' ? 'Zatrzymaj nagrywanie' :
            recorderState === 'transcribing' ? 'Trwa transkrypcja...' :
            recorderState === 'error' ? (recorderError ?? 'Błąd — kliknij by spróbować ponownie') :
            'Nagraj głosowo'
          }
          className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
            recorderState === 'recording'
              ? 'text-red-500 bg-red-500/15 scale-110'
              : recorderState === 'transcribing'
              ? 'text-muted cursor-not-allowed'
              : recorderState === 'error'
              ? 'text-red-400 bg-red-500/10'
              : 'text-muted hover:text-foreground hover:bg-foreground/10'
          }`}
        >
          {recorderState === 'transcribing' ? (
            <Loader2 size={18} className="animate-spin" />
          ) : recorderState === 'recording' ? (
            <MicOff size={18} />
          ) : (
            <Mic size={18} />
          )}
        </button>
      </div>

      <style>{`
        @keyframes soundwave {
          from { transform: scaleY(0.2); opacity: 0.6; }
          to   { transform: scaleY(1);   opacity: 1; }
        }
        @keyframes dotpulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>

      {/* Tagi */}
      <div>
        <p className="text-sm text-muted mb-2">Tagi</p>
        <TagInput value={tags} onChange={setTags} />
      </div>
    </form>
  )
}
