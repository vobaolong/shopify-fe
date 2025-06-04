import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import StoreEditProfileForm from './form/StoreEditProfileForm'
import { StoreType } from '../../@types/entity.types'
import { Button, Modal } from 'antd'
import { EditOutlined } from '@ant-design/icons'

interface StoreEditProfileItemProps {
  store: StoreType
}

const StoreEditProfileItem = ({ store }: StoreEditProfileItemProps) => {
  const { t } = useTranslation()
  return (
    <div className='position-relative d-inline-block'>
      <Button
        type='primary'
        className='btn btn-outline-primary rounded-1 ripple cus-tooltip'
        data-bs-toggle='modal'
        data-bs-target='#store-profile-edit-form'
      >
        <i className='fa-duotone fa-pen-to-square' />
        <span className='res-hide ms-2'>{t('button.edit')}</span>
      </Button>

      <Modal
        id='store-profile-edit-form'
        hasCloseBtn={false}
        title={t('storeDetail.editProfile')}
      >
        <StoreEditProfileForm
          storeId={store._id}
          name={store.name}
          address={store.address}
        />
      </Modal>
    </div>
  )
}
export default StoreEditProfileItem
