import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import { listOrdersByUser } from '../../apis/order.api'
import { formatPrice } from '../../helper/formatPrice'
import { humanReadableDate } from '../../helper/humanReadable'
import StoreSmallCard from '../card/StoreSmallCard'
import OrderStatusLabel from '../label/OrderStatusLabel'
import OrderPaymentLabel from '../label/OrderPaymentLabel'
import SearchInput from '../ui/SearchInput'
import { useTranslation } from 'react-i18next'
import noItem from '../../assets/noItem.png'
import { Table, Spin, Alert, Button, Typography, Empty } from 'antd'
import { EyeOutlined, SyncOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { ColumnsType } from 'antd/es/table'
import { OrderType } from '../../@types/entity.types'

const { Text, Title } = Typography

interface UserOrdersTableProps {
  heading?: boolean
  status?: string
}

const UserOrdersTable: React.FC<UserOrdersTableProps> = ({
  heading = true,
  status = ''
}) => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState({
    search: '',
    status,
    sortBy: 'createdAt',
    order: 'desc',
    limit: 10,
    page: 1
  })
  const [pendingFilter, setPendingFilter] = useState({
    search: '',
    status,
    sortBy: 'createdAt',
    order: 'desc',
    limit: 10,
    page: 1
  })

  const { _id } = getToken()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userOrders', _id, filter],
    queryFn: () => listOrdersByUser(_id, filter),
    enabled: !!_id
  })

  const orders = data?.orders || []
  const pagination = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || 1,
    pageCount: data?.filter?.pageCount || 1
  }

  const handleChangeKeyword = (keyword: string) => {
    setPendingFilter({
      ...pendingFilter,
      search: keyword,
      page: 1
    })
  }

  const handleSearch = () => {
    setFilter({ ...pendingFilter })
  }

  const handleChangePage = (newPage: number) => {
    setFilter({
      ...filter,
      page: newPage
    })
  }

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    setFilter({
      ...filter,
      sortBy: sorter.field || filter.sortBy,
      order:
        sorter.order === 'ascend'
          ? 'asc'
          : sorter.order === 'descend'
            ? 'desc'
            : filter.order
    })
  }

  const getStatusTitle = () => {
    if (status === 'Pending|Processing|Shipped|Delivered|Cancelled|Returned') {
      return t('title.allOrders')
    }
    if (status === 'Pending') return t('title.notProcessedOrders')
    if (status === 'Processing') return t('title.processingOrders')
    if (status === 'Shipped') return t('title.shippedOrders')
    if (status === 'Delivered') return t('title.deliveredOrders')
    if (status === 'Cancelled') return t('title.cancelledOrders')
    if (status === 'Returned') return t('title.ReturnOrders')
    return ''
  }

  const columns: ColumnsType<OrderType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      fixed: 'left',
      width: 60,
      render: (_: any, __: any, index: number) =>
        index + 1 + (pagination.pageCurrent - 1) * filter.limit
    },
    {
      title: t('orderDetail.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (createdAt: string) => (
        <Text className='text-xs'>{humanReadableDate(createdAt)}</Text>
      ),
      width: 150
    },
    {
      title: t('orderDetail.total'),
      dataIndex: 'amountFromUser',
      key: 'amountFromUser',
      sorter: true,
      align: 'right',
      render: (amountFromUser: any) => (
        <Text className='text-nowrap text-xs'>
          {amountFromUser && formatPrice(amountFromUser.$numberDecimal)}
          <sup>₫</sup>
        </Text>
      ),
      width: 120
    },
    {
      title: t('orderDetail.store'),
      dataIndex: 'storeId',
      key: 'storeId',
      sorter: true,
      render: (storeId: any) => <StoreSmallCard store={storeId} />,
      width: 200
    },
    {
      title: t('orderDetail.paymentMethod'),
      dataIndex: 'isPaidBefore',
      key: 'isPaidBefore',
      sorter: true,
      render: (isPaidBefore: boolean) => (
        <OrderPaymentLabel isPaidBefore={isPaidBefore} />
      ),
      width: 150
    },
    {
      title: t('status.status'),
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: string) => <OrderStatusLabel status={status} />,
      width: 120
    },
    {
      title: t('action'),
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_: any, record: OrderType) => (
        <Link to={`/account/purchase/detail/${record._id}`}>
          <Button
            type='primary'
            size='small'
            icon={<EyeOutlined />}
            title={t('button.detail')}
          />
        </Link>
      )
    }
  ]

  return (
    <div className='w-full'>
      {heading && getStatusTitle() && (
        <Title level={5} className='mb-4'>
          {getStatusTitle()}
        </Title>
      )}

      {error && (
        <Alert
          message={error.message || 'Server Error'}
          type='error'
          showIcon
          className='mb-4'
        />
      )}

      <div className='p-3 bg-white rounded-md'>
        <div className='flex gap-3 items-center mb-4'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
          />
          <Button
            onClick={() => refetch()}
            icon={<SyncOutlined spin={isLoading} />}
            loading={isLoading}
            title={t('button.refresh')}
          />
        </div>

        {orders.length === 0 && !isLoading ? (
          <div className='my-8 text-center'>
            <img className='mb-3' src={noItem} alt='noItem' width={'100px'} />
            <Title level={5}>{t('orderDetail.noOrder')}</Title>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey='_id'
            loading={isLoading}
            pagination={{
              current: pagination.pageCurrent,
              pageSize: filter.limit,
              total: pagination.size,
              onChange: handleChangePage,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} ${t('of')} ${total} ${t('result')}`,
              pageSizeOptions: [5, 10, 20, 50],
              showSizeChanger: true
            }}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
            size='small'
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t('orderDetail.noOrder')}
                />
              )
            }}
          />
        )}
      </div>
    </div>
  )
}

export default UserOrdersTable
