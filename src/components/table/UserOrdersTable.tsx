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
import {
  Table,
  Spin,
  Alert,
  Button,
  Typography,
  Empty,
  Divider,
  Drawer
} from 'antd'
import { EyeOutlined, SyncOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { ColumnsType } from 'antd/es/table'
import { OrderType } from '../../@types/entity.types'
import OrderDetailInfo from '../info/OrderDetailInfo'
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
    sortBy: 'createdAt',
    order: 'desc',
    status: status || '',
    limit: 5,
    page: 1
  })
  const [pendingFilter, setPendingFilter] = useState(filter)
  const { _id } = getToken()
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userOrders', _id, filter],
    queryFn: () => listOrdersByUser(_id, filter),
    enabled: !!_id
  })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const orders = data?.orders || []
  const pagination = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page,
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

  const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: sorter.field || prev.sortBy,
      order:
        sorter.order === 'ascend'
          ? 'asc'
          : sorter.order === 'descend'
            ? 'desc'
            : prev.order
    }))
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
      width: 150,
      align: 'right'
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
      render: (storeId: any) => (
        <StoreSmallCard isAvatar={false} store={storeId} />
      ),
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
        <Button
          type='primary'
          size='small'
          icon={<EyeOutlined />}
          title={t('button.detail')}
          onClick={() => {
            setSelectedOrderId(record._id)
            setDrawerOpen(true)
          }}
        />
      )
    }
  ]

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedOrderId(null)
  }

  return (
    <div className='w-full'>
      {heading && (
        <Title level={5} className='mb-4'>
          {t('userDetail.myPurchase')}
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
        <div className='flex gap-3 items-center flex-wrap mb-3'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
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
              pageSizeOptions: ['5', '10', '20', '50'],
              showSizeChanger: true
            }}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
            bordered
            size='small'
            locale={{
              emptyText: <Empty description={t('orderDetail.noOrder')} />
            }}
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
          <OrderDetailInfo orderId={selectedOrderId} by='user' />
        )}
      </Drawer>
    </div>
  )
}

export default UserOrdersTable
