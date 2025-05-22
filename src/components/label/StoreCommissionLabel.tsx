import { useTranslation } from 'react-i18next'
import { CommissionType } from '../../@types/entity.types'

const StoreCommissionLabel = ({
  commission
}: {
  commission: CommissionType
}) => {
  const { t } = useTranslation()
  return (
    <span className='position-relative d-inline-block default'>
      <span className='badge border bg-dark-rgba rounded-1 cus-tooltip text-muted'>
        {commission.name}
      </span>
      <small className='cus-tooltip-msg'>
        {t('storeDetail.commissions')}: {commission.fee?.$numberDecimal}%/
        {t('order')}
      </small>
    </span>
  )
}
export default StoreCommissionLabel
