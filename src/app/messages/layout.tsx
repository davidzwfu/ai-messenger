'use client'

import Sidebar from '@/app/_components/Sidebar'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="container">
      <Sidebar />
      {children}
    </div>
  )
}
