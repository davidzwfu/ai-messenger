'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAtomValue } from 'jotai'
import { ImageLoader } from '@/app/_libs/ImageLoader'
import { usersData } from '@/app/_data/users'
import { conversationsAtom } from '@/app/_libs/atoms'
import { fromNow } from '@/app/_libs/utils'

export default function Sidebar() {
  const pathname = usePathname()
  const conversations = useAtomValue(conversationsAtom)
  const totalUnread = Object.values(conversations).reduce((t, c) => t + c.unreadCount, 0)

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-header__title">AI Messenger</h2>
        {totalUnread > 0 &&
          <span className="sidebar-header__unread">{totalUnread}</span>
        }
        <Link href="/new" className="btn btn--icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M19 21V15M16 18H22M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
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
