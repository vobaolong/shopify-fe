import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import StoreAddStaffForm from './form/StoreAddStaffForm'
import { Button, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const StoreAddStaffItem = ({ storeId = '', owner = {}, staff = [] }) => {
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
      <Button
        type='primary'
        icon={<PlusOutlined />}
        className='text-nowrap rounded'
        onClick={showModal}
      >
        <span className='ml-1 hidden sm:inline'>{t('staffDetail.add')}</span>
      </Button>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        title={t('staffDetail.add')}
        destroyOnClose
      >
        <StoreAddStaffForm storeId={storeId} owner={owner} staff={staff} />
      </Modal>
    </div>
  )
}
export default StoreAddStaffItem
