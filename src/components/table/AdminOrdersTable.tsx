/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth'
import { listOrdersForAdmin } from '../../apis/order'
import { humanReadableDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import Pagination from '../ui/Pagination'
import Loading from '../ui/Loading'
import Error from '../ui/Error'
import SortByButton from './sub/SortByButton'
import OrderStatusLabel from '../label/OrderStatusLabel'
import OrderPaymentLabel from '../label/OrderPaymentLabel'
import StoreSmallCard from '../card/StoreSmallCard'
import UserSmallCard from '../card/UserSmallCard'
import SearchInput from '../ui/SearchInput'
import { useTranslation } from 'react-i18next'
import ShowResult from '../ui/ShowResult'
import noItem from '../../assets/noItem.png'

interface Pagination {
  size: number
  pageCurrent: number
  pageCount: number
}

interface Filter {
  search: string
  sortBy: string
  order: string
  status: string
  limit: number
  page: number
}

// Minimal order type for admin table
interface OrderType {
  _id: string
  createdAt: string
  userId: any
  storeId: any
  amountFromUser?: { $numberDecimal: number }
  amountToStore?: { $numberDecimal: number }
  amountToBuynow?: { $numberDecimal: number }
  shippingFee?: { $numberDecimal: number }
  isPaidBefore?: boolean
  status?: string
}

const AdminOrdersTable = ({
  heading = true,
  status = ''
}: {
  heading?: boolean
  status?: string
}) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [orders, setOrders] = useState<OrderType[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    size: 0,
    pageCurrent: 1,
    pageCount: 1
  })
  const [filter, setFilter] = useState<Filter>({
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    status: status || '',
    limit: 7,
    page: 1
  })

  const { _id } = getToken() || {}

  const init = () => {
    setError('')
    setIsLoading(true)
    listOrdersForAdmin(_id, filter)
      .then((res) => {
        const data = res.data
        if (data.error) setError(data.error)
        else {
          setOrders(data.orders || [])
          setPagination({
            size: data.size || 0,
            pageCurrent: data.filter?.pageCurrent || 1,
            pageCount: data.filter?.pageCount || 1
          })
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      status: status || ''
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const handleChangeKeyword = (keyword: string) => {
    setFilter({
      ...filter,
      search: keyword,
      page: 1
    })
  }

  const handleChangePage = (newPage: number) => {
    setFilter({
      ...filter,
      page: newPage
    })
  }

  const handleSetSortBy = (order: string, sortBy: string) => {
    setFilter({
      ...filter,
      sortBy,
      order
    })
  }

  return (
    <div className='position-relative'>
      {heading && (
        <>
          {status ===
            'Not processed|Processing|Shipped|Delivered|Cancelled|Returned' && (
            <h5 className='text-start'>{t('title.allOrders')}</h5>
          )}
          {status === 'Not processed' && (
            <h5 className='text-start'>{t('title.notProcessedOrders')}</h5>
          )}
          {status === 'Processing' && (
            <h5 className='text-start'>{t('title.processingOrders')}</h5>
          )}
          {status === 'Shipped' && (
            <h5 className='text-start'>{t('title.shippedOrders')}</h5>
          )}
          {status === 'Delivered' && (
            <h5 className='text-start'>{t('title.deliveredOrders')}</h5>
          )}
          {status === 'Cancelled' && (
            <h5 className='text-start'>{t('title.cancelledOrders')}</h5>
          )}
          {status === 'Returned' && (
            <h5 className='text-start'>{t('title.returnedOrders')}</h5>
          )}
        </>
      )}

      {isLoading && <Loading />}
      {error && <Error msg={error} />}

      <div className='p-3 box-shadow bg-body rounded-2'>
        <div className='mb-3'>
          <SearchInput onChange={handleChangeKeyword} />
        </div>
        {!isLoading && pagination.size === 0 ? (
          <div className='my-4 text-center'>
            <img className='mb-3' src={noItem} alt='noItem' width={'100px'} />
            <h5>{t('orderDetail.noOrder')}</h5>
          </div>
        ) : (
          <div className='table-scroll my-2'>
            <table className='table align-middle table-hover table-sm text-start'>
              <thead>
                <tr>
                  <th scope='col' className='text-center'></th>
                  <th scope='col'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('orderDetail.id')}
                      sortBy='_id'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>
                  <th scope='col'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('orderDetail.date')}
                      sortBy='createdAt'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>
                  <th scope='col' className='text-end'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('orderDetail.total')}
                      sortBy='amountFromUser'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>
                  <th scope='col'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('orderDetail.buyer')}
                      sortBy='userId'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>
                  <th scope='col'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('seller')}
                      sortBy='storeId'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>

                  <th scope='col' className='text-end'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('orderDetail.profit')}
                      sortBy='amountToStore'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>
                  <th scope='col' className='text-end'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('orderDetail.commission')}
                      sortBy='amountToBuynow'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>
                  <th scope='col'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('orderDetail.deliveryUnit')}
                      sortBy='deliveryId'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>
                  <th scope='col'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('orderDetail.payment')}
                      sortBy='isPaidBefore'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>
                  <th scope='col'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('status.status')}
                      sortBy='status'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>

                  <th scope='col'>
                    <span
                      style={{ fontWeight: '400', fontSize: '.875rem' }}
                      className='text-secondary'
                    >
                      {t('action')}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <th scope='row' className='text-center'>
                      {index + 1 + (filter.page - 1) * filter.limit}
                    </th>
                    <td>
                      <small>{order._id}</small>
                    </td>
                    <td>
                      <small>{humanReadableDate(order.createdAt)}</small>
                    </td>
                    <td className='text-end'>
                      <small className='text-nowrap'>
                        {formatPrice(order.amountFromUser?.$numberDecimal)}
                        <sup>₫</sup>
                      </small>
                    </td>
                    <td>
                      <small className='hidden-avatar'>
                        <UserSmallCard user={order.userId} />
                      </small>
                    </td>
                    <td>
                      <small className='hidden-avatar'>
                        <StoreSmallCard store={order.storeId} />
                      </small>
                    </td>
                    <td className='text-end'>
                      <small className='text-nowrap'>
                        {order.amountToStore &&
                          formatPrice(order.amountToStore.$numberDecimal)}
                        <sup>₫</sup>
                      </small>
                    </td>
                    <td className='text-end'>
                      <small className='text-nowrap'>
                        {order.amountToBuynow &&
                          formatPrice(order.amountToBuynow.$numberDecimal)}
                        <sup>₫</sup>
                      </small>
                    </td>
                    <td>
                      <small>
                        <i>Giao hàng nhanh</i>
                        <br />
                        {formatPrice(order.shippingFee?.$numberDecimal)}
                        <sup>₫</sup>
                      </small>
                    </td>
                    <td>
                      <span style={{ fontSize: '1rem' }}>
                        <OrderPaymentLabel isPaidBefore={order.isPaidBefore} />
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '1rem' }}>
                        <OrderStatusLabel status={order.status} />
                      </span>
                    </td>
                    <td>
                      <div className='position-relative d-inline-block'>
                        <Link
                          type='button'
                          className='btn btn-sm btn-outline-secondary rounded-1 ripple cus-tooltip'
                          to={`/admin/order/detail/${order._id}`}
                          title={t('button.detail')}
                        >
                          <i className='fa-solid fa-info-circle'></i>
                        </Link>
                        <span className='cus-tooltip-msg'>
                          {t('button.detail')}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className='d-flex justify-content-between align-items-center px-4'>
          <ShowResult
            limit={filter.limit}
            size={pagination.size}
            pageCurrent={pagination.pageCurrent}
          />
          {pagination.size !== 0 && (
            <Pagination
              pagination={pagination}
              onChangePage={handleChangePage}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminOrdersTable
