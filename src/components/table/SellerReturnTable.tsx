/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getToken } from '../../apis/auth.api'
import {
  listReturnByStore,
  sellerUpdateReturnStatusOrder
} from '../../apis/order.api'
import { humanReadableDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import Pagination from '../ui/Pagination'
import { Spin, Alert, Table } from 'antd'
import SortByButton from './sub/SortByButton'
import OrderReturnStatusLabel from '../label/OrderReturnStatusLabel'
import OrderPaymentLabel from '../label/OrderPaymentLabel'
import UserSmallCard from '../card/UserSmallCard'
import SearchInput from '../ui/SearchInput'
import { useTranslation } from 'react-i18next'
import ShowResult from '../ui/ShowResult'
import noItem from '../../assets/noItem.png'
import {
  ReturnFilterState,
  defaultReturnFilter
} from '../../@types/filter.type'
import { useQuery } from '@tanstack/react-query'

const SellerReturnTable = ({
  storeId = '',
  isEditable = false,
  status = ''
}) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [displayError, setDisplayError] = useState(false)
  const [filter, setFilter] = useState<ReturnFilterState>({
    ...defaultReturnFilter,
    status
  })
  const [pendingFilter, setPendingFilter] = useState<ReturnFilterState>({
    ...defaultReturnFilter,
    status
  })

  const { _id } = getToken()

  // Query for return orders
  const {
    data,
    isLoading: queryLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['returnOrders', filter, storeId],
    queryFn: async () => {
      const res = await listReturnByStore(_id, filter, storeId)
      return res.data || res
    }
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
      search: keyword
    })
  }

  const handleSearch = () => {
    setFilter({
      ...pendingFilter,
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
      order: order as 'asc' | 'desc'
    })
  }
  //
  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      setIsLoading(true)
      setError('')
      setDisplayError(false)

      const result = await sellerUpdateReturnStatusOrder(
        _id,
        status,
        orderId,
        storeId
      )

      if (result.success) {
        refetch()
      } else {
        throw new Error(result.error || 'Failed to update status')
      }
    } catch (error: any) {
      console.error('Error updating status:', error)
      setError(`Failed to update status: ${error.message}`)
      setDisplayError(true)
    } finally {
      setIsLoading(false)
    }
  }
  //

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: '10%',
      render: (text: string) => <small>{text}</small>
    },
    {
      title: t('orderDetail.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (text: string) => <small>{humanReadableDate(text)}</small>
    },
    {
      title: t('orderDetail.total'),
      dataIndex: 'amountFromUser',
      key: 'amountFromUser',
      width: '15%',
      render: (text: number) => (
        <small className='text-nowrap'>
          {formatPrice(text)}
          <sup>₫</sup>
        </small>
      )
    },
    {
      title: t('orderDetail.buyer'),
      dataIndex: 'userId',
      key: 'userId',
      width: '15%',
      render: (userId: any) => <UserSmallCard user={userId} />
    },
    {
      title: t('orderDetail.paymentMethod'),
      dataIndex: 'isPaidBefore',
      key: 'isPaidBefore',
      width: '10%',
      render: (isPaidBefore: boolean) => (
        <span>
          <OrderPaymentLabel isPaidBefore={isPaidBefore} />
        </span>
      )
    },
    {
      title: t('status.status'),
      dataIndex: 'returnRequests',
      key: 'returnRequests.status',
      width: '10%',
      render: (returnRequests: any) => (
        <span>
          <OrderReturnStatusLabel status={returnRequests?.status} />
        </span>
      )
    },
    {
      title: t('orderDetail.reason'),
      dataIndex: 'returnRequests',
      key: 'returnRequests.reason',
      width: '15%',
      render: (returnRequests: any) => <span>{returnRequests?.reason}</span>
    },
    {
      title: t('orderDetail.date'),
      dataIndex: 'returnRequests',
      key: 'returnRequests.createdAt',
      width: '15%',
      render: (returnRequests: any) => (
        <small>{humanReadableDate(returnRequests?.createdAt)}</small>
      )
    },
    {
      title: t('action'),
      key: 'action',
      width: '10%',
      render: (text: string, record: any) => (
        <>
          <button
            className='btn btn-success rounded-1 btn-sm'
            onClick={() => handleUpdateStatus(record._id, 'Approved')}
            disabled={record.returnRequests?.status === 'Approved'}
          >
            {t('button.approve')}
          </button>
          <button
            className='btn btn-outline-danger rounded-1 btn-sm ms-2'
            onClick={() => handleUpdateStatus(record._id, 'Rejected')}
            disabled={record.returnRequests?.status === 'Rejected'}
          >
            {t('button.reject')}
          </button>
        </>
      )
    }
  ]

  return (
    <div className='position-relative'>
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
            <img
              className='mb-3'
              src={noItem}
              alt='No items'
              width='100'
              height='100'
              loading='eager'
            />
            <h5>{t('orderDetail.noOrder')}</h5>
          </div>
        ) : (
          <>
            <div className='table-scroll my-2'>
              <Table
                columns={columns}
                dataSource={orders}
                rowKey='_id'
                pagination={false}
                className='mb-4'
                scroll={{ x: 'max-content' }}
              />
            </div>
            <div className='flex justify-content-between items-center px-4'>
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

export default SellerReturnTable
