import { useState } from 'react'
import { Modal, Button, Tooltip } from 'antd'
import {
  ImportOutlined,
  ExportOutlined,
  DollarOutlined
} from '@ant-design/icons'
import CreateTransactionForm from './form/CreateTransactionForm'
import { useTranslation } from 'react-i18next'

interface CreateTransactionItemProps {
  eWallet?: number
  storeId?: string
  onRun?: () => void
  type: 'store' | 'user'
}

const CreateTransactionItem = ({
  eWallet = 0,
  storeId = '',
  onRun,
  type
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

  if (type === 'user') {
    return (
      <div>
        <Tooltip title={t('transactionDetail.empty')}>
          <Button
            type='default'
            disabled={eWallet <= 0}
            onClick={showWithdrawModal}
            icon={<DollarOutlined />}
            danger
          >
            {t('transactionDetail.withdraw')}
          </Button>
        </Tooltip>
        <Modal
          title={t('transactionDetail.withdraw')}
          open={isWithdrawModalOpen}
          onCancel={hideWithdrawModal}
          footer={null}
          destroyOnHidden={true}
        >
          <CreateTransactionForm eWallet={eWallet} onRun={hideWithdrawModal} />
        </Modal>
      </div>
    )
  }

  // type === 'store'
  return (
    <div className='flex gap-3'>
      <Tooltip title={t('transactionDetail.deposit')}>
        <Button
          type='default'
          icon={<ImportOutlined />}
          onClick={showDepositModal}
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
          danger
        >
          {t('transactionDetail.withdraw')}
        </Button>
      </Tooltip>

      <Modal
        title={t('transactionDetail.deposit')}
        open={isDepositModalOpen}
        onCancel={hideDepositModal}
        footer={null}
        width={500}
        destroyOnHidden
      >
        <CreateTransactionForm
          type='deposit'
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
        width={500}
        destroyOnHidden
      >
        <CreateTransactionForm
          type='withdraw'
          eWallet={eWallet}
          storeId={storeId}
          onRun={hideWithdrawModal}
        />
      </Modal>
    </div>
  )
}

export default CreateTransactionItem
