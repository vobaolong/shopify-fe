import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'

const ProductActiveLabel = ({ isActive = false }: { isActive?: boolean }) => {
  const { t } = useTranslation()

  return (
    <Tag color={isActive ? 'success' : 'error'}>
      {isActive ? t('status.active') : t('status.banned')}
    </Tag>
  )
}

export default ProductActiveLabel
