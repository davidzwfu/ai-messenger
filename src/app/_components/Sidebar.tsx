'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { ImageLoader } from '@/app/_libs/ImageLoader'
import { usersData } from '@/app/_data/users'
import { conversationsAtom } from '@/app/_libs/atoms'
import { fromNow } from '@/app/_libs/utils'
import { useEffect } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const conversations = useAtomValue(conversationsAtom)

  // useEffect(() => {
  //   for (const [id, conversation] of Object.entries(conversations)) {
  //     console.log(conversation.isTyping)
  //   }
  // }, [conversations])

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
