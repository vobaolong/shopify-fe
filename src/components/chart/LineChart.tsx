import { useState, useEffect } from 'react'
import { groupByDate } from '../../helper/groupBy'
import { useTranslation } from 'react-i18next'
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { Role } from '../../enums/OrderStatus.enum'
import {
  formatChartPriceWithCurrency,
  formatThousands
} from '../../utils/formats'
import { useCurrency } from '../../provider/CurrencyProvider'

const LineChart = ({
  by = 'hours',
  items = [],
  role = 'admin',
  groupBy = groupByDate,
  title = 'Sales statistics',
  sliceEnd = 6,
  value = ''
}) => {
  const [chartData, setChartData] = useState<any[]>([])
  const { t } = useTranslation()
  const { currency } = useCurrency()

  const formatTooltip = (tooltipValue: any, name: string) => {
    if (value === 'orders' && typeof tooltipValue === 'number') {
      return [formatChartPriceWithCurrency(tooltipValue, 'VND', currency), name]
    }
    return [formatThousands(tooltipValue), name]
  }

  const formatYAxis = (yValue: number) => {
    if (value === 'orders') {
      return formatChartPriceWithCurrency(yValue, 'VND', currency)
    }
    return formatThousands(yValue)
  }

  useEffect(() => {
    const newData = groupBy(items, by, role)
    const formattedData =
      newData?.map((item) => {
        const dataPoint: Record<string, any> = {
          name: item[0],
          value: item[1]
        }
        if (role === Role.SELLER && value === 'orders') {
          dataPoint.commission = item[2]
        }
        return dataPoint
      }) || []

    setChartData(formattedData)
  }, [items, by, role, sliceEnd, value])

  return (
    <div className='bg-white shadow rounded w-100'>
      <h5 className='capitalize border-b-gray-100 border-b p-3 text-start'>
        {t('breadcrumbs.overview')} {t(`${value}`)}
      </h5>
      <ResponsiveContainer width='100%' height={300}>
        <RechartsLineChart
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
          <XAxis dataKey='name' tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={formatYAxis} />
          <Tooltip formatter={formatTooltip} />
          <Legend verticalAlign='bottom' height={36} />
          <Line
            type='monotone'
            dataKey='value'
            name={title}
            stroke='#3b82f6'
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 2 }}
          />
          {role === Role.SELLER && value === 'orders' && (
            <Line
              type='monotone'
              dataKey='commission'
              name='Chiết khấu'
              stroke='#F66'
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 2 }}
            />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LineChart
