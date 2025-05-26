import { useEffect, useCallback } from 'react'
import Loading from '../ui/Loading'
import { getToken } from '../../apis/auth.api'
import { useTranslation } from 'react-i18next'
import { useToggleProductFavorite } from '../../hooks/useToggleProductFavorite'
import { notification, Spin } from 'antd'

interface FollowProductButtonProps {
  productId?: string
  isFollowing?: boolean
  className?: string
  style?: React.CSSProperties
  onRun?: (product: { isFollowing: boolean }) => void
}

const FollowProductButton = ({
  productId = '',
  isFollowing = false,
  className = '',
  style = {},
  onRun
}: FollowProductButtonProps) => {
  const { t } = useTranslation()
  const { _id } = getToken() || {}
  const { isPending, error, mutate } = useToggleProductFavorite()

  useEffect(() => {
    // Nếu cần đồng bộ trạng thái ngoài mutation, có thể xử lý ở đây
  }, [isFollowing, productId])

  const handleFollowProduct = useCallback(() => {
    if (isPending) return
    const updatedFollowingState = !isFollowing
    mutate(
      { userId: _id, productId, isFollowing },
      {
        onSuccess: () => {
          if (onRun) {
            const product = { isFollowing: updatedFollowingState }
            onRun(product)
            if (updatedFollowingState) {
              notification.success({
                message: t('toastSuccess.favoriteProduct.follow')
              })
            } else {
              notification.success({
                message: t('toastSuccess.favoriteProduct.unfollow')
              })
            }
          }
        }
      }
    )
  }, [isPending, mutate, _id, productId, isFollowing, onRun, t])

  return (
    <div className='d-grid' style={style}>
      <span
        className={`d-flex align-items-center rounded-circle justify-content-center position-relative ${
          isFollowing ? 'text-danger' : 'text-secondary'
        } ${className}`}
        onClick={handleFollowProduct}
      >
        {isPending && <Spin />}
        <i
          style={{ fontSize: '17px' }}
          className={`pointer fa-heart p-2 rounded-circle box-shadow ${
            isFollowing
              ? 'bg-danger text-white fa-solid'
              : 'bg-white fa-regular'
          }`}
        ></i>
      </span>
    </div>
  )
}

export default FollowProductButton
