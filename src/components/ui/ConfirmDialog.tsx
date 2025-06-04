import { useTranslation } from 'react-i18next'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface ConfirmDialogProps {
  title?: string
  message?: any
  color?: string
  onSubmit?: () => void
  onClose?: () => void
  open?: boolean
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title = 'Xác nhận hành động',
  message = 'Bạn có chắc chắn về điều này không?',
  color = 'primary',
  onSubmit = () => {},
  onClose = () => {},
  open = true
}) => {
  const { t } = useTranslation()

  const handleOk = () => {
    onSubmit()
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Modal
      title={
        <div
          className={`flex items-center gap-2 text-${color === 'danger' ? 'red' : 'blue'}-600`}
        >
          <ExclamationCircleOutlined />
          <span>{title}</span>
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={t('button.confirm')}
      cancelText={t('button.cancel')}
      okButtonProps={{
        className:
          color === 'danger'
            ? 'bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600'
            : ''
      }}
      cancelButtonProps={{
        className: 'border-gray-300'
      }}
    >
      <div className='text-gray-700 py-2'>{message}</div>
    </Modal>
  )
}

export default ConfirmDialog
