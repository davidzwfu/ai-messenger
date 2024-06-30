import { useAtom } from 'jotai'
import { conversationsAtom } from '@/app/_libs/atoms'
import { usersData } from '@/app/_data/users'

export function useMessages(id: number) {
  const [conversations, setConversations] = useAtom(conversationsAtom)
  const { messages, isTyping } = conversations[id]

  function receiveMessage(newMessage: any) {
    updateConversation({ isTyping: true })

    const typingSeconds = newMessage.content.length / 30
    console.log(typingSeconds)
    setTimeout(() => {
      updateConversation({
        isTyping: false,
        messages: newMessage,
      })
    }, typingSeconds * 1000)
  }

  async function sendMessage(message: string, userId: number) {
    const newMessage = {
      self: true,
      content: message,
      sentAt: Date.now(),
    }
    updateConversation({ messages: newMessage })
    const res = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        conversation: [
          ...messages,
          newMessage,
        ],
      })
    })
    const data = await res.json()
    console.log(data)
    receiveMessage({
      self: false,
      content: data.message.content,
      sentAt: Date.now(),
    })
  }

  function markAsRead() {
    updateConversation({ unreadCount: 0 })
  }

  function updateConversation(params: any) {
    setConversations(prev => {
      const newConversation = {...prev[id]}
      for (const key in params) {
        if (Array.isArray(newConversation[key]))
          newConversation[key] = [...newConversation[key], params[key]]
        else
          newConversation[key] = params[key]
      }
      return {
        ...prev,
        [id]: newConversation
      }
    })
  }

  function clearMessages() {
    setConversations({
      ...conversations,
      [id]: {
        unreadCount: 0,
        isTyping: false,
        messages: [],
      }
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
