import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'

const DeletedLabel = () => {
  const { t } = useTranslation()

  return <Tag color='error'>{t('status.banned')}</Tag>
}

export default DeletedLabel
