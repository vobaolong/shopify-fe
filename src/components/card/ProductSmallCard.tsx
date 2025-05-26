import { Link } from 'react-router-dom'
import StarRating from '../label/StarRating'
import { ProductType } from '../../@types/entity.types'
import { Image } from 'antd'
import defaultImage from '../../assets/default.webp'

interface ProductSmallCardProps {
  product: ProductType
  borderName?: boolean
  style?: React.CSSProperties
  rating?: boolean
}

const ProductSmallCard = ({
  product,
  borderName = false,
  style = {},
  rating = false
}: ProductSmallCardProps) => (
  <span
    className={`d-inline-flex align-items-center ${
      borderName && 'bg-value rounded-1 px-1'
    }`}
  >
    <Link
      className='!no-underline flex gap-2 items-center'
      title={product.name}
      to={`/product/${product._id}`}
      style={style}
    >
      <Image
        src={product.listImages[0] || defaultImage}
        alt={product.name}
        width={48}
        height={48}
        preview={false}
        className='rounded object-cover border'
      />
      <span
        className='max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap font-medium hover:text-blue-600 transition-colors duration-150'
        title={product.name}
      >
        {product.name}
      </span>
      {rating && (
        <small className='text-dark'>
          {product.rating} <StarRating stars={product.rating} />
        </small>
      )}
    </Link>
  </span>
)

export default ProductSmallCard
