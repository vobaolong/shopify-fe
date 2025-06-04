import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddVariantValueForm from './form/AddVariantValueForm'
import { Button, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

interface AddVariantValueItemProps {
  variantId?: string
  variantName?: string
  onRun?: () => void
  isFullWidth?: boolean
}

const AddVariantValueItem = ({
  variantId = '',
  variantName = '',
  onRun,
  isFullWidth = false
}: AddVariantValueItemProps) => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    if (onRun) onRun()
  }

  return (
    <div className={`relative inline-block ${isFullWidth ? 'w-full' : ''}`}>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        className={`text-nowrap rounded ${isFullWidth ? 'w-full' : ''}`}
        onClick={showModal}
      >
        <span className='ml-1 hidden sm:inline'>
          {t('variantDetail.value.add')}
        </span>
      </Button>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        title={`${t('variantDetail.value.add')} '${variantName}'`}
        destroyOnClose
      >
        <AddVariantValueForm
          variantId={variantId}
          variantName={variantName}
          onRun={handleSuccess}
        />
      </Modal>
    </div>
  )
}

export default AddVariantValueItem
