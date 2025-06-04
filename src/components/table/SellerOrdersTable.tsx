/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import { listOrdersByStore } from '../../apis/order.api'
import { humanReadableDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import Pagination from '../ui/Pagination'
import { Spin, Alert } from 'antd'
import SortByButton from './sub/SortByButton'
import OrderStatusLabel from '../label/OrderStatusLabel'
import OrderPaymentLabel from '../label/OrderPaymentLabel'
import UserSmallCard from '../card/UserSmallCard'
import SearchInput from '../ui/SearchInput'
import { useTranslation } from 'react-i18next'
import ShowResult from '../ui/ShowResult'
import noItem from '../../assets/noItem.png'
import { OrderFilterState, defaultOrderFilter } from '../../@types/filter.type'

const SellerOrdersTable = ({
  heading = true,
  storeId = '',
  isEditable = false,
  status = ''
}) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [displayError, setDisplayError] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    size: 0,
    pageCurrent: 1,
    pageCount: 1
  })
  const [filter, setFilter] = useState<OrderFilterState>({
    ...defaultOrderFilter,
    status
  })
  const [pendingFilter, setPendingFilter] = useState<OrderFilterState>({
    ...defaultOrderFilter,
    status
  })

  const { _id } = getToken()
  const init = () => {
    setError('')
    setIsLoading(true)
    let timerId: NodeJS.Timeout | null = null
    listOrdersByStore(_id, filter, storeId)
      .then((data) => {
        if (data.error) setError(data.error)
        else {
          setOrders(data.data?.orders || data.orders || [])
          setPagination({
            size: data.data?.size || data.size || 0,
            pageCurrent:
              data.data?.filter?.pageCurrent || data.filter?.pageCurrent || 1,
            pageCount:
              data.data?.filter?.pageCount || data.filter?.pageCount || 1
          })
        }
        setIsLoading(false)
        if (timerId) clearTimeout(timerId)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        if (timerId) clearTimeout(timerId)
      })
    timerId = setTimeout(() => {
      if (error) setDisplayError(true)
    }, 3000)
  }

  useEffect(() => {
    setFilter({
      ...filter,
      status
    })
  }, [status])

  useEffect(() => {
    init()
  }, [filter, storeId])
  const handleFilterChange = (updates: Partial<OrderFilterState>) => {
    setPendingFilter((prev) => ({
      ...prev,
      ...updates,
      page: 1
    }))
  }

  const handleSearch = () => {
    setFilter({ ...pendingFilter })
  }

  const handleChangeKeyword = (keyword: string) => {
    handleFilterChange({ search: keyword })
  }

  const handleChangePage = (newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }))
  }

  const handleSetSortBy = (order: string, sortBy: string) => {
    setFilter((prev) => ({ ...prev, order: order as 'asc' | 'desc', sortBy }))
  }

  return (
    <div className='position-relative'>
      {heading && (
        <>
          {status ===
            'Pending|Processing|Shipped|Delivered|Cancelled|Returned' && (
            <h5 className='text-start'>{t('title.allOrders')}</h5>
          )}
          {status === 'Pending' && (
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
      {isLoading && <Spin size='large' />}
      {error && <Alert message={error} type='error' />}
      {displayError && <Alert message={error} type='error' />}

      <div className='p-3 box-shadow bg-body rounded-2'>
        <SearchInput
          value={pendingFilter.search || ''}
          onChange={handleChangeKeyword}
          onSearch={handleSearch}
        />
        {!isLoading && pagination.size === 0 ? (
          <div className='my-4 text-center'>
            <img className='mb-3' src={noItem} alt='noItem' width={'100px'} />
            <h5>{t('orderDetail.noOrder')}</h5>
          </div>
        ) : (
          <>
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
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('orderDetail.date')}
                        sortBy='createdAt'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col' className='text-end'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('orderDetail.total')}
                        sortBy='amountFromUser'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('orderDetail.buyer')}
                        sortBy='userId'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('orderDetail.commission')}
                        sortBy='amountToPlatform'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('orderDetail.profit')}
                        sortBy='amountToStore'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('orderDetail.deliveryUnit')}
                        sortBy='deliveryId'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('orderDetail.paymentMethod')}
                        sortBy='isPaidBefore'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('status.status')}
                        sortBy='status'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>

                    <th scope='col'>
                      <span>{t('action')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      {' '}
                      <th scope='row' className='text-center'>
                        {index +
                          1 +
                          ((filter.page || 1) - 1) * (filter.limit || 7)}
                      </th>
                      <td>
                        <small>{order._id}</small>
                      </td>
                      <td style={{ whiteSpace: 'normal' }}>
                        <small>{humanReadableDate(order.createdAt)}</small>
                      </td>
                      <td className='text-end'>
                        <small className='text-nowrap'>
                          {formatPrice(order.amountFromUser?.$numberDecimal)}
                          <sup>₫</sup>
                        </small>
                      </td>
                      <td className='hidden-avatar'>
                        <UserSmallCard user={order.userId} />
                      </td>
                      <td className='text-end'>
                        <small className='text-nowrap'>
                          {formatPrice(order.amountToPlatform?.$numberDecimal)}
                          <sup>₫</sup>
                        </small>
                      </td>
                      <td className='text-end'>
                        <small className='text-nowrap'>
                          {formatPrice(order.amountToStore?.$numberDecimal)}
                          <sup>₫</sup>
                        </small>
                        <br />
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
                        <span>
                          <OrderPaymentLabel
                            isPaidBefore={order.isPaidBefore}
                          />
                        </span>
                      </td>
                      <td>
                        <span>
                          <OrderStatusLabel status={order.status} />
                        </span>
                      </td>
                      <td>
                        {' '}
                        <div className='position-relative d-inline-block'>
                          <Link
                            type='button'
                            className='btn btn-sm btn-outline-secondary rounded-1 ripple cus-tooltip'
                            to={`/seller/orders/detail/${order._id}/${storeId}`}
                          >
                            <i className='fa-solid fa-circle-info' />
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
            <div className='d-flex justify-content-between align-items-center px-4'>
              {pagination.size !== 0 && (
                <ShowResult
                  limit={filter.limit}
                  size={pagination.size}
                  pageCurrent={pagination.pageCurrent}
                />
              )}
              {pagination.size !== 0 && (
                <Pagination
                  pagination={pagination}
                  onChangePage={handleChangePage}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SellerOrdersTable
