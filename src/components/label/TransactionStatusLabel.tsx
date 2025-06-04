import { Tag } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const TransactionStatusLabel = ({ isUp = true }) => {
  const { t } = useTranslation()
  return (
    <Tag color={isUp ? 'success' : 'error'}>
      {isUp ? (
        <>
          <ArrowDownOutlined />
          <span className='ml-2'>{t('userDetail.in')}</span>
        </>
      ) : (
        <>
          <ArrowUpOutlined />
          <span className='ml-2'>{t('userDetail.out')}</span>
        </>
      )}
    </Tag>
  )
}

export default TransactionStatusLabel
