import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'

const ActiveLabel = () => {
  const { t } = useTranslation()

  return <Tag color='success'>{t('status.active')}</Tag>
}

export default ActiveLabel
