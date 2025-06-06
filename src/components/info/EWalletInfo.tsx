import { useTranslation } from 'react-i18next'
import { formatPrice } from '../../helper/formatPrice'

interface EWalletInfoProps {
  eWallet?: number
}

const EWalletInfo = ({ eWallet = 0 }: EWalletInfoProps) => {
  const { t } = useTranslation()

  return (
    <div className='inline-flex justify-start items-center text-gray-800 text-xl'>
      <span className='text-base'>{t('myBalance')}: </span>
      <span className='mx-2'>
        {formatPrice(eWallet)}
        <sup>₫</sup>
      </span>
    </div>
  )
}
export default EWalletInfo
