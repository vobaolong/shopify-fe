import { Button, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '../../provider/CurrencyProvider'

const CurrencyToggle = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const { currency, toggleCurrency } = useCurrency()

  return (
    <Tooltip
      title={t('currency.switchTo', {
        currency: currency === 'VND' ? 'USD' : 'VND'
      })}
    >
      <Button
        type='text'
        onClick={toggleCurrency}
        className={`text-white flex align-center justify-center p-2 ${className}`}
      >
        <span className='fw-bold'>{currency}</span>
      </Button>
    </Tooltip>
  )
}

export default CurrencyToggle
