'use client'

import Image from 'next/image'
import { useAtom } from 'jotai'
import { ImageLoader } from '@/app/_libs/ImageLoader'
import { User } from '@/app/_data/users'
import { conversationsAtom } from '@/app/_libs/atoms'
import { useRouter } from 'next/navigation'

export default function Profile({
  user, showButton = false
}: {
  user: User
  showButton?: boolean
}) {
  const router = useRouter()
  const [conversations, setConversations] = useAtom(conversationsAtom)

  function start() {
    if (!conversations.hasOwnProperty(user.id)) {
      setConversations(prev => {
        const newState = { ...prev }
        newState[user.id] = {
          unreadCount: 0,
          isTyping: false,
          messages: [],
        }
        return newState
      })
    }
    router.push(`/messages/${user.id}`)
  }

  return (
    <div className="profile">
      <div className="profile__banner" style={{ background: user.color }}></div>
      <div className="profile__header">
        <div className="profile__profile">
          <Image loader={ImageLoader.avatars} src={user.image} width={160} height={160} quality={100} priority={true} alt={user.image} />
        </div>
      </div>
      <div className="profile__body">
        <h3 className="profile__title">
          {user.name}
          <span className="profile__status"></span>
        </h3>
        <p className="profile__subtitle">{user.username}</p>
        <div className="profile__flex">
          {user.traits.split(',').map(trait => {
            return <span className="profile__badge" key={trait}>{trait}</span>
          })}
        </div>
        <div className="profile__block">
          <h4 className="profile__subheading">Age</h4>
          <p className="profile__text">{user.age} yrs</p>
        </div>
        <div className="profile__block">
          <h4 className="profile__subheading">Location</h4>
          <div className="profile__location">
            <Image loader={ImageLoader.flags} src={user.flag} width={20} height={20} alt={user.flag} />
            {user.location}
          </div>
        </div>
        <div className="profile__block">
          <h4 className="profile__subheading">About</h4>
          <p className="profile__text">{user.about}</p>
        </div>
        <div className="profile__block">
          <h4 className="profile__subheading">Notes</h4>
          <p className="profile__text">{user.notes}</p>
        </div>
      </div>
      {showButton &&
        <div className="profile__footer">
          <button className="btn btn--primary" onClick={() => start()}>Start chatting</button>
        </div>
      }
    </div>
  )
}
