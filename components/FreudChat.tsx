'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { useEntries } from '@/lib/entries-context'
import { useConversations } from '@/lib/conversations-context'
import type { Entry } from '@/lib/types'
import type { Message as DBMessage } from '@/lib/conversations-context'
import { PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import ReactMarkdown from 'react-markdown'

interface Props {
  conversationId: string
  activeEntry?: Entry | null
  onTitleGenerated?: (title: string) => void
}

export function FreudChat({ conversationId, activeEntry, onTitleGenerated }: Props) {
  const { entries } = useEntries()
  const { getMessages, saveMessage } = useConversations()
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [initialMessages, setInitialMessages] = useState<DBMessage[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const titleSavedRef = useRef(false)

  useEffect(() => {
    getMessages(conversationId).then(msgs => {
      setInitialMessages(msgs)
      setHistoryLoaded(true)
    })
  }, [conversationId, getMessages])

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    initialMessages: initialMessages.map(m => ({ id: m.id, role: m.role, content: m.content })),
    body: {
      entries,
      activeEntry: activeEntry ?? null,
      userId: entries[0]?.user_id ?? null,
    },
    onFinish: async (message) => {
      const userMessages = messages.filter(m => m.role === 'user')
      if (userMessages.length > 0) {
        await saveMessage(conversationId, 'user', userMessages[userMessages.length - 1].content)
      }
      await saveMessage(conversationId, 'assistant', message.content)

      if (!titleSavedRef.current && onTitleGenerated) {
        const firstUserMsg = messages.find(m => m.role === 'user')?.content
        if (firstUserMsg) {
          const title = firstUserMsg.slice(0, 50) + (firstUserMsg.length > 50 ? '…' : '')
          titleSavedRef.current = true
          onTitleGenerated(title)
        }
      }
    },
  })

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Proaktywne powitanie gdy nowa rozmowa (brak historii)
  useEffect(() => {
    if (!historyLoaded || initialMessages.length > 0) return
    append({
      role: 'user',
      content: '__init__',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyLoaded])

  if (!historyLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <ArrowPathIcon className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const visibleMessages = messages.filter(m => m.content !== '__init__')

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {visibleMessages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-muted-foreground">
            <span className="text-5xl">🧠</span>
            <p className="font-semibold text-foreground">Cześć, jestem Freud</p>
            <p className="text-sm max-w-xs">Twój asystent terapeutyczny. Napisz coś, a przeanalizuję Twoje wpisy i porozmawiam z Tobą o tym, co czujesz.</p>
          </div>
        )}
        {visibleMessages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <span className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-base shrink-0 mr-2 mt-1">🧠</span>
            )}
            <div className={`max-w-[80%] px-4 py-3 rounded-3xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-foreground text-background rounded-br-sm whitespace-pre-wrap'
                : 'bg-surface text-surface-foreground rounded-bl-sm prose prose-sm prose-invert max-w-none'
            }`}>
              {m.role === 'user' ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <span className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-base shrink-0 mr-2">🧠</span>
            <div className="bg-surface text-surface-foreground px-4 py-3 rounded-3xl rounded-bl-sm text-sm">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 border-t border-foreground/10 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
            }
          }}
          placeholder="Napisz do Freuda…"
          rows={1}
          className="flex-1 bg-surface text-surface-foreground placeholder:text-surface-foreground/40 rounded-2xl px-4 py-3 text-sm resize-none outline-none focus:ring-2 ring-foreground/20 max-h-32"
          style={{ fieldSizing: 'content' } as React.CSSProperties}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-30 shrink-0"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
