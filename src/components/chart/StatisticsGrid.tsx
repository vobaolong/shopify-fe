import React from 'react'
import { Row, Col } from 'antd'
import {
  AdminStats,
  SellerStats,
  FlagOption,
  StatisticsOptions
} from '../../@types/statistics.type'
import { getChartIcon } from '../../utils/statisticsUtils'
import StatisticCard from './StatisticCard'

interface StatisticsGridProps {
  data: AdminStats | SellerStats
  options: StatisticsOptions
  flagOptions: FlagOption[]
  onOptionChange: (flag: string) => void
}

const StatisticsGrid: React.FC<StatisticsGridProps> = ({
  data,
  options,
  flagOptions,
  onOptionChange
}) => {
  return (
    <Row gutter={[16, 16]} className='mb-6 min-h-[140px]'>
      {flagOptions.map((option) => {
        const currentValue = (data.sizes as any)[option.value] || 0
        const chartIcon = getChartIcon(option.value)
        return (
          <Col xs={24} sm={12} lg={6} key={option.value} className='flex'>
            <div className='w-full'>
              <StatisticCard
                option={option}
                value={currentValue}
                isSelected={options.flag === option.value}
                chartIcon={chartIcon}
                onClick={() => onOptionChange(option.value)}
              />
            </div>
          </Col>
        )
      })}
    </Row>
  )
}

export default StatisticsGrid
