import { Link } from 'react-router-dom'
import defaultImage from '../../assets/default.webp'
import Skeleton from 'react-loading-skeleton'
import { StoreType } from '../../@types/entity.types'

interface StoreSmallCardProps {
  store: StoreType
  borderName?: boolean
  link?: string
  isLoading?: boolean
}

const StoreSmallCard = ({
  store,
  borderName = false,
  link = `/store/${store?._id}`,
  isLoading = false
}: StoreSmallCardProps) => (
  <span
    className={`d-inline-flex align-items-center ${
      borderName && 'bg-body shadow p-1 rounded-2'
    }`}
  >
    <Link className='text-reset text-decoration-none' to={link}>
      {isLoading ? (
        <Skeleton circle={true} height={40} width={40} />
      ) : (
        <img
          loading='lazy'
          src={store?.avatar ? store?.avatar : defaultImage}
          className='small-card-img'
          alt={store?.name}
        />
      )}
    </Link>
    <Link className='text-reset link-hover m-auto ms-2' to={link}>
      {isLoading ? (
        <Skeleton height={20} width={100} />
      ) : (
        <span style={{ fontSize: '0.9rem' }}>{store?.name}</span>
      )}
    </Link>
  </span>
)

export default StoreSmallCard
