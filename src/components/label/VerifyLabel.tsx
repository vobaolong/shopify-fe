import { Tag } from 'antd'
import { useTranslation } from 'react-i18next'

const VerifyLabel = ({ verify }: { verify: boolean }) => {
  const { t } = useTranslation()
  return (
    <Tag color={verify ? 'success' : 'error'}>
      <i
        className={`fa-solid fa-circle-${verify ? 'check' : 'xmark'} me-1`}
      ></i>
      <span>{verify ? t('status.verified') : t('status.notVerified')}</span>
    </Tag>
  )
}

export default VerifyLabel
