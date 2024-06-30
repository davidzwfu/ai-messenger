'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAtom } from 'jotai'
import { ImageLoader } from '@/app/_libs/ImageLoader'
import { usersData } from '@/app/_data/users'
import { conversationsAtom, incomingMessagesAtom } from '@/app/_libs/atoms'
import { fromNow } from '@/app/_libs/utils'

export default function Sidebar() {
  const pathname = usePathname()
  const [conversations, setConversations] = useAtom(conversationsAtom)
  const [incomingMessages, setIncomingMessages] = useAtom(incomingMessagesAtom)
  const processingMessage = useRef<boolean>(false)

  useEffect(() => {
    if (incomingMessages.length > 0 && !processingMessage.current) {
      processMessage(incomingMessages.at(0))
    }
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
        newState[userId].isTyping = false
        newState[userId].messages.push({
          self: false,
          content,
          sentAt: Date.now(),
        })
        return newState
      })
      setIncomingMessages(prev => prev.slice(1))
      processingMessage.current = false
    }, typingSeconds * 1000)
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-header__title">Messages</h2>
      </div>
      <div className="sidebar-body">
        {Object.entries(conversations).map(([id, conversation]) => {
          const user = usersData[id]
          const lastMessage = conversation.messages.at(-1)
          const href = `/messages/${id}`
          return (
            <Link href={href} className={`conversation ${pathname == href ? 'active' : ''}`} key={id}>
              <div className="conversation__flex">
                {conversation.unreadCount > 0 &&
                  <span className="conversation__unread"></span>
                }
                <div className="conversation__profile">
                  <Image loader={ImageLoader.avatars} src={user.image} width={40} height={40} alt={user.image} />
                  <div className="conversation__status"></div>
                </div>
                <div className="conversation__block">
                  <span className="conversation__title">{user.name}</span>
                  <span className="conversation__subtitle">{user.username}</span>
                </div>
                <span className="conversation__time">{lastMessage && fromNow(lastMessage.sentAt)}</span>
              </div>
              <p className="conversation__text">
                {conversation.isTyping ?
                  'typing...'
                  :
                  <>
                    {lastMessage?.self &&
                      <b>You: </b>
                    }
                    {lastMessage?.content}
                  </>
                }
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
