import { useState } from 'react'
import { Modal, Button, Tooltip } from 'antd'
import { ImportOutlined, ExportOutlined } from '@ant-design/icons'
import CreateDepositTransactionForm from './form/CreateDepositTransactionForm'
import CreateWithDrawTransactionForm from './form/CreateWithDrawTransactionForm'
import { useTranslation } from 'react-i18next'

interface CreateTransactionItemProps {
  eWallet?: number
  storeId?: string
  onRun?: () => void
}

const CreateTransactionItem = ({
  eWallet = 0,
  storeId = '',
  onRun
}: CreateTransactionItemProps) => {
  const { t } = useTranslation()
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  const showDepositModal = () => setIsDepositModalOpen(true)
  const hideDepositModal = () => {
    setIsDepositModalOpen(false)
    if (onRun) onRun()
  }

  const showWithdrawModal = () => setIsWithdrawModalOpen(true)
  const hideWithdrawModal = () => {
    setIsWithdrawModalOpen(false)
    if (onRun) onRun()
  }

  return (
    <div className='flex gap-3'>
      <Tooltip title={t('transactionDetail.deposit')}>
        <Button
          type='default'
          icon={<ImportOutlined />}
          onClick={showDepositModal}
          className='border-green-500 text-green-500 hover:bg-green-50 hover:border-green-600 hover:text-green-600'
        >
          {t('transactionDetail.deposit')}
        </Button>
      </Tooltip>

      <Tooltip
        title={
          eWallet <= 0
            ? t('transactionDetail.empty')
            : t('transactionDetail.withdraw')
        }
      >
        <Button
          type='default'
          icon={<ExportOutlined />}
          onClick={showWithdrawModal}
          disabled={eWallet <= 0}
          className='border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600 hover:text-red-600 disabled:border-gray-300 disabled:text-gray-300'
        >
          {t('transactionDetail.withdraw')}
        </Button>
      </Tooltip>

      <Modal
        title={t('transactionDetail.deposit')}
        open={isDepositModalOpen}
        onCancel={hideDepositModal}
        footer={null}
        width={600}
        className='custom-modal'
      >
        <CreateDepositTransactionForm
          eWallet={eWallet}
          storeId={storeId}
          onRun={hideDepositModal}
        />
      </Modal>

      <Modal
        title={t('transactionDetail.withdraw')}
        open={isWithdrawModalOpen}
        onCancel={hideWithdrawModal}
        footer={null}
        width={600}
        className='custom-modal'
      >
        <CreateWithDrawTransactionForm
          eWallet={eWallet}
          storeId={storeId}
          onRun={hideWithdrawModal}
        />
      </Modal>
    </div>
  )
}

export default CreateTransactionItem
