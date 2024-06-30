import { useAtom, useSetAtom } from 'jotai'
import { conversationsAtom, incomingMessagesAtom } from '@/app/_libs/atoms'

export function useMessages(id: number) {
  const [conversations, setConversations] = useAtom(conversationsAtom)
  const { messages, isTyping } = conversations[id]
  const setIncomingMessages = useSetAtom(incomingMessagesAtom)

  async function sendMessage(message: string, userId: number) {
    const newMessages = [
      ...messages,
      {
        self: true,
        content: message,
        sentAt: Date.now(),
      }
    ]
    setConversations(prev => {
      const newState = { ...prev }
      newState[id].messages = newMessages
      return newState
    })

    const res = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        conversation: newMessages,
      })
    })
    const data = await res.json()
    setIncomingMessages(prev => {
      const newState = [...prev]
      newState.push({
        userId,
        content: data.message.content
      })
      return newState
    })
  }

  function markAsRead() {
    setConversations(prev => {
      const newState = { ...prev }
      newState[id].unreadCount = 0
      return newState
    })
  }

  function clearMessages() {
    setConversations(prev => {
      const newState = { ...prev }
      newState[id] = {
        unreadCount: 0,
        isTyping: false,
        messages: [],
      }
      return newState
    })
  }

  return {
    messages,
    sendMessage,
    clearMessages,
    markAsRead,
    isTyping,
  }
}
