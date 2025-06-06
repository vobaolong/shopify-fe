import { useTranslation } from 'react-i18next'

const SalePercentLabel = ({ salePercent }: { salePercent: number }) => {
  const { t } = useTranslation()
  return (
    <small
      className='badge bg-danger rounded-1 text-center ms-3'
      style={{ width: '70px' }}
    >
      <small className='flex justify-content-center'>
        {salePercent}% {t('productDetail.sale')}
      </small>
    </small>
  )
}

export default SalePercentLabel
