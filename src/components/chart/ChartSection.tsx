import React from 'react'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { StatisticsOptions } from '../../@types/statistics.type'
import LineChart from './LineChart'
import BarChart from './BarChart'
import DropDownMenu from '../ui/DropDownMenu'
import { groupByDate, groupByJoined, groupBySold } from '../../helper/groupBy'
import { Role } from '../../enums/OrderStatus.enum'

interface ChartSectionProps {
  options: StatisticsOptions
  onOptionsChange: (newOptions: StatisticsOptions) => void
  items: any[]
  by: Role
}

const ChartSection: React.FC<ChartSectionProps> = ({
  options,
  onOptionsChange,
  items,
  by
}) => {
  const { t } = useTranslation()
  const titles: Record<string, string> = {
    orders: t('admin.dashboard.salesStatisticsByOrders'),
    products: t('admin.dashboard.statisticsByProducts'),
    users: t('admin.dashboard.statisticsNewUser'),
    stores: t('admin.dashboard.statisticsNewStore')
  }

  const groupByFunc: Record<string, any> = {
    orders: groupByDate,
    products: groupBySold,
    users: groupByJoined,
    stores: groupByJoined
  }

  const timeRangeOptions = [
    {
      label: t('admin.dashboard.hour'),
      value: 'hours'
    },
    {
      label: t('admin.dashboard.day'),
      value: 'date'
    },
    {
      label: t('admin.dashboard.month'),
      value: 'month'
    },
    {
      label: t('admin.dashboard.year'),
      value: 'year'
    }
  ]

  const productLimitOptions = [
    { label: `5 ${t('admin.products')}`, value: '5' },
    { label: `10 ${t('admin.products')}`, value: '10' },
    { label: `50 ${t('admin.products')}`, value: '50' },
    { label: `100 ${t('admin.products')}`, value: '100' }
  ]
  const chartTypeOptions = [
    {
      label: t('admin.dashboard.line'),
      value: 'line'
    },
    {
      label: t('admin.dashboard.bar'),
      value: 'bar'
    }
  ]

  return (
    <div className='relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
      {' '}
      <div className='absolute top-4 right-4 z-10'>
        <Form className='flex gap-2'>
          {options.flag !== 'products' ? (
            <DropDownMenu
              listItem={timeRangeOptions}
              value={options.by}
              setValue={(value) => onOptionsChange({ ...options, by: value })}
              borderBtn={false}
            />
          ) : (
            <DropDownMenu
              listItem={productLimitOptions}
              value={options.sliceEnd.toString()}
              setValue={(value) =>
                onOptionsChange({
                  ...options,
                  sliceEnd: parseInt(value, 10)
                })
              }
              borderBtn={false}
            />
          )}

          <DropDownMenu
            listItem={chartTypeOptions}
            value={options.type}
            setValue={(value) => onOptionsChange({ ...options, type: value })}
            borderBtn={false}
          />
        </Form>
      </div>{' '}
      <div className='p-6 pt-16'>
        {options.type === 'line' && (
          <LineChart
            by={options.by}
            items={items as any}
            groupBy={groupByFunc[options.flag]}
            title={titles[options.flag]}
            sliceEnd={options.sliceEnd}
            value={options.flag}
            role={by}
          />
        )}
        {options.type === 'bar' && (
          <BarChart
            by={options.by}
            items={items as any}
            groupBy={groupByFunc[options.flag]}
            title={titles[options.flag]}
            sliceEnd={options.sliceEnd}
            value={options.flag}
            role={by}
          />
        )}
      </div>
    </div>
  )
}

export default ChartSection
