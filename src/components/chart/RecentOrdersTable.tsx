import React from 'react'
import { Table, Spin, Alert, Typography, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { CopyOutlined, EyeOutlined } from '@ant-design/icons'
import { useOrdersForAdmin } from '../../hooks/useOrder'
import { humanReadableDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import OrderStatusLabel from '../label/OrderStatusLabel'
import OrderPaymentLabel from '../label/OrderPaymentLabel'
import StoreSmallCard from '../card/StoreSmallCard'
import UserSmallCard from '../card/UserSmallCard'
import { ColumnsType } from 'antd/es/table'

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

interface RecentOrdersTableProps {
  onViewOrderDetail?: (orderId: string) => void
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = () => {
  const { t } = useTranslation()
  const { Text, Title } = Typography

  const filter = {
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    status: '',
    limit: 5,
    pageSize: 5,
    page: 1
  }
  const { data, isLoading, error } = useOrdersForAdmin(filter)
  const orders: OrderType[] = (data?.orders || []).slice(0, 5)

  const columns: ColumnsType<OrderType> = [
    {
      title: t('orderDetail.id'),
      dataIndex: '_id',
      key: '_id',
      render: (id: string) => (
        <Text
          className='uppercase'
          copyable={{ text: id.toUpperCase(), icon: <CopyOutlined /> }}
        >
          #{id.slice(-10).toUpperCase()}
        </Text>
      )
    },
    {
      title: t('orderDetail.buyer'),
      dataIndex: 'userId',
      key: 'userId',
      render: (user: any) => (
        <div>
          <UserSmallCard user={user} />
        </div>
      )
    },
    {
      title: t('orderDetail.total'),
      dataIndex: 'amountFromUser',
      key: 'amountFromUser',
      sorter: true,
      align: 'right',
      render: (amount: { $numberDecimal: number }) => (
        <Text className='whitespace-nowrap'>
          {formatPrice(amount?.$numberDecimal)}
          <sup> ₫</sup>
        </Text>
      )
    },

    {
      title: t('seller'),
      dataIndex: 'storeId',
      key: 'storeId',
      render: (store: any) => (
        <div>
          <StoreSmallCard store={store} isAvatar={false} />
        </div>
      )
    },
    {
      title: t('orderDetail.payment'),
      dataIndex: 'isPaidBefore',
      key: 'isPaidBefore',
      sorter: true,
      render: (isPaid: boolean) => <OrderPaymentLabel isPaidBefore={isPaid} />
    },
    {
      title: t('status.status'),
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: string) => <OrderStatusLabel status={status} />
    }
  ]

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Spin size='large' />
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        message={t('error')}
        description={String(error)}
        type='error'
        showIcon
      />
    )
  }

  return (
    <div className='recent-orders-table'>
      <div className='mb-4'>
        <Title level={5}>{t('orderRecent')}</Title>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey='_id'
        size='small'
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default RecentOrdersTable
