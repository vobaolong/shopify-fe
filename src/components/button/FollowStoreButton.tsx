import { useEffect, useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { useToggleFollowStore } from '../../hooks/useToggleFollowStore'
import Loading from '../ui/Loading'
import Error from '../ui/Error'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

interface FollowStoreButtonProps {
  storeId?: string
  isFollowing?: boolean
  className?: string
  onRun?: (store: { isFollowing: boolean }) => void
}

const FollowStoreButton = ({
  storeId = '',
  isFollowing = false,
  className = '',
  onRun
}: FollowStoreButtonProps) => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const { isPending, error, mutate } = useToggleFollowStore()

  useEffect(() => {
    // Nếu cần đồng bộ trạng thái ngoài mutation, có thể xử lý ở đây
  }, [isFollowing, storeId])

  const handleFollowStore = useCallback(() => {
    if (isPending) return
    const updatedFollowingState = !isFollowing
    mutate(
      { userId: _id, storeId, isFollowing },
      {
        onSuccess: () => {
          if (onRun) {
            const store = { isFollowing: updatedFollowingState }
            onRun(store)
            toast.success(
              updatedFollowingState
                ? t('toastSuccess.followStore.follow')
                : t('toastSuccess.followStore.unfollow')
            )
          }
        }
      }
    )
  }, [isPending, mutate, _id, storeId, isFollowing, onRun, t])

  return (
    <button
      type='button'
      className={`btn rounded-1 ${
        isFollowing ? 'btn-danger' : 'btn-outline-danger'
      } ripple ${className}`}
      onClick={handleFollowStore}
      disabled={isPending}
    >
      {isPending && <Loading size='small' />}
      {error ? (
        <Error msg={error instanceof Error ? error.message : String(error)} />
      ) : isFollowing ? (
        <span>
          <i className='fa-solid fa-check'></i>
          <span className='ms-2 res-hide-md'>{t('storeDetail.following')}</span>
        </span>
      ) : (
        <span>
          <i className='fa-light fa-plus'></i>
          <span className='ms-2 res-hide-md'>{t('storeDetail.follow')}</span>
        </span>
      )}
    </button>
  )
}
export default FollowStoreButton
