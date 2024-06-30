import Chatroom from '@/app/_components/Chatroom'
import { usersData } from '@/app/_data/users'

export default function Page({
  params
}: {
  params: { id: number }
}) {
  if (!usersData.hasOwnProperty(params.id))
    return null

  return <Chatroom id={params.id} />
}
