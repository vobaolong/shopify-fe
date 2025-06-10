/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getToken } from '../../apis/auth.api'
import { listOrdersByStore } from '../../apis/order.api'
import { humanReadableDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import { useQuery } from '@tanstack/react-query'
import {
  Spin,
  Alert,
  Table,
  Button,
  Tooltip,
  Tabs,
  Select,
  DatePicker,
  Divider,
  Typography,
  Empty,
  Drawer
} from 'antd'
import OrderStatusLabel from '../label/OrderStatusLabel'
import OrderPaymentLabel from '../label/OrderPaymentLabel'
import UserSmallCard from '../card/UserSmallCard'
import { useTranslation } from 'react-i18next'
import { ColumnsType } from 'antd/es/table'
import { EyeOutlined, SyncOutlined } from '@ant-design/icons'
import SearchInput from '../ui/SearchInput'
import { OrderStatus } from '../../enums/OrderStatus.enum'
import { PaginationType } from '../../@types/pagination.type'
import OrderDetailInfo from '../info/OrderDetailInfo'
import { Dayjs } from 'dayjs'

interface OrderType {
  _id: string
  createdAt: string
  userId: any
  storeId: any
  amountFromUser?: { $numberDecimal: number }
  amountToStore?: { $numberDecimal: number }
  amountToPlatform?: { $numberDecimal: number }
  shippingFee?: { $numberDecimal: number }
  isPaidBefore?: boolean
  status?: string
}

interface OrderFilter {
  search: string
  sortBy: string
  order: string
  status: string
  isPaidBefore?: string
  limit: number
  page: number
  createdAtFrom?: string
  createdAtTo?: string
}

interface SellerOrdersTableProps {
  storeId?: string
  isEditable?: boolean
}

const SellerOrdersTable = ({ storeId = '' }: SellerOrdersTableProps) => {
  const { t } = useTranslation()
  const { Text } = Typography
  const [filter, setFilter] = useState<OrderFilter>({
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    status: status || '',
    isPaidBefore: 'all',
    limit: 5,
    page: 1,
    createdAtFrom: undefined,
    createdAtTo: undefined
  })
  const [pendingFilter, setPendingFilter] = useState<OrderFilter>(filter)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders', filter, storeId],
    queryFn: async () => {
      const res = await listOrdersByStore(storeId, filter)
      return res.data || res
    }
  })

  const orders: OrderType[] = data?.orders || []
  const pagination: PaginationType = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page,
    pageCount: data?.filter?.pageCount || 1
  }

  const handleSearch = () => {
    setFilter({ ...pendingFilter })
  }

  const handleChangeKeyword = (keyword: string) => {
    setPendingFilter({
      ...pendingFilter,
      search: keyword,
      page: 1
    })
  }

  const handleDateRangeChange = (
    dates: any,
    _dateStrings: [string, string]
  ) => {
    setDateRange(dates)
    setPendingFilter({
      ...pendingFilter,
      createdAtFrom:
        dates && dates[0] ? dates[0].startOf('day').toISOString() : undefined,
      createdAtTo:
        dates && dates[1] ? dates[1].endOf('day').toISOString() : undefined,
      page: 1
    })
  }

  const handlePaidChange = (value: string) => {
    setPendingFilter({
      ...pendingFilter,
      isPaidBefore: value,
      page: 1
    })
  }

  const handleTableChange = (
    paginationConfig: any,
    _filters: any,
    sorter: any
  ) => {
    setFilter((prev) => ({
      ...prev,
      page: paginationConfig.current || 1,
      limit: paginationConfig.pageSize || prev.limit,
      sortBy: sorter.field || prev.sortBy,
      order:
        sorter.order === 'ascend'
          ? 'asc'
          : sorter.order === 'descend'
            ? 'desc'
            : prev.order
    }))
  }

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      status: status || ''
    }))
  }, [status])

  const columns: ColumnsType<OrderType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 60,
      fixed: 'left',
      render: (_: any, __: any, idx: number) =>
        (pagination.pageCurrent - 1) * filter.limit + idx + 1
    },
    {
      title: t('orderDetail.id'),
      dataIndex: '_id',
      key: '_id',
      width: 150,
      render: (id: string) => (
        <Text className='uppercase'>#{id.slice(-10).toUpperCase()}</Text>
      )
    },
    {
      title: t('orderDetail.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'right',
      sorter: true,
      width: 150,
      render: (date: string) => <Text>{humanReadableDate(date)}</Text>
    },
    {
      title: t('orderDetail.total'),
      dataIndex: 'amountFromUser',
      key: 'amountFromUser',
      align: 'right',
      sorter: true,
      width: 150,
      render: (amount: { $numberDecimal: number }) => (
        <Text className='whitespace-nowrap'>
          {formatPrice(amount?.$numberDecimal)}
          <sup> ₫</sup>
        </Text>
      )
    },
    {
      title: t('orderDetail.buyer'),
      dataIndex: 'userId',
      key: 'userId',
      width: 200,
      render: (userId: any) => (
        <div>
          <UserSmallCard user={userId} isAvatar={false} />
        </div>
      )
    },
    {
      title: t('orderDetail.commission'),
      dataIndex: 'amountToPlatform',
      key: 'amountToPlatform',
      align: 'right',
      sorter: true,
      width: 150,
      render: (amount: { $numberDecimal: number }) => (
        <Text className='whitespace-nowrap'>
          {amount && formatPrice(amount.$numberDecimal)}
          <sup> ₫</sup>
        </Text>
      )
    },
    {
      title: t('orderDetail.profit'),
      dataIndex: 'amountToStore',
      key: 'amountToStore',
      align: 'right',
      sorter: true,
      width: 150,
      render: (amount: { $numberDecimal: number }) => (
        <Text className='whitespace-nowrap'>
          {amount && formatPrice(amount.$numberDecimal)}
          <sup> ₫</sup>
        </Text>
      )
    },
    {
      title: t('orderDetail.deliveryUnit'),
      dataIndex: 'shippingFee',
      key: 'shippingFee',
      align: 'right',
      render: (fee: { $numberDecimal: number }) => (
        <div>
          <Text italic>Giao hàng nhanh</Text>
          <br />
          <Text>
            {formatPrice(fee?.$numberDecimal)}
            <sup> ₫</sup>
          </Text>
        </div>
      )
    },
    {
      title: t('orderDetail.payment'),
      dataIndex: 'isPaidBefore',
      key: 'isPaidBefore',
      sorter: true,
      width: 150,
      render: (isPaidBefore: boolean) => (
        <OrderPaymentLabel isPaidBefore={isPaidBefore} />
      )
    },
    {
      title: t('status.status'),
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      align: 'center',
      width: 120,
      render: (status: string) => <OrderStatusLabel status={status} />
    },
    {
      title: t('action'),
      key: 'action',
      fixed: 'right',
      render: (_: any, record: OrderType) => (
        <Tooltip title={t('button.detail')}>
          <Button
            type='primary'
            onClick={() => {
              setSelectedOrderId(record._id)
              setDrawerOpen(true)
            }}
            icon={<EyeOutlined />}
          />
        </Tooltip>
      )
    }
  ]

  const orderStatusTabs = [
    { key: '', label: t('title.allOrders') },
    { key: OrderStatus.PENDING, label: t('title.notProcessedOrders') },
    { key: OrderStatus.PROCESSING, label: t('title.processingOrders') },
    { key: OrderStatus.SHIPPED, label: t('title.shippedOrders') },
    { key: OrderStatus.DELIVERED, label: t('title.deliveredOrders') },
    { key: OrderStatus.CANCELLED, label: t('title.cancelledOrders') },
    { key: OrderStatus.RETURNED, label: t('title.returnedOrders') }
  ]

  const searchFieldOptions = [
    { label: t('orderDetail.id'), value: 'orderId' },
    { label: t('orderDetail.buyer'), value: 'buyerName' }
  ]

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedOrderId(null)
  }

  return (
    <div className='w-full'>
      {isError && (
        <Alert message='Server Error' type='error' showIcon className='mb-2' />
      )}
      <div className='p-3 bg-white rounded-md'>
        <Tabs
          activeKey={filter.status}
          onChange={(key) =>
            setFilter((prev) => ({ ...prev, status: key, page: 1 }))
          }
          items={orderStatusTabs}
        />

        <div className='flex gap-3 items-center flex-wrap mb-3'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
            fieldOptions={searchFieldOptions}
          />
          <Select
            style={{ minWidth: 140 }}
            value={pendingFilter.isPaidBefore || undefined}
            onChange={handlePaidChange}
            options={[
              { label: t('filters.all'), value: 'all' },
              { label: t('orderDetail.onlinePayment'), value: 'true' },
              { label: t('orderDetail.cod'), value: 'false' }
            ]}
            placeholder={t('orderDetail.payment')}
            allowClear
          />
          <DatePicker.RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            className='min-w-[240px]'
            allowClear
            format='DD-MM-YYYY'
            placeholder={[t('filters.fromDate'), t('filters.toDate')]}
          />
          <Button type='primary' onClick={handleSearch}>
            {t('search')}
          </Button>
          <Button
            onClick={() => refetch()}
            className='!w-10 flex items-center justify-center'
            type='default'
            loading={isLoading}
            icon={<SyncOutlined spin={isLoading} />}
          />
        </div>

        <Divider />

        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey='_id'
            pagination={{
              current: pagination.pageCurrent,
              total: pagination.size,
              pageSize: filter.limit,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              pageSizeOptions: ['5', '10', '20', '50']
            }}
            onChange={handleTableChange}
            locale={{
              emptyText: <Empty description={t('orderDetail.noOrder')} />
            }}
            scroll={{ x: 'max-content' }}
            bordered
          />
        </Spin>
      </div>
      <Drawer
        title={t('orderDetail.quickview')}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        width={600}
        destroyOnHidden
      >
        {selectedOrderId && (
          <OrderDetailInfo
            orderId={selectedOrderId}
            by='store'
            storeId={storeId}
          />
        )}
      </Drawer>
    </div>
  )
}

export default SellerOrdersTable
