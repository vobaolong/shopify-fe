import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Table, Button, Alert, Select, Divider, Typography } from 'antd'
import { getToken } from '../../apis/auth.api'
import {
  listTransactionsByUser,
  listTransactionsByStore,
  listTransactionsForAdmin
} from '../../apis/transaction.api'
import { humanReadableDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import TransactionStatusLabel from '../label/TransactionStatusLabel'
import EWalletInfo from '../info/EWalletInfo'
import CreateTransactionItem from '../item/CreateTransactionItem'
import StoreSmallCard from '../card/StoreSmallCard'
import UserSmallCard from '../card/UserSmallCard'
import { useTranslation } from 'react-i18next'
import SuccessLabel from '../label/SuccessLabel'
import { ColumnsType, ColumnType } from 'antd/es/table'
import SearchInput from '../ui/SearchInput'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { SyncOutlined } from '@ant-design/icons'
import { PaginationType } from '../../@types/pagination.type'
import { CopyOutlined } from '@ant-design/icons'
import { TransactionType } from '../../enums/OrderStatus.enum'
interface TransactionType {
  _id: string
  amount: { $numberDecimal: string }
  storeId?: any
  userId?: any
  isUp: boolean
  status?: string
  createdAt: string
}

interface OwnerType {
  _id?: string
  [key: string]: any
}

export interface Filter {
  sortBy: string
  order: string
  limit: number
  page: number
  search?: string
  status?: string
  searchField?: string
  type?: string
  createdAtFrom?: string
  isPaidBefore?: string
  createdAtTo?: string
}

const { RangePicker } = DatePicker
const { Text } = Typography

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
  const [filter, setFilter] = useState<Filter>({
    sortBy: 'createdAt',
    order: 'desc',
    limit: 10,
    page: 1
  })
  const [pendingFilter, setPendingFilter] = useState<Filter>(filter)

  const handleChangeKeyword = (keyword: string) => {
    setPendingFilter((prev) => ({ ...prev, search: keyword, page: 1 }))
  }
  const handleSearchFieldChange = (field: string) => {
    setPendingFilter((prev) => ({ ...prev, searchField: field }))
  }
  const handleTypeChange = (value: string) => {
    setPendingFilter((prev) => ({ ...prev, type: value }))
  }
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      setPendingFilter((prev) => ({
        ...prev,
        createdAtFrom: dates[0].startOf('day').toISOString(),
        createdAtTo: dates[1].endOf('day').toISOString(),
        page: 1
      }))
    } else {
      setPendingFilter((prev) => ({
        ...prev,
        createdAtFrom: undefined,
        createdAtTo: undefined,
        page: 1
      }))
    }
  }
  const handleSearch = () => {
    setFilter({ ...pendingFilter, searchField: 'transactionId' })
  }
  const handleChangePage = (page: number, pageSize: number) => {
    setFilter((prev) => ({ ...prev, page, limit: pageSize }))
  }
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
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

  const queryFn = async () => {
    let params = { ...filter, searchField: 'transactionId' }
    let res: any
    if (by === 'user') res = await listTransactionsByUser(_id, params)
    else if (by === 'store')
      res = await listTransactionsByStore(_id, params, storeId)
    else res = await listTransactionsForAdmin(params)
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
      render: (id: string) => (
        <Text
          className='uppercase'
          copyable={{ text: id.toUpperCase(), icon: <CopyOutlined /> }}
        >
          #{id.slice(-10).toUpperCase()}
        </Text>
      ),
      width: 150
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
      align: 'center',
      render: (isUp: boolean) => <TransactionStatusLabel isUp={isUp} />,
      sorter: true
    },
    {
      title: t('status.status'),
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      render: () => <SuccessLabel />
    },
    {
      title: t('transactionDetail.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span>{humanReadableDate(createdAt)}</span>
      ),
      sorter: true,
      width: 150,
      align: 'right'
    }
  ].filter(Boolean) as ColumnType<TransactionType>[]

  return (
    <div className='w-full'>
      {error && <Alert message={error.message} type='error' />}
      <div className='p-3 bg-white rounded-md'>
        <div className='mb-3 flex items-center justify-between'>
          {by === 'store' && (
            <>
              <EWalletInfo storeId={storeId} eWallet={eWallet} type='store' />
              {owner && (owner as OwnerType)._id && (
                <div className='ms-auto'>
                  <CreateTransactionItem
                    storeId={storeId}
                    eWallet={eWallet}
                    onRun={() => refetch()}
                    type='store'
                  />
                </div>
              )}
            </>
          )}
          {by === 'user' && (
            <>
              <EWalletInfo
                userId={(owner as OwnerType)._id}
                eWallet={eWallet}
                type='user'
              />
              <div className='ms-auto'>
                <CreateTransactionItem
                  eWallet={eWallet}
                  onRun={() => refetch()}
                  type='user'
                />
              </div>
            </>
          )}
        </div>
        <div className='mb-3 flex gap-3 items-center flex-wrap'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
          />

          <RangePicker
            className='!h-10 max-w-[250px]'
            value={
              pendingFilter.createdAtFrom && pendingFilter.createdAtTo
                ? [
                    dayjs(pendingFilter.createdAtFrom),
                    dayjs(pendingFilter.createdAtTo)
                  ]
                : null
            }
            onChange={handleDateRangeChange}
            allowClear
            format='DD-MM-YYYY'
          />

          <Select
            style={{ minWidth: 140 }}
            value={pendingFilter.type || ''}
            placeholder={t('transactionDetail.type') || ''}
            onChange={handleTypeChange}
            options={[
              { label: t('transactionDetail.type'), value: '' },
              {
                label: t('transactionDetail.deposit'),
                value: TransactionType.DEPOSIT
              },
              {
                label: t('transactionDetail.withdraw'),
                value: TransactionType.WITHDRAW
              }
            ]}
            allowClear
          />

          <Button type='primary' onClick={handleSearch}>
            {t('search')}
          </Button>
          <Button
            onClick={() => refetch()}
            className='!h-10 !w-10 flex items-center justify-center'
            type='default'
            loading={isLoading}
            icon={<SyncOutlined spin={isLoading} />}
          />
        </div>
        <Divider />
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
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  )
}

export default TransactionsTable
