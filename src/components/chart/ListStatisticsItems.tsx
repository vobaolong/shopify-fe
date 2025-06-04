import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Row, Col, Button, Spin, Alert, Table, Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getToken } from '../../apis/auth.api'
import { listOrdersForAdmin, listOrdersByStore } from '../../apis/order.api'
import {
  listProductsForAdmin,
  listProductsForManager
} from '../../apis/product.api'
import { listUserForAdmin } from '../../apis/user.api'
import { getStoresForAdmin } from '../../apis/store.api'
import { groupByDate, groupByJoined, groupBySold } from '../../helper/groupBy'
import { humanReadableDate } from '../../helper/humanReadable'
import LineChart from './LineChart'
import BarChart from './BarChart'
import DropDownMenu from '../ui/DropDownMenu'
import UserSmallCard from '../card/UserSmallCard'
import StoreSmallCard from '../card/StoreSmallCard'
import ProductSmallCard from '../card/ProductSmallCard'
import { OrderStatus } from '../../enums/OrderStatus.enum'

interface AdminStats {
  items: {
    order: any[]
    product: any[]
    user: any[]
    store: any[]
  }
  sizes: {
    order: number
    product: number
    user: number
    store: number
  }
  totalRevenue: number
}
interface SellerStats {
  items: {
    order: any[]
    product: any[]
  }
  sizes: {
    order: number
    product: number
  }
  totalRevenue: number
}

const ListStatisticsItems = ({
  by,
  storeId
}: {
  by: string
  storeId: string
}) => {
  const { t } = useTranslation()
  const [options, setOptions] = useState({
    flag: 'order',
    by: 'hours',
    sliceEnd: 6,
    type: 'line'
  })
  const { _id } = getToken()

  const titles: Record<string, string> = {
    order: t('admin.adDashboard.salesStatisticsByOrders'),
    product: t('admin.adDashboard.statisticsByProducts'),
    user: t('admin.adDashboard.statisticsNewUser'),
    store: t('admin.adDashboard.statisticsNewStore')
  }

  const groupByFunc: Record<string, any> = {
    order: groupByDate,
    product: groupBySold,
    user: groupByJoined,
    store: groupByJoined
  }

  const calculateTotalRevenue = (orders: any[]): number => {
    return orders.reduce((totalRevenue: number, order: any) => {
      if (order.status === OrderStatus.DELIVERED) {
        const amount =
          by === 'admin'
            ? (order?.amountToPlatform?.$numberDecimal ?? 0)
            : (order?.amountToStore?.$numberDecimal ?? 0)
        return totalRevenue + parseFloat(amount)
      }
      return totalRevenue
    }, 0)
  }

  // React Query fetch function
  const fetchStats = async () => {
    if (by === 'admin') {
      const [orderData, productData, userData, storeData] = await Promise.all([
        listOrdersForAdmin({
          search: '',
          sortBy: 'createdAt',
          order: 'desc',
          status: OrderStatus.DELIVERED,
          limit: 1000,
          page: 1
        }),
        listProductsForAdmin({
          search: '',
          sortBy: 'sold',
          isActive: 'true',
          order: 'desc',
          limit: 1000,
          page: 1
        }),
        listUserForAdmin({
          search: '',
          sortBy: 'point',
          by: 'user',
          order: 'desc',
          limit: 1000,
          page: 1
        }),
        getStoresForAdmin({
          search: '',
          sortBy: 'point',
          sortMoreBy: 'rating',
          isActive: 'true',
          order: 'desc',
          limit: 1000,
          page: 1
        })
      ])
      const orders = orderData.orders || []
      return {
        items: {
          order: orders.slice().reverse(),
          product: productData.products || [],
          user: userData.users || [],
          store: storeData.stores || []
        },
        sizes: {
          order: orderData?.size || 0,
          product: productData?.size || 0,
          user: userData?.size || 0,
          store: storeData?.size || 0
        },
        totalRevenue: calculateTotalRevenue(orders)
      }
    } else {
      const [orderData, productData] = await Promise.all([
        listOrdersByStore(
          _id,
          {
            search: '',
            limit: 1000,
            sortBy: 'createdAt',
            order: 'desc',
            page: 1,
            status: OrderStatus.DELIVERED
          },
          storeId
        ),
        listProductsForManager(
          _id,
          {
            search: '',
            sortBy: 'sold',
            isActive: 'true',
            order: 'desc',
            limit: 1000,
            page: 1
          },
          storeId
        )
      ])
      const orders = orderData?.data?.orders || []
      return {
        items: {
          order: orders.slice().reverse(),
          product: productData?.data?.products || []
        },
        sizes: {
          order: orderData?.data?.size || 0,
          product: productData?.data?.size || 0
        },
        totalRevenue: calculateTotalRevenue(orders)
      }
    }
  }

  const { data, isLoading, error, refetch } = useQuery<
    AdminStats | SellerStats
  >({
    queryKey: ['statistics', by, storeId],
    queryFn: fetchStats,
    refetchInterval: 60000 // 1 phút
  })

  // Dropdown menu for flag
  const flagOptions = [
    {
      value: 'order',
      label: t('admin.orders'),
      icon: <i className='fa-solid fa-cart-shopping' />
    },
    {
      value: 'product',
      label: t('admin.products'),
      icon: <i className='fa-solid fa-box' />
    },
    ...(by === 'admin'
      ? [
          {
            value: 'user',
            label: t('admin.users'),
            icon: <i className='fa-solid fa-users' />
          },
          {
            value: 'store',
            label: t('admin.stores'),
            icon: <i className='fa-solid fa-store' />
          }
        ]
      : [])
  ]

  // Table columns
  const columns = [
    { title: '#', dataIndex: 'key', render: (v: any) => v + 1 },
    {
      title:
        options.flag === 'user'
          ? t('userDetail.name')
          : options.flag === 'store'
            ? t('storeDetail.storeName')
            : options.flag === 'product'
              ? t('productDetail.name')
              : t('orderDetail.id'),
      render: (_: any, item: any) => {
        if (options.flag === 'user') return <UserSmallCard user={item} />
        if (options.flag === 'store') return <StoreSmallCard store={item} />
        if (options.flag === 'product')
          return <ProductSmallCard product={item} rating={true} />
        if (options.flag === 'order')
          return (
            <Link
              className='hover:text-blue-500 transition-colors'
              to={`/${by}/$${by === 'admin' ? 'order' : 'orders'}/detail/${item._id}${by !== 'admin' ? `/${storeId}` : ''}`}
            >
              <span className='text-sm'>{item._id}</span>
            </Link>
          )
        return null
      }
    },
    {
      title:
        options.flag === 'user' || options.flag === 'store'
          ? t('point')
          : options.flag === 'product'
            ? t('productDetail.sold')
            : t('orderDetail.date'),
      render: (_: any, item: any) => {
        if (options.flag === 'user') return item.point
        if (options.flag === 'store') return item.point
        if (options.flag === 'product') return item.sold
        if (options.flag === 'order')
          return (
            <span className='text-sm'>{humanReadableDate(item.createdAt)}</span>
          )
        return null
      }
    }
  ]

  return (
    <Spin spinning={isLoading}>
      {error && (
        <Alert message={String(error)} type='error' showIcon className='mb-4' />
      )}
      <Row gutter={16} className='mb-4'>
        {flagOptions.map((opt) => (
          <Col span={6} key={opt.value}>
            <Button
              className='w-full !h-20'
              icon={opt.icon}
              type={options.flag === opt.value ? 'primary' : 'default'}
              block
              onClick={() =>
                setOptions({
                  ...options,
                  flag: opt.value
                })
              }
            >
              {opt.label}
              <span className='float-right font-bold'>
                {(data && (data.sizes as any)[opt.value]) || 0}
              </span>
            </Button>
          </Col>
        ))}
      </Row>
      <div className='relative'>
        <Row gutter={16}>
          <Col span={16}>
            <Form className='flex justify-end me-2 absolute top-2 right-2'>
              {options.flag !== 'product' ? (
                <div className='me-2'>
                  <DropDownMenu
                    listItem={[
                      {
                        label: t('admin.adDashboard.hour'),
                        value: 'hours',
                        icon: <i className='fa-regular fa-clock' />
                      },
                      {
                        label: t('admin.adDashboard.day'),
                        value: 'date',
                        icon: <i className='fa-regular fa-calendar-days' />
                      },
                      {
                        label: t('admin.adDashboard.month'),
                        value: 'month',
                        icon: <i className='fa-solid fa-calendar-alt' />
                      },
                      {
                        label: t('admin.adDashboard.year'),
                        value: 'year',
                        icon: <i className='fa-solid fa-calendar-minus' />
                      }
                    ]}
                    value={options.by}
                    setValue={(value) =>
                      setOptions({
                        ...options,
                        by: value
                      })
                    }
                    borderBtn={false}
                  />
                </div>
              ) : (
                <div className='me-2'>
                  <DropDownMenu
                    listItem={[
                      {
                        label: `5 ${t('admin.products')}`,
                        value: '5'
                      },
                      {
                        label: `10 ${t('admin.products')}`,
                        value: '10'
                      },
                      {
                        label: `50 ${t('admin.products')}`,
                        value: '50'
                      },
                      {
                        label: `100 ${t('admin.products')}`,
                        value: '100'
                      }
                    ]}
                    value={options.sliceEnd.toString()}
                    setValue={(value) =>
                      setOptions({
                        ...options,
                        sliceEnd: parseInt(value, 10)
                      })
                    }
                    borderBtn={false}
                  />
                </div>
              )}
              <div>
                <DropDownMenu
                  listItem={[
                    {
                      label: t('admin.adDashboard.line'),
                      value: 'line',
                      icon: <i className='fa-solid fa-chart-line' />
                    },
                    {
                      label: t('admin.adDashboard.bar'),
                      value: 'bar',
                      icon: <i className='fa-solid fa-chart-column' />
                    }
                  ]}
                  value={options.type}
                  setValue={(value) =>
                    setOptions({
                      ...options,
                      type: value
                    })
                  }
                  borderBtn={false}
                />
              </div>
            </Form>
            <div>
              {options.type === 'line' && (
                <LineChart
                  by={options.by}
                  items={(data && (data.items as any)[options.flag]) || []}
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
                  items={(data && (data.items as any)[options.flag]) || []}
                  groupBy={groupByFunc[options.flag]}
                  title={titles[options.flag]}
                  sliceEnd={options.sliceEnd}
                  value={options.flag}
                  role={by}
                />
              )}
            </div>
          </Col>

          <Col span={8}>
            <Card
              title={
                options.flag === 'user'
                  ? t('topUser')
                  : options.flag === 'store'
                    ? t('topShop')
                    : options.flag === 'product'
                      ? t('topProduct')
                      : t('orderRecent')
              }
            >
              <Table
                dataSource={(options.flag === 'order'
                  ? ((data && (data.items as any)[options.flag]) || [])
                      .slice(-5)
                      .reverse()
                  : ((data && (data.items as any)[options.flag]) || []).slice(
                      0,
                      5
                    )
                ).map((item: any, idx: any) => ({ ...item, key: idx }))}
                pagination={false}
                size='small'
                columns={columns}
              />
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <Link
                  to={`/${by}/$${by === 'admin' ? options.flag : options.flag + 's/' + storeId}`}
                >
                  {options.flag === 'user' && t('goToUserManager')}
                  {options.flag === 'store' && t('goToShopManager')}
                  {options.flag === 'product' && t('goToProductManager')}
                  {options.flag === 'order' && t('goToOrderManager')}
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  )
}

export default ListStatisticsItems
