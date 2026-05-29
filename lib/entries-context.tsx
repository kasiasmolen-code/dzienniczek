'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Entry, Mood } from './types'
import { mockEntries } from './mock-data'

interface EntryData {
  title: string
  content: string
  mood: Mood
  tags: string[]
}

interface EntriesContextType {
  entries: Entry[]
  addEntry: (data: EntryData) => string
  updateEntry: (id: string, data: EntryData) => void
  deleteEntry: (id: string) => void
  getEntry: (id: string) => Entry | undefined
}

const EntriesContext = createContext<EntriesContextType | null>(null)

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(mockEntries)

  function addEntry(data: EntryData): string {
    const id = Date.now().toString()
    const now = new Date().toISOString()
    setEntries(prev => [{ ...data, id, createdAt: now, updatedAt: now }, ...prev])
    return id
  }

  function updateEntry(id: string, data: EntryData) {
    setEntries(prev =>
      prev.map(e => e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e)
    )
  }

  function deleteEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function getEntry(id: string) {
    return entries.find(e => e.id === id)
  }

  return (
    <EntriesContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry, getEntry }}>
      {children}
    </EntriesContext.Provider>
  )
}

export function useEntries() {
  const ctx = useContext(EntriesContext)
  if (!ctx) throw new Error('useEntries must be inside EntriesProvider')
  return ctx
}
