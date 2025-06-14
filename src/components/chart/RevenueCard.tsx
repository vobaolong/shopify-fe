import React from 'react'
import { Card, Statistic, Tooltip } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  LineChartOutlined
} from '@ant-design/icons'

interface RevenueCardProps {
  totalRevenue: number
  lastWeekRevenue: number
  percentageChange: number
  title: string
}

const RevenueCard: React.FC<RevenueCardProps> = ({
  totalRevenue,
  lastWeekRevenue,
  percentageChange,
  title
}) => {
  const isPositive = percentageChange >= 0

  return (
    <Card>
      <div className='min-h-[140px] flex flex-col justify-center'>
        <Statistic
          title={
            <div className='flex items-center justify-between mb-2'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                  <i className='fa-solid fa-dollar-sign text-green-600 text-lg' />
                </div>
                <span className='text-green-800 font-semibold text-lg'>
                  {title}
                </span>
              </div>
              <Tooltip title='Biểu đồ xu hướng doanh thu'>
                <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors cursor-pointer'>
                  <LineChartOutlined className='text-green-600' />
                </div>
              </Tooltip>
            </div>
          }
          value={totalRevenue}
          precision={0}
          suffix={
            <div className='flex flex-col items-end gap-2 ml-4'>
              <span className='text-green-600 font-semibold text-sm'>VND</span>
              {lastWeekRevenue !== undefined && (
                <Tooltip
                  title={`So với tuần trước: ${lastWeekRevenue.toLocaleString()} VND`}
                >
                  <div
                    className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                    transition-all duration-200 hover:scale-105 cursor-pointer
                    ${
                      isPositive
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }
                  `}
                  >
                    {isPositive ? (
                      <ArrowUpOutlined className='text-xs' />
                    ) : (
                      <ArrowDownOutlined className='text-xs' />
                    )}
                    <span className='font-bold'>
                      {Math.abs(percentageChange).toFixed(1)}%
                    </span>
                  </div>
                </Tooltip>
              )}
            </div>
          }
          valueStyle={{
            color: '#059669',
            fontSize: '32px',
            fontWeight: '900'
          }}
          formatter={(value) => value?.toLocaleString()}
        />
      </div>
    </Card>
  )
}

export default RevenueCard
