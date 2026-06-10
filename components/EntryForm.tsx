'use client'

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react'
import type { Mood, Entry } from '@/lib/types'
import { MoodSelector } from './MoodSelector'
import { TagInput } from './TagInput'
import { Mic, MicOff, Loader2, X } from 'lucide-react'
import { useVoiceRecorder } from '@/lib/useVoiceRecorder'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface FormData {
  title: string
  content: string
  mood: Mood | null
  tags: string[]
  image_url?: string | null
}

interface Props {
  heading: string
  initial?: Partial<Entry>
  onSave: (data: FormData) => void | Promise<void>
  onCancel: () => void
  autoSave?: boolean
  focusTitle?: boolean
}

export function EntryForm({ heading, initial, onSave, onCancel, autoSave, focusTitle }: Props) {
  const { user } = useAuth()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [mood, setMood] = useState<Mood | null>(initial?.mood ?? null)
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.image_url ?? null)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSavingRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!autoSave || !title.trim()) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(async () => {
      if (isSavingRef.current) return
      isSavingRef.current = true
      await onSave({ title, content, mood, tags, image_url: imageUrl })
      isSavingRef.current = false
    }, 600)
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, mood, tags, imageUrl, autoSave])

  const { state: recorderState, error: recorderError, start, stop, reset } = useVoiceRecorder(
    (text) => setContent(prev => prev ? prev + ' ' + text : text)
  )

  async function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 10 * 1024 * 1024) return

    setImageUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('entry-images')
      .upload(path, file, { upsert: false })

    if (!error) {
      const { data: { publicUrl } } = supabase.storage
        .from('entry-images')
        .getPublicUrl(path)
      setImageUrl(publicUrl)
      setImagePath(path)
    }
    setImageUploading(false)
    e.target.value = ''
  }

  async function handleImageRemove() {
    const pathToDelete = imagePath ?? imageUrl?.split('/entry-images/')[1] ?? null
    if (pathToDelete) {
      await supabase.storage.from('entry-images').remove([pathToDelete])
    }
    setImageUrl(null)
    setImagePath(null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title, content, mood, tags, image_url: imageUrl })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-8 pb-10">
      {/* Nawigacja — tylko na mobile lub gdy nie autoSave */}
      {!autoSave && (
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="default"
            onClick={onCancel}
            className="lg:hidden"
          >
            <ChevronLeftIcon className="size-4" />
            Wstecz
          </Button>
          <div className="hidden lg:block" />
          <h1 className="text-base font-bold text-foreground">{heading}</h1>
          <Button type="submit" variant="default" size="default">
            Zapisz
          </Button>
        </div>
      )}

      {/* Tytuł */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Tytuł wpisu..."
        autoFocus={focusTitle}
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
          className="w-full bg-foreground/5 rounded-2xl p-4 pr-24 text-foreground placeholder:text-muted outline-none resize-none text-base leading-relaxed"
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

        {/* Przycisk dodawania zdjęcia */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={imageUploading || !!imageUrl}
          title="Dodaj zdjęcie"
          className="absolute bottom-3 right-12"
        >
          {imageUploading
            ? <Loader2 size={18} className="animate-spin" />
            : <PhotoIcon className="size-[18px]" />
          }
        </Button>

        {/* Przycisk mikrofonu */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
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
          className={cn(
            'absolute bottom-3 right-3',
            recorderState === 'recording' && 'text-red-500 bg-red-500/15 scale-110',
            recorderState === 'error' && 'text-red-400 bg-red-500/10',
          )}
        >
          {recorderState === 'transcribing' ? (
            <Loader2 size={18} className="animate-spin" />
          ) : recorderState === 'recording' ? (
            <MicOff size={18} />
          ) : (
            <Mic size={18} />
          )}
        </Button>
      </div>

      {/* Podgląd zdjęcia */}
      {imageUrl && (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Zdjęcie do wpisu"
            className="w-full max-h-64 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleImageRemove}
            className="absolute top-2 right-2 p-1 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />
    </form>
  )
}
