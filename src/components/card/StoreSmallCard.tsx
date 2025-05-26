import { Link } from 'react-router-dom'
import defaultImage from '../../assets/default.webp'
import { Avatar, Typography } from 'antd'
import { StoreType } from '../../@types/entity.types'

interface StoreSmallCardProps {
  store: StoreType
  borderName?: boolean
  link?: string
  isAvatar?: boolean
}

const StoreSmallCard = ({
  store,
  borderName = false,
  link = `/store/${store?._id}`,
  isAvatar = true
}: StoreSmallCardProps) => (
  <div
    className={`inline-flex items-center ${borderName ? 'bg-white shadow p-2 rounded-lg' : ''}`}
  >
    <Link to={link} className='!no-underline flex items-center gap-1'>
      {isAvatar && (
        <Avatar
          size={32}
          src={store?.avatar || defaultImage}
          alt={store?.name}
        />
      )}
      <Typography.Text className='text-sm'>{store?.name}</Typography.Text>
    </Link>
  </div>
)

export default StoreSmallCard
