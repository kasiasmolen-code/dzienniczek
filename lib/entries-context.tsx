'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Entry, Mood } from './types'
import { supabase } from './supabase'
import { useAuth } from './auth-context'

interface EntryData {
  title: string
  content: string
  mood: Mood | null
  tags: string[]
}

interface EntriesContextType {
  entries: Entry[]
  loading: boolean
  addEntry: (data: EntryData) => Promise<string>
  updateEntry: (id: string, data: EntryData) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  getEntry: (id: string) => Entry | undefined
}

const EntriesContext = createContext<EntriesContextType | null>(null)

export function EntriesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setEntries([])
      return
    }
    setLoading(true)
    supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setEntries(data ?? [])
        setLoading(false)
      })
  }, [user])

  async function addEntry(data: EntryData): Promise<string> {
    const { data: inserted } = await supabase
      .from('entries')
      .insert({ ...data, user_id: user!.id })
      .select()
      .single()
    setEntries(prev => [inserted, ...prev])
    return inserted.id
  }

  async function updateEntry(id: string, data: EntryData) {
    const { data: updated } = await supabase
      .from('entries')
      .update(data)
      .eq('id', id)
      .eq('user_id', user!.id)
      .select()
      .single()
    setEntries(prev => prev.map(e => e.id === id ? updated : e))
  }

  async function deleteEntry(id: string) {
    await supabase.from('entries').delete().eq('id', id).eq('user_id', user!.id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function getEntry(id: string) {
    return entries.find(e => e.id === id)
  }

  return (
    <EntriesContext.Provider value={{ entries, loading, addEntry, updateEntry, deleteEntry, getEntry }}>
      {children}
    </EntriesContext.Provider>
  )
}

export function useEntries() {
  const ctx = useContext(EntriesContext)
  if (!ctx) throw new Error('useEntries must be inside EntriesProvider')
  return ctx
}
