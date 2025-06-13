import { useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { useTranslation } from 'react-i18next'
import { notification, Spin, Tooltip } from 'antd'
import { useToggleWishlist } from '../../hooks/useWishlist'
import { HeartIcon } from 'lucide-react'

interface WishlistButtonProps {
  productId?: string
  isWishlist?: boolean
  onRun?: (product: { isWishlist: boolean }) => void
}

const WishlistButton = ({
  productId = '',
  isWishlist = false,
  onRun
}: WishlistButtonProps) => {
  const { t } = useTranslation()
  const { _id: userId } = getToken() || {}
  const { toggleWishlist, isPending } = useToggleWishlist()
  const handleFollowProduct = useCallback(async () => {
    if (isPending || !userId || !productId) return
    try {
      await toggleWishlist(userId, productId, isWishlist)
      notification.success({
        message: isWishlist
          ? t('toastSuccess.wishlist.unfollow')
          : t('toastSuccess.wishlist.follow')
      })
      if (onRun) {
        onRun({ isWishlist: !isWishlist })
      }
    } catch (error) {
      notification.error({
        message: t('toastError.default')
      })
    }
  }, [isPending, toggleWishlist, userId, productId, isWishlist, t, onRun])

  return (
    <Spin spinning={isPending}>
      <Tooltip
        title={
          isWishlist ? t('tooltip.wishlist.remove') : t('tooltip.wishlist.add')
        }
      >
        <HeartIcon
          size={20}
          onClick={handleFollowProduct}
          fill={isWishlist ? 'red' : 'none'}
          className={`pointer text-red-500`}
        />
      </Tooltip>
    </Spin>
  )
}

export default WishlistButton
