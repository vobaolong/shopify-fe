import { Tag } from 'antd'
import { useTranslation } from 'react-i18next'

const StoreStatusLabel = ({ isOpen = true }: { isOpen?: boolean }) => {
  const { t } = useTranslation()
  return (
    <Tag color={isOpen ? 'success' : 'warning'}>
      <span>{isOpen ? t('storeDetail.open') : t('storeDetail.close')}</span>
    </Tag>
  )
}

export default StoreStatusLabel
