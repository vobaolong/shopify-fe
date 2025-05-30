import { Link } from 'react-router-dom'
import { UserType } from '../../@types/entity.types'
import { Avatar, Typography } from 'antd'
import defaultImage from '../../assets/default.webp'

interface UserSmallCardProps {
  user: UserType
  borderName?: boolean
  isAvatar?: boolean
  link?: string
}

const UserSmallCard = ({
  user,
  borderName = false,
  isAvatar = true,
  link = `/user/${user?._id}`
}: UserSmallCardProps) => (
  <div
    className={`inline-flex items-center ${borderName ? 'bg-white shadow-sm rounded-md p-1' : ''}`}
  >
    <Link
      className='!no-underline flex items-center gap-1 text-nowrap'
      title={user?.userName}
      to={link}
    >
      {isAvatar && (
        <Avatar
          src={user?.avatar || defaultImage}
          alt={user?.userName}
          size={32}
          className='object-cover'
        />
      )}
      <Typography.Text className='text-sm !no-underline'>
        {user?.userName}
      </Typography.Text>
    </Link>
  </div>
)

export default UserSmallCard
