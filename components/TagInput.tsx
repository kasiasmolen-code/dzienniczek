'use client'

import { useState, type KeyboardEvent } from 'react'

interface Props {
  value: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ value, onChange }: Props) {
  const [input, setInput] = useState('')

  function addTag() {
    const tag = input.trim().replace(/^#/, '').toLowerCase()
    if (tag && !value.includes(tag)) {
      onChange([...value, tag])
    }
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(value.filter(t => t !== tag))
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-foreground/5 rounded-2xl min-h-12 items-center">
      {value.map(tag => (
        <span
          key={tag}
          className="flex items-center gap-1 bg-foreground/15 text-foreground px-3 py-1 rounded-full text-sm"
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-muted hover:text-foreground ml-0.5 leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={addTag}
        placeholder={value.length === 0 ? 'Dodaj tag i naciśnij Enter' : ''}
        className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted flex-1 min-w-24"
      />
    </div>
  )
}
