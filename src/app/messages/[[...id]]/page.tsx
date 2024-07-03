'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAtomValue } from 'jotai'
import { conversationsAtom, windowWidthAtom } from '@/app/_libs/atoms'
import Chatroom from '@/app/_components/Chatroom'

export default function Page({
  params
}: {
  params: { id: string }
}) {
  const conversations = useAtomValue(conversationsAtom)
  const windowWidth = useAtomValue(windowWidthAtom)

  if (!params.id || !conversations.hasOwnProperty(params.id)) {
    if (windowWidth <= 1024) return null
    return (
      <div className="empty">
        <div className="empty__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 8.5H12M7 12H15M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Image src="/lines.svg" width={480} height={480} priority={true} alt="lines.svg" />
        </div>
        <p className="empty__title">No conversation to display</p>
        <p className="empty__text">Select an existing chat or start a new one.</p>
        <Link href="/new" className="btn btn--primary btn--large">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6.99996 1.16669V12.8334M1.16663 7.00002H12.8333" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New chat
        </Link>
      </div>
    )
  }

  return <Chatroom id={params.id} />
}
