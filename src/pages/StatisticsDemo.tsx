import React from 'react'
import { Card } from 'antd'
import ListStatisticsItems from '../components/chart/ListStatisticsItems'

const StatisticsDemo: React.FC = () => {
  return (
    <div className='p-6'>
      <Card title='Statistics with Date Range Filter - Admin View'>
        <ListStatisticsItems by='admin' />
      </Card>

      <div className='mt-8'>
        <Card title='Statistics with Date Range Filter - Store View'>
          <ListStatisticsItems by='store' storeId='store123' />
        </Card>
      </div>
    </div>
  )
}

export default StatisticsDemo
