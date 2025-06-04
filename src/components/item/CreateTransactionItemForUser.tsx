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

  const button = (
    <Button
      type='default'
      disabled={eWallet <= 0}
      onClick={showModal}
      icon={<DollarOutlined />}
      style={{ whiteSpace: 'nowrap' }}
    >
      {t('transactionDetail.draw')}
    </Button>
  )

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {eWallet <= 0 ? (
        <Tooltip title={t('transactionDetail.empty')}>{button}</Tooltip>
      ) : (
        button
      )}

      <Modal
        title={t('transactionDetail.draw')}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <CreateTransactionFormForUser eWallet={eWallet} onRun={handleSuccess} />
      </Modal>
    </div>
  )
}
export default CreateTransactionItemForUser
