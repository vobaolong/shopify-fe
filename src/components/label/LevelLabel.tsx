import { useTranslation } from 'react-i18next'
import { Badge, Tooltip } from 'antd'
import { LevelType } from '../../@types/entity.types'
import { ShieldCheckIcon } from 'lucide-react'

interface LevelLabelProps {
  level: LevelType
  detail?: boolean
}

const LevelLabel = ({ level, detail = true }: LevelLabelProps) => {
  const { t } = useTranslation()

  const tooltipContent = detail ? (
    <div className='text-sm'>
      {t('userLabel.pointFloor')}: {level.minPoint} - {t('userLabel.discount')}:{' '}
      {level.discount && level.discount.$numberDecimal}%
    </div>
  ) : (
    <div className='text-sm'>{t(`${level.name}`)}</div>
  )

  return (
    <Tooltip title={tooltipContent}>
      <Badge
        className='inline-block select-none cursor-default'
        style={{ backgroundColor: level.color }}
        count={
          <div className='flex items-center px-2 py-1 rounded text-white'>
            <i className='fa-solid fa-shield-halved' />
            {detail && <span> {t(`${level.name}`)}</span>}
          </div>
        }
      />
    </Tooltip>
  )
}

export default LevelLabel
