import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getStoresForAdmin,
  activeStore as activeOrInactive
} from '../../apis/store.api'
import { humanReadableDate } from '../../helper/humanReadable'
import SearchInput from '../ui/SearchInput'
import StoreSmallCard from '../card/StoreSmallCard'
import StarRating from '../label/StarRating'
import StoreCommissionLabel from '../label/StoreCommissionLabel'
import { useTranslation } from 'react-i18next'
import StoreActiveLabel from '../label/StoreActiveLabel'
import {
  sendActiveStoreEmail,
  sendBanStoreEmail
} from '../../apis/notification.api'
import {
  Table,
  Button,
  Alert,
  Select,
  Typography,
  Modal,
  DatePicker,
  notification,
  Divider
} from 'antd'
import { useState, useEffect } from 'react'
import { Filter } from './AdminUsersTable'
import dayjs from 'dayjs'
import { listCommissions } from '../../apis/commission.api'
import { CommissionType, StoreType } from '../../@types/entity.types'
import { SyncOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { BanIcon, CheckCircle } from 'lucide-react'
import { ColumnType } from 'antd/lib/table'
import { PaginationType } from '../../@types/pagination.type'

const AdminStoresTable = ({ heading = false }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  )
  const [filter, setFilter] = useState<Filter>({
    sortBy: 'createdAt',
    order: 'asc',
    limit: 10,
    page: 1
  })
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const [activeStore, setActiveStore] = useState<any>({})
  const [pendingFilter, setPendingFilter] = useState<Filter>(filter)
  const [commissionOptions, setCommissionOptions] = useState<
    { label: string; value: string }[]
  >([])
  const [ratingOptions, setRatingOptions] = useState<
    { label: string; value: string }[]
  >([])
  const { data: commissionData } = useQuery({
    queryKey: ['commissions'],
    queryFn: () =>
      listCommissions({
        search: '',
        sortBy: 'createdAt',
        order: 'asc',
        limit: 10,
        page: 1
      })
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['stores', filter],
    queryFn: async () => {
      return await getStoresForAdmin(filter)
    }
  })

  const stores: StoreType[] = data?.stores || []
  const pagination: PaginationType = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page,
    pageCount: data?.filter?.pageCount || 1
  }

  const mutation = useMutation({
    mutationFn: ({
      storeId,
      value
    }: {
      storeId: string
      value: { isActive: boolean }
    }) => activeOrInactive(storeId, value),
    onSuccess: (_, variables) => {
      const active = variables.value.isActive
        ? t('toastSuccess.store.active')
        : t('toastSuccess.store.ban')
      notification.success({
        message: active
      })

      if (variables.value.isActive) {
        sendActiveStoreEmail(activeStore.ownerId?._id, activeStore._id)
      } else {
        sendBanStoreEmail(activeStore.ownerId?._id, activeStore._id)
      }
      queryClient.invalidateQueries({ queryKey: ['stores'] })
    },
    onError: () => {
      setError('Server Error')
    },
    onSettled: () => {
      setIsConfirming(false)
    }
  })

  const columns: ColumnsType<StoreType> = [
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
      title: t('storeDetail.storeName'),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, store: any) => <StoreSmallCard store={store} />
    },
    {
      align: 'center',
      title: t('storeDetail.rating'),
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      render: (rating: number) => <StarRating stars={rating} />
    },
    {
      title: t('storeDetail.contactPerson'),
      dataIndex: 'ownerId',
      key: 'ownerId',
      render: (owner: any) => (
        <small className='d-grid'>
          <span>
            {t('userDetail.name')}:{' '}
            <span className='text-primary'>
              {owner?.firstName + ' ' + owner?.lastName || '-'}
            </span>
          </span>
          <span>
            Email: <span className='text-primary'>{owner?.email || '-'}</span>
          </span>
          <span>
            {t('userDetail.phone')}:{' '}
            <span className='text-primary'>{owner?.phone || '-'}</span>
          </span>
        </small>
      )
    },
    {
      align: 'center',
      title: t('storeDetail.commissions'),
      dataIndex: 'commissionId',
      key: 'commissionId',
      render: (commission: any) => (
        <StoreCommissionLabel commission={commission} />
      )
    },
    {
      align: 'center',
      title: t('status.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      sorter: true,
      render: (isActive: boolean) => <StoreActiveLabel isActive={isActive} />
    },
    {
      title: t('joined'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (createdAt: string) => (
        <span className='text-nowrap'>{humanReadableDate(createdAt)}</span>
      )
    },
    {
      align: 'center',
      title: t('action'),
      key: 'action',
      render: (_: any, store: any) => (
        <div className='position-relative d-inline-block'>
          <Button
            type={store.isActive ? 'default' : 'primary'}
            size='middle'
            danger={store.isActive}
            onClick={() => handleActiveStore(store)}
          >
            {store.isActive ? <BanIcon size={16} /> : <CheckCircle size={16} />}
          </Button>
        </div>
      )
    }
  ].filter(Boolean) as ColumnType<StoreType>[]

  const handleChangePage = (page: number, pageSize: number) => {
    setFilter((prev) => ({ ...prev, page, limit: pageSize }))
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setPendingFilter((prev) => ({
      ...prev,
      isActive: value === 'all' ? undefined : value === 'active'
    }))
  }

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates)
    if (dates) {
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

  const handleChangeKeyword = (keyword: string) => {
    setPendingFilter((prev) => ({ ...prev, search: keyword, page: 1 }))
  }
  const handleSearch = () => {
    setFilter({ ...pendingFilter })
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

  const handleActiveStore = (store: any) => {
    setActiveStore(store)
    setIsConfirming(true)
  }

  const onSubmit = () => {
    mutation.mutate({
      storeId: activeStore._id,
      value: { isActive: !activeStore.isActive }
    })
  }

  const handleCommissionChange = (value: string) => {
    setPendingFilter((prev) => ({ ...prev, commissionId: value }))
  }
  const handleRatingChange = (value: string) => {
    setPendingFilter((prev) => ({ ...prev, rating: value }))
  }

  useEffect(() => {
    const commissions =
      commissionData?.data?.commissions || commissionData?.commissions
    if (commissions) {
      setCommissionOptions([
        { label: t('filters.all'), value: '' },
        ...commissions.map((commission: CommissionType) => ({
          label: `${commission.name} (${commission.fee?.$numberDecimal || commission.fee}%)`,
          value: commission._id
        }))
      ])
    }
  }, [commissionData, t])

  useEffect(() => {
    setRatingOptions([
      { label: t('filters.all'), value: '' },
      { label: '1+', value: '1' },
      { label: '2+', value: '2' },
      { label: '3+', value: '3' },
      { label: '4+', value: '4' },
      { label: '5', value: '5' }
    ])
  }, [t])

  return (
    <div className='w-full'>
      {error && <Alert message={error} type='error' />}
      <Modal
        open={isConfirming}
        title={
          !activeStore.isActive ? t('dialog.activeStore') : t('dialog.banStore')
        }
        onCancel={() => setIsConfirming(false)}
        onOk={onSubmit}
        okText={t('button.confirm')}
        cancelText={t('button.cancel')}
        confirmLoading={mutation.isPending}
      />
      <div className='p-3 bg-white rounded-md'>
        <div className='flex gap-3 items-center flex-wrap'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
          />
          <DatePicker.RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            style={{ minWidth: 240 }}
            allowClear
            format='DD-MM-YYYY'
          />
          <Select
            style={{ minWidth: 140 }}
            value={statusFilter}
            onChange={handleStatusChange}
            options={[
              { label: t('filters.all'), value: 'all' },
              { label: t('status.active'), value: 'active' },
              { label: t('status.banned'), value: 'inactive' }
            ]}
            placeholder={t('storeDetail.status')}
            allowClear
          />
          <Select
            style={{ minWidth: 140 }}
            value={pendingFilter.commissionId}
            onChange={handleCommissionChange}
            options={commissionOptions}
            placeholder={t('storeDetail.commissions')}
            allowClear
            styles={{ popup: { root: { width: 220 } } }}
          />
          <Select
            style={{ minWidth: 120 }}
            value={pendingFilter.rating}
            onChange={handleRatingChange}
            options={ratingOptions}
            placeholder={t('storeDetail.rating')}
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
          dataSource={stores}
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

export default AdminStoresTable
