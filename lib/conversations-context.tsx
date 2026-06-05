'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth-context'

export interface Conversation {
  id: string
  user_id: string
  title: string | null
  entry_id: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface ConversationsContextType {
  conversations: Conversation[]
  loading: boolean
  createConversation: (entryId?: string | null) => Promise<string>
  deleteConversation: (id: string) => Promise<void>
  updateConversationTitle: (id: string, title: string) => Promise<void>
  getMessages: (conversationId: string) => Promise<Message[]>
  saveMessage: (conversationId: string, role: 'user' | 'assistant', content: string) => Promise<void>
}

const ConversationsContext = createContext<ConversationsContextType | null>(null)

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) { setConversations([]); return }
    setLoading(true)
    supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setConversations(data ?? [])
        setLoading(false)
      })
  }, [user])

  const createConversation = useCallback(async (entryId?: string | null): Promise<string> => {
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user!.id, entry_id: entryId ?? null })
      .select()
      .single()
    if (error) throw error
    setConversations(prev => [data, ...prev])
    return data.id
  }, [user])

  const deleteConversation = useCallback(async (id: string) => {
    await supabase.from('conversations').delete().eq('id', id)
    setConversations(prev => prev.filter(c => c.id !== id))
  }, [])

  const updateConversationTitle = useCallback(async (id: string, title: string) => {
    await supabase.from('conversations').update({ title, updated_at: new Date().toISOString() }).eq('id', id)
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title } : c))
  }, [])

  const getMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    return (data ?? []) as Message[]
  }, [])

  const saveMessage = useCallback(async (conversationId: string, role: 'user' | 'assistant', content: string) => {
    await supabase.from('messages').insert({ conversation_id: conversationId, role, content })
    await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId)
  }, [])

  return (
    <ConversationsContext.Provider value={{ conversations, loading, createConversation, deleteConversation, updateConversationTitle, getMessages, saveMessage }}>
      {children}
    </ConversationsContext.Provider>
  )
}

export function useConversations() {
  const ctx = useContext(ConversationsContext)
  if (!ctx) throw new Error('useConversations must be used within ConversationsProvider')
  return ctx
}
