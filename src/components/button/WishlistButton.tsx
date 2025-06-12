import React, { useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { useTranslation } from 'react-i18next'
import { notification, Spin } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlist, unWishlist } from '../../apis/wishlist.api'
import { favoriteKeys } from '../../hooks/useWishlist'

interface WishlistButtonProps {
  productId?: string
  isWishlist?: boolean
  className?: string
  onRun?: (product: { isWishlist: boolean }) => void
}

const WishlistButton = ({
  productId = '',
  isWishlist = false,
  className = '',
  onRun
}: WishlistButtonProps) => {
  const { t } = useTranslation()
  const { _id: userId } = getToken() || {}
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!userId || !productId) {
        throw new Error('Missing userId or productId')
      }
      console.log(
        `API Call: ${isWishlist ? 'unWishlist' : 'wishlist'} for userId=${userId}, productId=${productId}`
      )
      return isWishlist
        ? unWishlist(userId, productId)
        : wishlist(userId, productId)
    },
    onSuccess: (data) => {
      console.log('API Success Response:', data)
      notification.success({
        message: isWishlist
          ? t('toastSuccess.wishlist.unfollow')
          : t('toastSuccess.wishlist.follow')
      })
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.product.all()
      })
      if (onRun) {
        onRun({ isWishlist: !isWishlist })
      }
    },
    onError: (error: any) => {
      console.error('API Error:', error)
      notification.error({
        message: t('toastError.wishlist'),
        description:
          error?.response?.data?.error || error.message || 'Unknown error'
      })
    }
  })

  const handleFollowProduct = useCallback(() => {
    if (isPending || !userId || !productId) return
    mutate()
  }, [isPending, mutate, userId, productId])

  return (
    <span
      className={`flex items-center rounded-circle justify-content-center absolute top-[7px] ${
        isWishlist ? 'text-danger' : 'text-secondary'
      } ${className}`}
      onClick={handleFollowProduct}
    >
      {isPending && <Spin size='small' />}
      <i
        style={{ fontSize: '17px' }}
        className={`pointer fa-heart p-2 rounded-circle box-shadow ${
          isWishlist ? 'bg-danger text-white fa-solid' : 'bg-white fa-regular'
        }`}
      />
    </span>
  )
}

export default WishlistButton
