import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import { formatPrice } from '../../helper/formatPrice'
import { useAddWishlistCount, useIsWishlist } from '../../hooks/useWishlist'
import WishlistButton from '../button/WishlistButton'
import { useTranslation } from 'react-i18next'
import { calcPercent } from '../../helper/calcPercent'
import defaultImage from '../../assets/default.webp'
import { Card, Typography } from 'antd'
import { ProductType } from '../../@types/entity.types'
import clsx from 'clsx'

const { Text } = Typography

interface CardMiniProps {
  product: ProductType
  onRun?: (product: ProductType) => void
  className?: string
}

const CardMini = ({ product, onRun, className = '' }: CardMiniProps) => {
  const [productValue, setProductValue] = useState<ProductType>(product)
  const { _id: userId } = getToken() || {}

  const { data: isWishlist = false, isLoading } = useIsWishlist(
    userId,
    product._id
  )

  const onHandleRun = (newProduct: ProductType) => {
    if (onRun) onRun(newProduct)
  }

  const salePercent = useMemo(
    () => calcPercent(productValue.price, productValue.salePrice),
    [productValue.price, productValue.salePrice]
  )
  return (
    <div
      className={clsx(
        'relative bg-white rounded-lg border hover:shadow-md transition-shadow max-w-[300px] max-h-[100px] overflow-hidden',
        className
      )}
    >
      <Link
        className='!no-underline'
        to={`/product/${productValue._id}`}
        title={productValue.name}
      >
        <div className='flex items-center p-2 gap-4'>
          <div className='flex-shrink-0'>
            <img
              src={productValue.listImages[0] || defaultImage}
              className='w-8 h-8 object-cover rounded-md'
              alt={productValue.name}
              loading='lazy'
            />
          </div>

          <div className='flex-1 min-w-0'>
            <span className='text-sm'>{productValue.name}</span>
            <div className='flex items-center gap-4 flex-wrap'>
              <span className='text-red-500'>
                {productValue.salePrice &&
                  formatPrice(productValue.salePrice.$numberDecimal)}
                <sup className='text-xs ml-0.5'>₫</sup>
              </span>
              {salePercent > 0 && (
                <span className='text-gray-400 line-through text-sm'>
                  {productValue.price &&
                    formatPrice(productValue.price.$numberDecimal)}
                  <sup className='text-xs'>₫</sup>
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {userId && (
        <div className='absolute bottom-2 right-2'>
          <WishlistButton
            productId={productValue._id}
            isWishlist={isWishlist}
            onRun={(product) => onHandleRun(product as ProductType)}
          />
        </div>
      )}
    </div>
  )
}

export default CardMini
