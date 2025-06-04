import { CheckCircleFilled } from '@ant-design/icons'
import { Tag } from 'antd'
import { useTranslation } from 'react-i18next'

const SuccessLabel = () => {
  const { t } = useTranslation()
  return (
    <Tag icon={<CheckCircleFilled />} color='success'>
      {t('status.success')}
    </Tag>
  )
}

export default SuccessLabel
