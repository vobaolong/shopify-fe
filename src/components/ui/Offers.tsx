import refundImg from '../../assets/refund.svg'
import returnImg from '../../assets/return.svg'
import checkImg from '../../assets/package.svg'
import { useTranslation } from 'react-i18next'

const Offers = () => {
  const { t } = useTranslation()

  return (
    <div className='mb-4 text-dark-emphasis flex res-hide res-flex-column justify-content-between gap-1 bg-white rounded-2 box-shadow p-3'>
      <div
        style={{ flex: 1 }}
        className='flex items-center justify-content-center'
      >
        <img
          src={refundImg}
          className='me-2'
          style={{ width: '10%' }}
          width='30'
          height='30'
          loading='eager'
          alt='Refund service'
        />
        <span className=''>{t('services.refund')}</span>
      </div>
      <div
        style={{ flex: 1 }}
        className='flex items-center justify-content-center'
      >
        <img
          src={returnImg}
          className='me-2'
          style={{ width: '10%' }}
          width='30'
          height='30'
          loading='eager'
          alt='Return service'
        />
        <span>{t('services.return')}</span>
      </div>
      <div
        style={{ flex: 1 }}
        className='flex items-center justify-content-center'
      >
        <img
          src={checkImg}
          className='me-2'
          style={{ width: '10%' }}
          width='30'
          height='30'
          loading='eager'
          alt='Check package service'
        />
        <span>{t('services.checkPackage')}</span>
      </div>
    </div>
  )
}

export default Offers
