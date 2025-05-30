import { useTranslation } from 'react-i18next'
import { Progress } from 'antd'

interface UserLevel {
  name: string
  color: string
}

interface UserRankInfoProps {
  user: {
    point: number
    level?: UserLevel
    userName?: string
    name?: string
  }
  border?: boolean
}

const determineRank = (points: number) => {
  if (points < 20) {
    return { nextRank: 'Silver', nextRankPoints: 20 }
  } else if (points < 100) {
    return { nextRank: 'Gold', nextRankPoints: 100 }
  } else if (points < 1000) {
    return { nextRank: 'Diamond', nextRankPoints: 1000 }
  } else {
    return { nextRank: '', nextRankPoints: 1000 }
  }
}

const UserRankInfo: React.FC<UserRankInfoProps> = ({ user, border = true }) => {
  const { t } = useTranslation()
  const { nextRank, nextRankPoints } = determineRank(user.point || 0)
  const previousRankPoints =
    nextRankPoints === 20
      ? 0
      : nextRankPoints === 100
        ? 20
        : nextRankPoints === 1000
          ? 100
          : 1000
  const progress =
    nextRankPoints !== null
      ? ((user.point - previousRankPoints) /
          (nextRankPoints - previousRankPoints)) *
        100
      : 100

  return (
    <div className={`bg-[${user.level?.color || '#fff'}]`}>
      <div className='flex flex-col text-white'>
        <h4 className='uppercase mb-0'>{t(`${user.level?.name || ''}`)}</h4>
        <span>{`${user.userName || ''} ${user.name || ''}`}</span>
      </div>
      <div className='rounded-lg bg-white p-3 mt-2 grid gap-2'>
        {user.point < 1000 && (
          <span className='text-blue-600'>
            Để nâng cấp thứ hạng thẻ tiếp theo
          </span>
        )}
        <span>Đơn hàng</span>
        <span>
          <span className='text-blue-600'>{user.point}</span>/{nextRankPoints}
        </span>
        <div className='flex items-center'>
          <Progress
            className='w-[90%]'
            percent={progress}
            status='active'
            showInfo={false}
            strokeColor={{ from: '#fadb14', to: '#fa8c16' }}
          />
          <div className='ml-2 text-right'>{t(`${nextRank}`)}</div>
        </div>
      </div>
    </div>
  )
}

export default UserRankInfo
