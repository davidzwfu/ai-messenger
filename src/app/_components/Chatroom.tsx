'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ImageLoader } from '@/app/_libs/ImageLoader'
import { usersData } from '@/app/_data/users'
import { useMessages } from '@/app/_hooks/useMessages'
import { formatDate, isSameDay } from '@/app/_libs/utils'
import Message from '@/app/_components/Message'
import Typing from '@/app/_components/Typing'

export default function Chatroom({
  id
}: {
  id: number
}) {
  const user = usersData[id]
  const { 
    messages,
    sendMessage,
    clearMessages,
    markAsRead,
    isTyping,
  } = useMessages(id)
  const [messageInput, setMessageInput] = useState('')

  useEffect(() => {
    markAsRead()
  }, [messages])

  function reset() {
    clearMessages()
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

  return (
    <div className="chatroom">
      <div className="chatroom-header">
        <div className="chatroom-header__profile">
          <Image loader={ImageLoader.avatars} src={user.image} width={56} height={56} alt={user.image} />
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
          <button className="btn" onClick={() => reset()}>Reset</button>
          <button className="btn btn--primary">View profile</button>
        </div>
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
  )
}
