import { useState, useEffect, useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { openStore } from '../../apis/store.api'
import { Alert, Switch, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { useAntdApp } from '../../hooks/useAntdApp'

interface OpenCloseStoreButtonProps {
  storeId: string
  isOpen: boolean
  onRun: (store: any) => void
}

const OpenCloseStoreButton = ({
  storeId,
  isOpen = true,
  onRun
}: OpenCloseStoreButtonProps) => {
  const [openFlag, setOpenFlag] = useState(isOpen)
  const { _id } = getToken()
  const { t } = useTranslation()
  const { message } = useAntdApp()

  useEffect(() => {
    setOpenFlag(isOpen)
  }, [isOpen, storeId])
  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const value = { isOpen: !openFlag }
      return await openStore(_id, value, storeId)
    },
    onSuccess: (data: any) => {
      setOpenFlag(!openFlag)
      if (onRun) onRun(data.store)
      message.success(
        openFlag ? t('toastSuccess.lockStore') : t('toastSuccess.unlockStore')
      )
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.error || error?.message || t('toastError.server')
      )
    }
  })

  const handleToggleStore = useCallback(() => {
    Modal.confirm({
      title: openFlag ? t('title.closeStore') : t('title.openStore'),
      icon: <ExclamationCircleOutlined className='text-orange-500' />,
      content: <p className='mb-2'>{t('confirmDialog')}</p>,
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      okButtonProps: {
        danger: openFlag,
        loading: isPending
      },
      onOk: () => {
        mutate()
      }
    })
  }, [openFlag, t, isPending, mutate])

  return (
    <div className='relative'>
      {error && (
        <Alert
          message={'Server Error'}
          type='error'
          showIcon
          className='mb-2'
        />
      )}
      <div className='flex items-center gap-2'>
        <Switch
          checked={openFlag}
          loading={isPending}
          onChange={handleToggleStore}
          className={`${openFlag ? '!bg-blue-500' : '!bg-gray-300'}`}
        />
      </div>
    </div>
  )
}

export default OpenCloseStoreButton
