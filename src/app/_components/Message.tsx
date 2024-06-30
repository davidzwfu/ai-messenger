import Image from 'next/image'
import { ImageLoader } from '@/app/_libs/ImageLoader'
import { formatTime } from '@/app/_libs/utils'

export default function Message({
  user, message
}: {
  user: any
  message: any
}) {
  return (
    <div className={`message ${message.self ? 'self' : ''}`}>
      {!message.self && 
        <div className="message__profile">
          <Image loader={ImageLoader.avatars} src={user.image} width={40} height={40} alt={user.image} />
        </div>
      }
      <div className="message__block">
        <div className="message__flex">
          <span className="message__title">{!message.self && user.name}</span>
          <span className="message__subtitle">{formatTime(message.sentAt)}</span>
        </div>
        <div className="message__bubble">
          <p className="message__text">{message.content}</p>
        </div>
      </div>
    </div>
  )
}
