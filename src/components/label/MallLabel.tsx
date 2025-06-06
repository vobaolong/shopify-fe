import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const MallLabel = () => {
  const { t } = useTranslation()
  return (
    <Tag color='processing' icon={<CheckCircleOutlined />} className='text-sm'>
      {t('productDetail.mall')}
    </Tag>
  )
}

export default MallLabel
