import Image from 'next/image'
import { ImageLoader } from '@/app/_libs/ImageLoader'

export default function Typing({
  user
}: {
  user: any
}) {
  return (
    <div className="message">
      <div className="message__profile">
        <Image loader={ImageLoader.avatars} src={user.image} width={40} height={40} alt={user.image} />
      </div>
      <div className="message__block">
        <div className="message__flex">
          <span className="message__title">{user.name}</span>
        </div>
        <div className="message__bubble">
          <div className="message__typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
