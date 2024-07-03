'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useAtom } from 'jotai'
import { ImageLoader } from '@/app/_libs/ImageLoader'
import { usersData } from '@/app/_data/users'
import { useMessages } from '@/app/_hooks/useMessages'
import { formatDate, isSameDay } from '@/app/_libs/utils'
import { showProfileAtom } from '@/app/_libs/atoms'
import Message from '@/app/_components/Message'
import Typing from '@/app/_components/Typing'
import DeleteChat from '@/app/_modals/DeleteChat'
import DropdownBtn from './DropdownBtn'
import Profile from './Profile'

Modal.setAppElement('#root')

export default function Chatroom({
  id
}: {
  id: string
}) {
  const router = useRouter()
  const user = usersData[id]
  const {
    isTyping,
    messages,
    sendMessage,
    markAsRead,
    clearMessages,
    deleteConversation,
  } = useMessages(id)
  const [messageInput, setMessageInput] = useState('')
  const [showProfile, setShowProfile] = useAtom(showProfileAtom)
  const [deleteId, setDeleteId] = useState<string|null>(null)

  useEffect(() => {
    markAsRead()
  }, [messages])

  function deleteChat() {
    deleteConversation()
    router.push('/messages')
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key == 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault()
    const newMessage = messageInput.trim()
    if (!newMessage)
      return

    sendMessage(newMessage, id)
    setMessageInput('')
  }

  return <>
    <DeleteChat deleteId={deleteId} setDeleteId={setDeleteId} action={deleteChat} />

    <div className="chatroom">
      <Link href="/messages" className="chatroom__back">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15.8327 10H4.16602M4.16602 10L9.99935 15.8334M4.16602 10L9.99935 4.16669" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>
      <div className="chatroom-header">
        <div className="chatroom-header__profile">
          <Image loader={ImageLoader.avatars} src={user.image} width={56} height={56} priority={true} alt={user.image} />
          <div className="chatroom-header__status"></div>
        </div>
        <div className="chatroom-header__block">
          <div className="chatroom-header__flex">
            <span className="chatroom-header__title">{user.name}</span>
            <span className="status-badge online">Online</span>
          </div>
          <span className="chatroom-header__subtitle">{user.username}</span>
        </div>
        <div className="chatroom-header__actions">
          <button className="btn" onClick={() => clearMessages()}>Reset</button>
          <button className="btn" onClick={() => setDeleteId(id)}>Delete chat</button>
          <button className="btn btn--primary" onClick={() => setShowProfile(!showProfile)}>
            {showProfile ? 'Hide' : 'View'} profile
          </button>
        </div>
        <DropdownBtn className="btn btn--dropdown">
          <div className="dropdown-menu__item" onClick={() => setShowProfile(!showProfile)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {showProfile ? 'Hide' : 'View'} profile
          </div>
          <div className="dropdown-menu__item" onClick={() => setDeleteId(id)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete chat
          </div>
          <div className="dropdown-menu__item" onClick={() => clearMessages()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.7 13.5L20.7005 11.5L18.7 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.3019 3 18.1885 4.77814 19.7545 7.42909M12 7V12L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reset
          </div>
        </DropdownBtn>
      </div>
      <div className="chatroom-body">
        <div className="messages">
          {messages.map((message: any, index: number) => {
            const showDate = index == 0 || !isSameDay(message.sentAt, messages[index-1].sentAt)
            return (
              <div className="message__wrapper" key={message.sentAt}>
                {showDate &&
                  <div className="chatroom__divider">{formatDate(message.sentAt)}</div>
                }
                <Message user={user} message={message} />
              </div>
            )
          })}
          {isTyping &&
            <Typing user={user} />
          }
        </div>
      </div>

      <div className="chatroom-footer">
        <form onSubmit={e => handleSubmit(e)}>
          <div className="message-box">
            <textarea className="message-box__input" rows={3} placeholder="Type a message..." maxLength={300}
              value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyDown={e => handleKeyDown(e)} />
            <button className="btn btn--primary">Send</button>
          </div>
        </form>
      </div>
    </div>

    {showProfile &&
      <Profile user={user} />
    }
  </>
}
