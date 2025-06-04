import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminCreateCommissionForm from './form/AdminCreateCommissionForm'
import { Button, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

interface AdminCreateCommissionItemProps {
  onRun?: () => void
}

const AdminCreateCommissionItem = ({
  onRun = () => {}
}: AdminCreateCommissionItemProps) => {
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
    onRun()
  }

  return (
    <div className='inline-block'>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        className='text-nowrap rounded'
        onClick={showModal}
      >
        <span className='ml-1 hidden sm:inline'>
          {t('commissionDetail.add')}
        </span>
      </Button>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        title={t('dialog.addCommission')}
        destroyOnClose
      >
        <AdminCreateCommissionForm onRun={handleSuccess} />
      </Modal>
    </div>
  )
}
export default AdminCreateCommissionItem
