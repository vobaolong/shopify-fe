import { useTranslation } from 'react-i18next'

interface ShowResultProps {
  limit?: number
  size?: number
  pageCurrent?: number
}

const ShowResult: React.FC<ShowResultProps> = ({
  limit = 0,
  size = 0,
  pageCurrent = 1
}) => {
  const { t } = useTranslation()
  return (
    <span
      style={{ fontSize: '0.85rem' }}
      className='text-nowrap text-secondary'
    >
      {t('showing')} <b>{Math.min(limit, size - limit * (pageCurrent - 1))}</b>{' '}
      {t('of')} <b>{size}</b> {t('result')}
    </span>
  )
}

export default ShowResult
