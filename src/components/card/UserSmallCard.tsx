import { Link } from 'react-router-dom'
import { UserType } from '../../@types/entity.types'

interface UserSmallCardProps {
  user: UserType
  borderName?: boolean
  style?: React.CSSProperties
  link?: string
}

const UserSmallCard = ({
  user,
  borderName = false,
  style = {},
  link = `/user/${user?._id}`
}: UserSmallCardProps) => (
  <span
    className={`d-inline-flex align-items-center ${
      borderName && 'bg-body shadow'
    }`}
    style={style}
  >
    <Link
      className='text-decoration-none'
      title={user?.firstName + ' ' + user?.lastName}
      to={link}
    >
      <img
        loading='lazy'
        src={user?.avatar}
        className='small-card-img'
        alt={user?.firstName + ' ' + user?.lastName}
      />
    </Link>

    <Link
      className='link-hover ms-2'
      title={user?.firstName + ' ' + user?.lastName}
      to={link}
      style={style}
    >
      <span style={{ fontSize: '0.9rem' }}>
        {user?.firstName + ' ' + user?.lastName}
      </span>
    </Link>
  </span>
)

export default UserSmallCard
