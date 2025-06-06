import { useState } from 'react'
import { Button, Modal, Tooltip, Typography } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import CreateTransactionFormForUser from './form/CreateTransactionFormForUser'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

interface CreateTransactionItemForUserProps {
  eWallet?: number
  onRun?: () => void
}

const CreateTransactionItemForUser = ({
  eWallet = 0,
  onRun
}: CreateTransactionItemForUserProps) => {
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
    if (onRun) {
      onRun()
    }
  }

  return (
    <div>
      {eWallet <= 0 ? (
        <Tooltip title={t('transactionDetail.empty')}>
          <Button
            type='default'
            variant='outlined'
            disabled={eWallet <= 0}
            onClick={showModal}
            icon={<DollarOutlined />}
          >
            {t('transactionDetail.withdraw')}
          </Button>
        </Tooltip>
      ) : (
        <Button
          type='default'
          variant='outlined'
          disabled={eWallet <= 0}
          onClick={showModal}
          icon={<DollarOutlined />}
        >
          {t('transactionDetail.withdraw')}
        </Button>
      )}

      <Modal
        title={t('transactionDetail.withdraw')}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden={true}
      >
        <CreateTransactionFormForUser eWallet={eWallet} onRun={handleSuccess} />
      </Modal>
    </div>
  )
}
export default CreateTransactionItemForUser
