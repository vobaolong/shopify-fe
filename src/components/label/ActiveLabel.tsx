import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'

const ActiveLabel = ({ isDeleted = false }: { isDeleted?: boolean }) => {
  const { t } = useTranslation()
  if (isDeleted) {
    return <Tag color='error'>{t('status.banned')}</Tag>
  }

  return <Tag color='success'>{t('status.active')}</Tag>
}

export default ActiveLabel
