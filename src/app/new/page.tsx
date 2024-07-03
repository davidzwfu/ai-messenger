import { usersData } from '@/app/_data/users'
import Profile from '@/app/_components/Profile'

export default function Page() {
  return (
    <div className="card-grid">
      {Object.values(usersData).map(user => {
        return (
          <div className="card" key={user.id}>
            <Profile user={user} showAction={true} />
          </div>
        )
      })}
    </div>
  )
}
