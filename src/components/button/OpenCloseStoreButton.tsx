import { useState, useEffect, useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { openStore } from '../../apis/store.api'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Error from '../ui/Error'
import { useMutation } from '@tanstack/react-query'

interface OpenCloseStoreButtonProps {
  storeId: string
  isOpen: boolean
  onRun: (store: any) => void
}

const OpenCloseStoreButton = ({
  storeId = '',
  isOpen = true,
  onRun
}: OpenCloseStoreButtonProps) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const [openFlag, setOpenFlag] = useState(isOpen)
  const { _id } = getToken()
  const { t } = useTranslation()

  useEffect(() => {
    setOpenFlag(isOpen)
  }, [isOpen, storeId])

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const value = { isOpen: !openFlag }
      return await openStore(_id, value, storeId)
    },
    onSuccess: (data: any) => {
      if (data.data.error) {
        // error will be handled by error state
        return
      }
      setOpenFlag(!openFlag)
      if (onRun) onRun(data.data.store)
      toast.success(
        ` ${
          openFlag ? t('toastSuccess.lockStore') : t('toastSuccess.unlockStore')
        }`
      )
    }
  })

  const handleOpenStore = useCallback(() => {
    setIsConfirming(true)
  }, [])

  const onSubmit = useCallback(() => {
    mutate()
    setIsConfirming(false)
  }, [mutate])

  return (
    <div className='position-relative'>
      {isPending && <Loading size='small' />}
      {error && <Error msg={(error as any).message || 'Server Error'} />}

      {isConfirming && (
        <ConfirmDialog
          title={openFlag ? t('title.closeStore') : t('title.openStore')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}
      <label className='form-switch'>
        <input
          type='checkbox'
          className='form-check-input'
          checked={!openFlag}
          onChange={handleOpenStore}
        />
        <i></i>
      </label>
    </div>
  )
}

export default OpenCloseStoreButton
