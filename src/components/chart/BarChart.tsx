import { useState, useEffect } from 'react'
import { groupByDate } from '../../helper/groupBy'
import { useTranslation } from 'react-i18next'
import { Role } from '../../enums/OrderStatus.enum'
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import {
  formatChartPriceWithCurrency,
  formatThousands
} from '../../utils/formats'
import { useCurrency } from '../../provider/CurrencyProvider'

const BarChart = ({
  by = 'hours',
  items = [],
  role = Role.ADMIN,
  groupBy = groupByDate,
  title = 'Sales statistics',
  sliceEnd = 6,
  value = ''
}) => {
  const [chartData, setChartData] = useState<any[]>([])
  const { t } = useTranslation()
  const { currency } = useCurrency()

  // Format function for tooltip
  const formatTooltip = (tooltipValue: any, name: string) => {
    if (value === 'orders' && typeof tooltipValue === 'number') {
      return [formatChartPriceWithCurrency(tooltipValue, 'VND', currency), name]
    }
    return [formatThousands(tooltipValue), name]
  }

  // Format function for Y-axis
  const formatYAxis = (yValue: number) => {
    if (value === 'orders') {
      return formatChartPriceWithCurrency(yValue, 'VND', currency)
    }
    return formatThousands(yValue)
  }

  useEffect(() => {
    const newData = groupBy(items, by, role)

    // Format data for Recharts
    const formattedData = newData.map((item: any) => {
      const dataPoint: Record<string, any> = {
        name: item[0],
        value: item[1]
      }

      // Add commission data for seller role
      if (role === Role.SELLER) {
        dataPoint.commission = item[2]
      }

      return dataPoint
    })

    setChartData(formattedData)
  }, [items, by, role, sliceEnd])

  return (
    <div className='bg-body box-shadow rounded w-100'>
      <h5 className='text-capitalize border-bottom p-3 text-start'>
        {value} {t('breadcrumbs.overview')}
      </h5>
      <div className='p-3'>
        <ResponsiveContainer width='100%' height={300}>
          <RechartsBarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 30
            }}
          >
            {' '}
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
            <XAxis dataKey='name' tick={{ fontSize: 12 }} hide />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatYAxis} />
            <Tooltip formatter={formatTooltip} />
            <Legend verticalAlign='bottom' height={36} />
            <Bar
              dataKey='value'
              name={title}
              fill='#3b82f6'
              radius={[4, 4, 0, 0]}
              stackId='a'
            />
            {role === Role.SELLER && (
              <Bar
                dataKey='commission'
                name='Chiết khấu'
                fill='#ffbbbb'
                radius={[4, 4, 0, 0]}
                stackId='a'
              />
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChart
