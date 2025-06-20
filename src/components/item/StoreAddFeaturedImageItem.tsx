import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import StoreAddFeaturedImageForm from './form/StoreAddFeaturedImageForm'
import { Button, Modal, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const StoreAddFeaturedImageItem = ({ count = 6, storeId = '' }) => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div className='inline-block'>
      <Tooltip
        title={count >= 6 ? t('storeDetail.limitFeatured') : ''}
        placement='top'
      >
        <Button
          type='primary'
          icon={<PlusOutlined />}
          disabled={count >= 6}
          className='text-nowrap rounded'
          onClick={showModal}
        >
          <span className='hidden sm:inline'>{t('button.addFeaturedImg')}</span>
        </Button>
      </Tooltip>

      {count < 6 && (
        <Modal
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          title={t('storeDetail.addFeaturedImg')}
          destroyOnHidden
        >
          <StoreAddFeaturedImageForm storeId={storeId} />
        </Modal>
      )}
    </div>
  )
}
export default StoreAddFeaturedImageItem
