import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listCommissions,
  removeCommission,
  restoreCommission
} from '../../apis/commission.api'
import SearchInput from '../ui/SearchInput'
import StoreCommissionLabel from '../label/StoreCommissionLabel'
import DeletedLabel from '../label/DeletedLabel'
import ActiveLabel from '../label/ActiveLabel'
import AdminEditCommissionForm from '../item/form/AdminEditCommissionForm'
import { Divider, Drawer, Modal, Tooltip, DatePicker, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { humanReadableDate } from '../../helper/humanReadable'
import { Table, Button, notification, Alert } from 'antd'
import { CommissionType } from '../../@types/entity.types'
import { Dayjs } from 'dayjs'
import { SyncOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { PaginationType } from '../../@types/pagination.type'

interface Filter {
  search: string
  sortBy: string
  order: string
  limit: number
  page: number
  status: string
  dateRange: [string, string] | undefined
}

const AdminCommissionTable = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [editedCommission, setEditedCommission] =
    useState<CommissionType | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [filter, setFilter] = useState<Filter>({
    search: '',
    sortBy: 'name',
    order: 'asc',
    limit: 10,
    page: 1,
    status: 'all',
    dateRange: undefined as [string, string] | undefined
  })
  const [pendingFilter, setPendingFilter] = useState<Filter>(filter)
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null)
  const [status, setStatus] = useState<'all' | 'active' | 'deleted'>('all')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['commissions', filter],
    queryFn: async () => {
      return await listCommissions(filter)
    }
  })

  const commissions: CommissionType[] = data?.commissions || []
  const pagination: PaginationType = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page,
    pageCount: data?.filter?.pageCount || 1
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeCommission(id),
    onSuccess: () => {
      notification.success({
        message: t('toastSuccess.commission.delete'),
        duration: 2
      })
      queryClient.invalidateQueries({ queryKey: ['commissions'] })
    },
    onError: (err: any) => {
      notification.error({
        message: err?.message || 'Server Error',
        duration: 2
      })
    }
  })

  // Mutation for restore
  const restoreMutation = useMutation({
    mutationFn: (id: string) => restoreCommission(id),
    onSuccess: () => {
      notification.success({
        message: t('toastSuccess.commission.restore'),
        duration: 2
      })
      queryClient.invalidateQueries({ queryKey: ['commissions'] })
    },
    onError: (err: any) => {
      notification.error({
        message: err?.message,
        duration: 2
      })
    }
  })

  const handleChangeKeyword = (keyword: string) => {
    setPendingFilter({
      ...pendingFilter,
      search: keyword,
      page: 1
    })
  }

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dates)
    setPendingFilter({
      ...pendingFilter,
      dateRange:
        dates && dates[0] && dates[1]
          ? [
              dates[0].startOf('day').toISOString(),
              dates[1].endOf('day').toISOString()
            ]
          : undefined,
      page: 1
    })
  }

  const handleStatusChange = (value: 'all' | 'active' | 'deleted') => {
    setStatus(value)
    setPendingFilter({
      ...pendingFilter,
      status: value,
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

  const handleEditCommission = (commission: CommissionType) => {
    setEditedCommission(commission)
    setDrawerOpen(true)
    setIsAdd(false)
  }

  const handleAddCommission = () => {
    setEditedCommission(null)
    setDrawerOpen(true)
    setIsAdd(true)
  }

  const handleRemoveCommission = (commission: CommissionType) => {
    Modal.confirm({
      title: t('dialog.deleteCommission'),
      content: t('message.delete'),
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      okButtonProps: { danger: true },
      onOk: () => deleteMutation.mutate(commission._id)
    })
  }

  const handleRestoreCommission = (commission: CommissionType) => {
    Modal.confirm({
      title: t('dialog.restoreCommission'),
      content: t('message.restore'),
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      onOk: () => restoreMutation.mutate(commission._id)
    })
  }

  const columns: ColumnsType<CommissionType> = [
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
      title: t('commissionDetail.name'),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: CommissionType) => (
        <StoreCommissionLabel commission={record} />
      )
    },
    {
      title: t('commissionDetail.fee'),
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: any) =>
        fee?.$numberDecimal ? `${fee.$numberDecimal}%` : '-'
    },
    {
      title: t('commissionDetail.description'),
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => (
        <span style={{ width: 300, overflow: 'auto', display: 'inline-block' }}>
          {desc}
        </span>
      )
    },
    {
      title: t('status.status'),
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      render: (isDeleted: boolean) =>
        isDeleted ? <DeletedLabel /> : <ActiveLabel />
    },
    {
      title: t('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => humanReadableDate(date)
    },
    {
      title: t('action'),
      key: 'action',
      render: (_: any, commission: CommissionType) => (
        <div className='flex gap-2'>
          <Tooltip title={t('button.edit')}>
            <Button
              type='primary'
              size='middle'
              onClick={() => handleEditCommission(commission)}
              title={t('button.edit')}
              icon={<i className='fa-duotone fa-pen-to-square' />}
            />
          </Tooltip>
          {!commission.isDeleted ? (
            <Tooltip title={t('button.delete')}>
              <Button
                type='default'
                size='middle'
                danger
                onClick={() => handleRemoveCommission(commission)}
                icon={<i className='fa-solid fa-trash-alt' />}
                loading={
                  deleteMutation.isPending &&
                  deleteMutation.variables === commission._id
                }
              />
            </Tooltip>
          ) : (
            <Tooltip title={t('button.restore')}>
              <Button
                type='default'
                color='green'
                variant='outlined'
                size='middle'
                onClick={() => handleRestoreCommission(commission)}
                icon={<i className='fa-solid fa-trash-can-arrow-up' />}
                loading={
                  restoreMutation.isPending &&
                  restoreMutation.variables === commission._id
                }
              />
            </Tooltip>
          )}
        </div>
      )
    }
  ]

  const dataSource = commissions.map((commission, idx) => ({
    ...commission,
    key: commission._id || idx
  }))

  return (
    <div className='w-full relative'>
      {(deleteMutation.isPending || restoreMutation.isPending) && (
        <Spin
          spinning
          tip='Processing...'
          style={{
            zIndex: 9999,
            position: 'fixed',
            inset: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
      )}
      {error && <Alert message={error.message} type='error' />}
      <div className='p-3 bg-white rounded-md'>
        <div className='flex gap-3 items-center flex-wrap justify-between'>
          <div className='flex gap-4'>
            <SearchInput
              onChange={handleChangeKeyword}
              value={pendingFilter.search}
            />

            <Select
              style={{ minWidth: 120 }}
              value={status}
              onChange={handleStatusChange}
              options={[
                { label: t('filters.all'), value: 'all' },
                { label: t('status.active'), value: 'active' },
                { label: t('status.deleted'), value: 'deleted' }
              ]}
              placeholder={t('status.status')}
              allowClear
            />

            <DatePicker.RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              style={{ minWidth: 240 }}
              allowClear
              format='DD-MM-YYYY'
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
          <Button
            type='primary'
            onClick={handleAddCommission}
            className='items-end'
          >
            {t('commissionDetail.add')}
          </Button>
        </div>

        <Divider />

        <Table
          columns={columns}
          dataSource={dataSource}
          loading={isLoading}
          rowKey='_id'
          bordered
          pagination={{
            current: data?.filter?.pageCurrent || 1,
            pageSize: filter.limit,
            total: data?.size || 0,
            onChange: handleChangePage,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('of')} ${total} ${t('result')}`
          }}
          scroll={{ x: 'max-content' }}
        />

        <Drawer
          title={isAdd ? t('commissionDetail.add') : t('commissionDetail.edit')}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={400}
          destroyOnHidden
        >
          <AdminEditCommissionForm
            oldCommission={editedCommission || undefined}
            onRun={() => {
              queryClient.invalidateQueries({ queryKey: ['commissions'] })
              setDrawerOpen(false)
            }}
          />
        </Drawer>
      </div>
    </div>
  )
}

export default AdminCommissionTable
