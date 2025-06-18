import React, { useState } from 'react'
import { Row, Col, Spin, Alert, DatePicker, Card } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs, { Dayjs } from 'dayjs'
import { StatisticsOptions, FlagOption } from '../../@types/statistics.type'
import { useStatistics } from '../../hooks/useStatistics'
import StatisticsGrid from './StatisticsGrid'
import RevenueCard from './RevenueCard'
import ChartSection from './ChartSection'
import { Role } from '../../enums/OrderStatus.enum'
import { Typography } from 'antd/lib'
import RecentOrdersTable from './RecentOrdersTable'
import DataTable from './DataTable'

const { RangePicker } = DatePicker

interface ListStatisticsItemsProps {
  by: Role
  storeId?: string
}

const ListStatisticsItems: React.FC<ListStatisticsItemsProps> = ({
  by,
  storeId
}) => {
  const { t } = useTranslation()
  const { Title, Text } = Typography
  const [options, setOptions] = useState<StatisticsOptions>({
    flag: 'orders',
    by: 'hours',
    sliceEnd: 6,
    type: 'line',
    dateRange: null
  })
  const { data, isLoading, error } = useStatistics(
    by,
    storeId,
    options.dateRange
  )

  const flagOptions: FlagOption[] = [
    {
      value: 'orders',
      label: t('admin.orders'),
      icon: <i className='fa-solid fa-cart-shopping text-blue-500' />
    },
    {
      value: 'products',
      label: t('admin.products'),
      icon: <i className='fa-solid fa-box text-green-500' />
    },
    ...(by === Role.ADMIN
      ? [
          {
            value: 'users',
            label: t('admin.users'),
            icon: <i className='fa-solid fa-users text-yellow-500' />
          },
          {
            value: 'stores',
            label: t('admin.stores'),
            icon: <i className='fa-solid fa-store text-purple-500' />
          }
        ]
      : [])
  ]

  const handleOptionChange = (flag: string) => {
    setOptions((prev) => ({ ...prev, flag }))
  }
  const handleOptionsChange = (newOptions: StatisticsOptions) => {
    setOptions(newOptions)
  }

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      const dateRange: [string, string] = [
        dates[0].startOf('day').toISOString(),
        dates[1].endOf('day').toISOString()
      ]
      setOptions((prev) => ({ ...prev, dateRange }))
    } else {
      setOptions((prev) => ({ ...prev, dateRange: null }))
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Spin size='large' />
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        message={error.message || 'Lỗi tải dữ liệu'}
        description={String(error)}
        type='error'
        showIcon
        className='mb-6'
      />
    )
  }

  if (!data) {
    return (
      <Alert
        message='Không có dữ liệu'
        description='Không thể tải dữ liệu thống kê'
        type='warning'
        showIcon
        className='mb-6'
      />
    )
  }

  const currentItems = (data.items as any)[options.flag] || []

  return (
    <div className='!space-y-6 min-h-screen'>
      <div className='flex items-center gap-4 justify-between'>
        <Title level={5} className='!mb-0'>
          Good Morning! <br />
          <Text className='!text-sm font-normal !text-gray-500'>
            Here's what's happening with your store today.
          </Text>
        </Title>

        <RangePicker
          value={
            options.dateRange
              ? [dayjs(options.dateRange[0]), dayjs(options.dateRange[1])]
              : null
          }
          onChange={handleDateRangeChange}
          format='DD-MM-YYYY'
          placeholder={[
            t('filters.fromDate') || 'Ngày bắt đầu',
            t('filters.toDate') || 'Ngày kết thúc'
          ]}
          allowClear
          className='w-80'
        />
      </div>
      <StatisticsGrid
        data={data}
        options={options}
        flagOptions={flagOptions}
        onOptionChange={handleOptionChange}
      />
      {/* <Row>
        <Col span={24}>
          <RevenueCard
            totalRevenue={data.totalRevenue || 0}
            lastWeekRevenue={data.lastWeekRevenue || 0}
            percentageChange={revenuePercentageChange}
            title={t('totalRevenue') || 'Tổng doanh thu'}
          />
        </Col>
      </Row> */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <ChartSection
            options={options}
            onOptionsChange={handleOptionsChange}
            items={currentItems}
            by={by}
          />
        </Col>
        <Col xs={24} lg={8}>
          <DataTable
            options={options}
            items={currentItems}
            by={by}
            storeId={storeId}
          />
        </Col>
      </Row>{' '}
      <Row>
        <Col span={16}>
          <Card className='shadow-md'>
            <RecentOrdersTable by={by} storeId={storeId} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ListStatisticsItems
