/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth'
import { formatPrice } from '../../helper/formatPrice'
import {
  useProductFollowerCount,
  useIsFollowingProduct
} from '../../hooks/useFavorite'
import StarRating from '../label/StarRating'
import FollowProductButton from '../button/FollowProductButton'
import { useTranslation } from 'react-i18next'
import { calcPercent } from '../../helper/calcPercent'
import MallLabel from '../label/MallLabel'
import defaultImage from '../../assets/default.webp'
import { Card, Skeleton, Typography, Rate, Tag, Badge } from 'antd'

const IMG = import.meta.env.VITE_STATIC_URL
const { Text, Title } = Typography

const ProductCard = ({ product = {}, onRun }) => {
  const [productValue, setProductValue] = useState(product)
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useTranslation()
  const { _id: userId } = getToken() || {}

  // Use custom hooks instead of direct API calls
  const { data: followerCount = 0, isLoading: isLoadingFollowers } =
    useProductFollowerCount(product._id)
  const { data: isFollowing = false, isLoading: isLoadingFollowStatus } =
    useIsFollowingProduct(userId, product._id)

  // Determine if still loading any data
  const isLoading = isLoadingFollowers || isLoadingFollowStatus

  // Update productValue when data changes
  useMemo(() => {
    if (!isLoading) {
      setProductValue({
        ...product,
        numberOfFollowers: followerCount,
        isFollowing: isFollowing
      })
    }
  }, [product, followerCount, isFollowing, isLoading])

  const onHandleRun = (newProduct) => {
    if (onRun) onRun(newProduct)

    // Update local state immediately for better UX
    setProductValue({
      ...productValue,
      isFollowing: newProduct.isFollowing
      // We don't need to manually calculate numberOfFollowers
      // as it will be automatically updated via query invalidation
    })
  }

  const salePercent = useMemo(
    () => calcPercent(productValue.price, productValue.salePrice),
    [productValue.price, productValue.salePrice]
  )

  if (isLoading) {
    return (
      <Card className='card border-0 m-auto' bordered={false}>
        <Skeleton.Image
          className='card-img-top'
          active
          style={{ width: '100%', height: 220 }}
        />
        <Card.Meta
          className='card-body'
          title={<Skeleton.Input active style={{ width: 94 }} />}
          description={
            <>
              <Skeleton.Input active style={{ width: 120 }} />
              <Skeleton active paragraph={{ rows: 2 }} />
            </>
          }
        />
      </Card>
    )
  }

  return (
    <Card
      hoverable
      className='card border-0 m-auto'
      cover={
        <div className='product-image-container'>
          <Link
            className='text-reset text-decoration-none product-card'
            to={`/product/${productValue._id}`}
            title={product.name}
          >
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className='card-img-top cus-card-img-top position-relative'
              style={{ position: 'relative' }}
            >
              <img
                src={IMG + productValue.listImages[0] && defaultImage}
                className='cus-card-img'
                alt={productValue.name}
                style={{
                  opacity: isHovered ? 0 : 1,
                  transition: 'opacity 0.5s ease'
                }}
              />
              <img
                src={
                  productValue.listImages
                    ? IMG + productValue.listImages[1]
                    : defaultImage
                }
                className='cus-card-img'
                alt={productValue.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.5s ease'
                }}
              />
            </div>
            {salePercent > 0 && (
              <Badge.Ribbon
                text={`-${salePercent}% ${t('productDetail.sale')}`}
                color='red'
                className='text-sm absolute'
              />
            )}
            {productValue.numberOfFollowers > 2 && (
              <Tag color='blue' className='fav-tag'>
                {t('favorite')}
              </Tag>
            )}
          </Link>
        </div>
      }
    >
      <Card.Meta
        className='card-body'
        title={
          <div className='mb-2'>
            <MallLabel />
          </div>
        }
        description={
          <>
            <div className='card-subtitle'>
              {productValue.rating ? (
                <Rate
                  disabled
                  defaultValue={productValue.rating}
                  style={{ fontSize: '14px' }}
                />
              ) : (
                <Skeleton.Input style={{ width: 120 }} active />
              )}{' '}
              <Text type='secondary'>
                {productValue.sold} {t('productDetail.sold')}
              </Text>
            </div>

            <Link
              className='text-reset link-hover d-block mt-1 mb-2'
              to={`/product/${productValue._id}`}
              title={productValue.name}
            >
              <Title level={5} className='card-title product-name'>
                {productValue.name}
              </Title>
            </Link>

            <div className='card-subtitle d-flex justify-content-between align-items-center'>
              <Text type='danger' strong style={{ fontSize: '18px' }}>
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

            <div className='d-flex justify-content-end'>
              {userId && (
                <FollowProductButton
                  productId={productValue._id}
                  isFollowing={productValue.isFollowing}
                  onRun={(product) => onHandleRun(product)}
                  style={{
                    top: '7px',
                    position: 'absolute'
                  }}
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
