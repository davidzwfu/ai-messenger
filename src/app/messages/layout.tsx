'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'
import { useAtom } from 'jotai'
import { windowWidthAtom } from '@/app/_libs/atoms'
import Sidebar from '@/app/_components/Sidebar'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [windowWidth, setWindowWidth] = useAtom(windowWidthAtom)

  useLayoutEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth))
  }, [])

  return (
    <div className="container">
      {(pathname == '/messages' || windowWidth > 1024) &&
        <Sidebar />
      }
      {children}
    </div>
  )
}
