import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons'

interface ProductActiveLabelProps {
  isActive?: boolean
  detail?: boolean
}

const ProductActiveLabel = ({
  isActive = false,
  detail = true
}: ProductActiveLabelProps) => {
  const { t } = useTranslation()

  return (
    <Tag
      icon={isActive ? <CheckCircleOutlined /> : <StopOutlined />}
      color={isActive ? 'success' : 'error'}
    >
      {detail && (isActive ? t('status.active') : t('status.banned'))}
    </Tag>
  )
}

export default ProductActiveLabel
