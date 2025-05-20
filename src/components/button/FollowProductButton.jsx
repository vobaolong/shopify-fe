import { useState, useEffect } from 'react'
import Loading from '../ui/Loading'
import { getToken } from '../../apis/auth'
import { useTranslation } from 'react-i18next'
import { useToggleProductFavorite } from '../../hooks/useFavorite'
import { notification, Spin } from 'antd'

const FollowProductButton = ({
  productId = '',
  isFollowing = false,
  className = '',
  style = {},
  onRun
}) => {
  const { t } = useTranslation()
  const [followingFlag, setFollowingFlag] = useState(isFollowing)
  const { _id } = getToken() || {}
  const { toggleFollow, isPending } = useToggleProductFavorite()

  useEffect(() => {
    setFollowingFlag(isFollowing)
  }, [isFollowing, productId])

  const handleFollowProduct = () => {
    if (isPending) return
    const updatedFollowingState = !followingFlag
    setFollowingFlag(updatedFollowingState)
    toggleFollow(_id, productId, followingFlag)
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

  return (
    <div className='d-grid' style={style}>
      <span
        className={`d-flex align-items-center rounded-circle justify-content-center position-relative ${
          followingFlag ? 'text-danger' : 'text-secondary'
        } ${className}`}
        onClick={handleFollowProduct}
      >
        {isPending && <Spin />}
        <i
          style={{ fontSize: '17px' }}
          className={`pointer fa-heart p-2 rounded-circle box-shadow ${
            followingFlag
              ? 'bg-danger text-white fa-solid'
              : 'bg-white fa-regular'
          }`}
        ></i>
      </span>
    </div>
  )
}

export default FollowProductButton
