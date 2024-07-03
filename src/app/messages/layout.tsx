'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { conversationsAtom, incomingMessagesAtom, windowWidthAtom } from '@/app/_libs/atoms'
import Sidebar from '@/app/_components/Sidebar'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [windowWidth, setWindowWidth] = useAtom(windowWidthAtom)
  const setConversations = useSetAtom(conversationsAtom)
  const [incomingMessages, setIncomingMessages] = useAtom(incomingMessagesAtom)
  const processingMessage = useRef<boolean>(false)

  useLayoutEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth))
  }, [])

  useEffect(() => {
    if (incomingMessages.length > 0 && !processingMessage.current)
      processMessage(incomingMessages.at(0))
  }, [incomingMessages])

  function processMessage(message: any) {
    processingMessage.current = true
    const { userId, content } = message
    setConversations(prev => {
      const newState = { ...prev }
      newState[userId].isTyping = true
      return newState
    })

    const typingSeconds = content.length / 30
    setTimeout(() => {
      setConversations(prev => {
        const newState = { ...prev }
        if (!pathname.endsWith(userId))
          newState[userId].unreadCount++
        newState[userId].isTyping = false
        newState[userId].messages.push({
          self: false,
          content,
          sentAt: Date.now(),
        })
        return newState
      })
      processingMessage.current = false
      setIncomingMessages(prev => prev.slice(1))
    }, typingSeconds * 1000)
  }

  return (
    <div className="container">
      {(pathname == '/messages' || windowWidth > 1024) &&
        <Sidebar />
      }
      {children}
    </div>
  )
}
