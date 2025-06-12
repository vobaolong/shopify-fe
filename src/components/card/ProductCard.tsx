import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import { formatPrice } from '../../helper/formatPrice'
import {
  useProductFavoriteCount,
  useIsFavoriteProduct
} from '../../hooks/useWishlist'
import WishlistButton from '../button/WishlistButton'
import { useTranslation } from 'react-i18next'
import { calcPercent } from '../../helper/calcPercent'
import MallLabel from '../label/MallLabel'
import defaultImage from '../../assets/default.webp'
import { Card, Skeleton, Typography, Rate, Tag, Badge, Image } from 'antd'
import { ProductType } from '../../@types/entity.types'
import clsx from 'clsx'

const { Text, Title } = Typography

interface ProductCardProps {
  product: ProductType
  onRun?: (product: ProductType) => void
}

const ProductCard = ({ product, onRun }: ProductCardProps) => {
  const [productValue, setProductValue] = useState<ProductType>(product)
  const { t } = useTranslation()
  const { _id: userId } = getToken() || {}

  const { data: followerCount = 0, isLoading: isLoadingFollowers } =
    useProductFavoriteCount(product._id)
  const { data: isWishlist = false, isLoading: isLoadingWishlistStatus } =
    useIsFavoriteProduct(userId, product._id)

  const isLoading = isLoadingFollowers || isLoadingWishlistStatus

  const onHandleRun = (newProduct: ProductType) => {
    if (onRun) onRun(newProduct)
    setProductValue({
      ...productValue,
      isWishlist: newProduct.isWishlist
    })
  }

  const salePercent = useMemo(
    () => calcPercent(productValue.price, productValue.salePrice),
    [productValue.price, productValue.salePrice]
  )

  return (
    <Card
      hoverable
      className='card border-0 m-auto'
      cover={
        <div className='position-relative'>
          <Badge.Ribbon
            placement='start'
            text={
              salePercent > 0
                ? `-${salePercent}% ${t('productDetail.sale')}`
                : ''
            }
            color='red'
            className={clsx(salePercent > 0 ? 'd-block' : 'd-none')}
          >
            <Link
              className='text-reset text-decoration-none product-card'
              to={`/product/${productValue._id}`}
              title={productValue.name}
            >
              <div
                className='card-img-top cus-card-img-top relative'
                style={{ position: 'relative' }}
              >
                <img
                  src={productValue.listImages[0] || defaultImage}
                  className='cus-card-img !w-60 !h-50'
                  alt={productValue.name}
                  width='200'
                  height='200'
                  loading='eager'
                />
              </div>
            </Link>
          </Badge.Ribbon>
        </div>
      }
    >
      <Card.Meta
        title={<MallLabel />}
        description={
          <>
            <div className='flex justify-between align-center'>
              <Text type='danger' strong className='!text-lg'>
                {productValue.salePrice &&
                  formatPrice(productValue.salePrice.$numberDecimal)}
                <sup>₫</sup>
              </Text>
              {salePercent !== 0 && (
                <Text type='secondary' delete>
                  {productValue.price &&
                    formatPrice(productValue.price.$numberDecimal)}
                  <sup>₫</sup>
                </Text>
              )}
            </div>
            <Link
              className='!no-underline'
              to={`/product/${productValue._id}`}
              title={productValue.name}
            >
              <Title level={5} className='product-name'>
                {productValue.name}
              </Title>
            </Link>
            <div>
              <Rate
                allowHalf
                disabled
                defaultValue={productValue.rating}
                className='!text-xs'
              />{' '}
              <Text type='secondary'>
                {productValue.sold} {t('productDetail.sold')}
              </Text>
            </div>
            <div className='flex justify-end'>
              {userId && (
                <WishlistButton
                  productId={productValue._id}
                  isWishlist={productValue.isWishlist}
                  onRun={(product) => onHandleRun(product as ProductType)}
                />
              )}
            </div>
          </>
        }
      />
    </Card>
  )
}

export default ProductCard
