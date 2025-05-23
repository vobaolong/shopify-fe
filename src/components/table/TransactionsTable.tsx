/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  Button,
  Alert,
  Select,
  Typography,
  Pagination,
  Spin
} from 'antd'
import { getToken } from '../../apis/auth'
import {
  listTransactionsByUser,
  listTransactionsByStore,
  listTransactionsForAdmin
} from '../../apis/transaction'
import { humanReadableDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import SortByButton from './sub/SortByButton'
import TransactionStatusLabel from '../label/TransactionStatusLabel'
import EWalletInfo from '../info/EWalletInfo'
import CreateTransactionItem from '../item/CreateTransactionItem'
import CreateTransactionItemForUser from '../item/CreateTransactionItemForUser'
import StoreSmallCard from '../card/StoreSmallCard'
import UserSmallCard from '../card/UserSmallCard'
import { useTranslation } from 'react-i18next'
import SuccessLabel from '../label/SuccessLabel'
import boxImg from '../../assets/box.svg'
import type { AxiosResponse } from 'axios'
import { ColumnsType, ColumnType } from 'antd/es/table'

interface TransactionType {
  _id: string
  amount: { $numberDecimal: string }
  storeId?: any
  userId?: any
  isUp: boolean
  status?: string
  createdAt: string
}

export interface PaginationType {
  size: number
  pageCurrent: number
  pageCount: number
}

interface OwnerType {
  _id?: string
  [key: string]: any
}

const TransactionsTable = ({
  storeId = '',
  by = 'admin',
  owner = {},
  eWallet = 0
}: {
  storeId?: string
  by?: 'admin' | 'user' | 'store'
  owner?: OwnerType
  eWallet?: number
  heading?: boolean
}) => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const [filter, setFilter] = useState({
    sortBy: 'createdAt',
    order: 'desc',
    limit: 10,
    page: 1
  })

  const queryFn = async () => {
    let res: any
    if (by === 'user') res = await listTransactionsByUser(_id, filter)
    else if (by === 'store')
      res = await listTransactionsByStore(_id, filter, storeId)
    else res = await listTransactionsForAdmin(filter)
    if (res && res.data) return res.data
    return res
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['transactions', by, storeId, filter],
    queryFn
  })

  const transactions: TransactionType[] = data?.transactions || []
  const pagination: PaginationType = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page,
    pageCount: data?.filter?.pageCount || 1
  }

  const columns: ColumnsType<TransactionType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (_: any, __: any, idx: number) =>
        (pagination.pageCurrent - 1) * filter.limit + idx + 1,
      width: 60
    },
    {
      title: t('userDetail.transaction'),
      dataIndex: '_id',
      key: '_id',
      render: (id: string) => <small>{id}</small>,
      sorter: true
    },
    {
      title: t('userDetail.total'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount: any) => (
        <small>
          {formatPrice(amount?.$numberDecimal)}
          <sup>₫</sup>{' '}
          <small className='text-warning'>
            {amount?.$numberDecimal > 0 ? '' : '(COD)'}
          </small>
        </small>
      ),
      sorter: true
    },
    by === 'admin'
      ? {
          title: t('userDetail.by'),
          dataIndex: 'storeId',
          key: 'storeId',
          render: (store: any, record: any) =>
            store ? (
              <StoreSmallCard store={store} />
            ) : (
              <UserSmallCard user={record.userId} />
            )
        }
      : null,
    {
      title: t('transactionDetail.type'),
      dataIndex: 'isUp',
      key: 'isUp',
      render: (isUp: boolean) => <TransactionStatusLabel isUp={isUp} />,
      sorter: true
    },
    {
      title: t('status.status'),
      dataIndex: 'status',
      key: 'status',
      render: () => <SuccessLabel />
    },
    {
      title: t('transactionDetail.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <small>{humanReadableDate(createdAt)}</small>
      ),
      sorter: true
    }
  ].filter(Boolean) as ColumnType<TransactionType>[]
  const handleChangePage = (page: number, pageSize: number) => {
    setFilter((prev) => ({ ...prev, page, limit: pageSize }))
  }
  return (
    <div className='position-relative'>
      {error && <Alert message={error.message} type='error' />}
      <div className='p-3 bg-white rounded-md'>
        <div className='mb-3 d-flex gap-4 items-center flex-wrap'>
          {by === 'store' && (
            <>
              <EWalletInfo eWallet={eWallet} />
              {owner && (owner as OwnerType)._id && (
                <div className='ms-3'>
                  <CreateTransactionItem
                    storeId={storeId}
                    eWallet={eWallet}
                    onRun={() => refetch()}
                  />
                </div>
              )}
            </>
          )}
          {by === 'user' && (
            <>
              <EWalletInfo eWallet={eWallet} />
              <div className='ms-3'>
                <CreateTransactionItemForUser
                  eWallet={eWallet}
                  onRun={() => refetch()}
                />
              </div>
            </>
          )}
        </div>
        {!isLoading && pagination.size === 0 ? (
          <div className='m-4 text-center'>
            <img className='mb-3' src={boxImg} alt='boxImg' width={'80px'} />
            <h5>{t('transactionDetail.noTransaction')}</h5>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey='_id'
            loading={isLoading}
            bordered
            pagination={{
              current: data?.filter?.pageCurrent || 1,
              pageSize: filter.limit,
              total: data?.size || 0,
              onChange: handleChangePage,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} ${t('of')} ${total} ${t('result')}`
            }}
            scroll={{ x: 900 }}
          />
        )}
      </div>
    </div>
  )
}

export default TransactionsTable
