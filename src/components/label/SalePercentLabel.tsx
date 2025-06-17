import { Tag } from 'antd'
import { useTranslation } from 'react-i18next'

const SalePercentLabel = ({ salePercent }: { salePercent: number }) => {
  const { t } = useTranslation()
  return (
    <Tag color='red' className='!border-none'>
      -{salePercent}%{/* {t('productDetail.sale')} */}
    </Tag>
  )
}

export default SalePercentLabel
