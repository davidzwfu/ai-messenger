import { useAtom, useSetAtom } from 'jotai'
import { conversationsAtom, incomingMessagesAtom } from '@/app/_libs/atoms'

export function useMessages(id: string) {
  const [conversations, setConversations] = useAtom(conversationsAtom)
  const { isTyping, messages } = conversations[id]
  const setIncomingMessages = useSetAtom(incomingMessagesAtom)

  async function sendMessage(message: string, userId: string) {
    const newMessages = [
      ...messages,
      {
        self: true,
        content: message,
        sentAt: Date.now(),
      }
    ]
    const messageIndex = messages.length
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
    const { text, reaction } = JSON.parse(data.message.content)
    if (reaction) {
      setConversations(prev => {
        const newState = { ...prev }
        newState[id].messages[messageIndex].reaction = reaction
        return newState
      })
    }
    setIncomingMessages(prev => {
      const newState = [...prev]
      newState.push({
        userId,
        content: text,
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

  function deleteConversation() {
    setConversations(prev => {
      const newState = { ...prev }
      delete newState[id]
      return newState
    })
  }

  return {
    isTyping,
    messages,
    sendMessage,
    markAsRead,
    clearMessages,
    deleteConversation,
  }
}
