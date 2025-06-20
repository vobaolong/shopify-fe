import { Tag } from 'antd'
import { useTranslation } from 'react-i18next'

const StoreActiveLabel = ({ isActive = false }: { isActive?: boolean }) => {
  const { t } = useTranslation()

  return (
    <Tag color={isActive ? 'success' : 'error'}>
      <span>{isActive ? t('status.active') : t('status.banned')}</span>
    </Tag>
  )
}

export default StoreActiveLabel
