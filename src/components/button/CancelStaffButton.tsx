import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../../apis/auth'
import { useCancelStaff } from '../../hooks/useCancelStaff'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import Error from '../ui/Error'
import { toast } from 'react-toastify'

const CancelStaffButton = ({ storeId = '' }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const { _id } = getToken()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isPending, error, mutate } = useCancelStaff()

  const onSubmit = useCallback(() => {
    mutate(
      { userId: _id, storeId },
      {
        onSuccess: () => {
          toast.success(t('Rời thành công'))
          navigate(0)
        }
      }
    )
  }, [mutate, _id, storeId, t, navigate])

  return (
    <div className='position-relative'>
      {isPending && <Loading />}
      {error && (
        <Error msg={error instanceof Error ? error.message : String(error)} />
      )}
      {isConfirming && (
        <ConfirmDialog
          title={t('staffDetail.leave')}
          color='danger'
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <button
        type='button'
        className='btn btn-outline-danger rounded-1 ripple'
        onClick={() => setIsConfirming(true)}
      >
        <i className='fa-solid fa-ban'></i>
        <span className='ms-2 res-hide'>{t('staffDetail.leave')}</span>
      </button>
    </div>
  )
}
export default CancelStaffButton
