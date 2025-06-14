import React from 'react'
import { Card } from 'antd'
import { FlagOption } from '../../@types/statistics.type'
import { Link } from 'react-router-dom'

interface StatisticCardProps {
  option: FlagOption
  value: number
  isSelected: boolean
  percentageChange: number
  lastWeekValue: number
  chartIcon: React.ReactNode
  onClick: () => void
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  option,
  value,
  isSelected,
  percentageChange,
  chartIcon,
  onClick
}) => {
  const isPositive = percentageChange >= 0

  return (
    <Card
      className={`min-h-[140px] cursor-pointer transition-all duration-300 relative overflow-hidden
        ${isSelected ? 'transform border border-blue-700' : 'hover:transform hover:-translate-y-1 hover:shadow-sm'}
      `}
      onClick={onClick}
    >
      <div className='flex flex-col h-full justify-between min-h-[108px]'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-gray-500 text-sm font-medium uppercase tracking-wide'>
            {option.label}
          </span>
          <div
            className={`
              flex items-center gap-1 text-sm font-medium
              ${
                percentageChange === 999
                  ? 'text-blue-600'
                  : isPositive
                    ? 'text-green-500'
                    : 'text-red-500'
              }
            `}
          >
            {isPositive ? '↗' : '↘'}
            <span>{Math.abs(percentageChange).toFixed(2)}%</span>
          </div>
        </div>
        <div className='flex items-end justify-between'>
          <div className='flex flex-col justify-between'>
            <span className='text-3xl font-bold text-gray-700 mb-3'>
              {value?.toLocaleString()}
            </span>
            <Link
              to={`/admin/${option.value.toLowerCase()}`}
              className=' text-gray-500 hover:text-blue-600 transition-colors'
            >
              Xem tất cả {option.value.toLowerCase()}
            </Link>
          </div>
          <div className='rounded-md'>{chartIcon}</div>
        </div>
      </div>
    </Card>
  )
}

export default StatisticCard
