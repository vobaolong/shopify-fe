import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Table,
  Button,
  Space,
  Tooltip,
  Alert,
  Drawer,
  DatePicker,
  Divider,
  notification,
  Modal,
  Spin,
  Tabs,
  Select,
  Typography
} from 'antd'
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons'
import { getToken } from '../../apis/auth.api'
import {
  listUserLevels,
  removeUserLevel,
  restoreUserLevel,
  listStoreLevels,
  removeStoreLevel,
  restoreStoreLevel
} from '../../apis/level.api'
import useInvalidate from '../../hooks/useInvalidate'
import { PaginationType } from '../../@types/pagination.type'
import { LevelType } from '../../@types/entity.types'
import SearchInput from '../ui/SearchInput'
import ActiveLabel from '../label/ActiveLabel'
import LevelLabel from '../label/LevelLabel'
import AdminCreateUserLevelItem from '../item/AdminCreateUserLevelItem'
import AdminCreateStoreLevelItem from '../item/AdminCreateStoreLevelItem'
import AdminUserLevelForm from '../item/form/AdminUserLevelForm'
import AdminStoreLevelForm from '../item/form/AdminStoreLevelForm'
import { humanReadableDate } from '../../helper/humanReadable'
import { ColumnsType } from 'antd/es/table'

interface LevelsResponse {
  levels: LevelType[]
  size: number
  filter: { pageCurrent: number; pageCount: number }
}

interface FilterState {
  search: string
  sortBy: string
  order: 'asc' | 'desc'
  limit: number
  page: number
  createdAtFrom?: string
  createdAtTo?: string
  status?: string
}

const defaultFilter: FilterState = {
  search: '',
  sortBy: 'point',
  order: 'asc',
  limit: 6,
  page: 1,
  createdAtFrom: undefined,
  createdAtTo: undefined,
  status: 'all'
}

const AdminLevelsTable = () => {
  const { t } = useTranslation()
  const invalidate = useInvalidate()
  const { _id: userId } = getToken()
  const [activeTab, setActiveTab] = useState('userLevels')
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [filter, setFilter] = useState(defaultFilter)
  const [pendingFilter, setPendingFilter] = useState(defaultFilter)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<any>(null)

  const fetchLevels = async (filter: any): Promise<LevelsResponse> => {
    const res =
      activeTab === 'userLevels'
        ? await listUserLevels(filter)
        : await listStoreLevels(filter)
    return res.data || res
  }

  const { data, isLoading, error } = useQuery<LevelsResponse, Error>({
    queryKey: [activeTab, filter],
    queryFn: () => fetchLevels(filter),
    enabled: !!userId
  })
  const deleteMutation = useMutation({
    mutationFn: (levelId: string) =>
      activeTab === 'userLevels'
        ? removeUserLevel(levelId)
        : removeStoreLevel(levelId),
    onSuccess: () => {
      notification.success({ message: t('toastSuccess.level.delete') })
      invalidate({ queryKey: [activeTab] })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || t('toastError.level.delete')
      notification.error({ message: errorMessage })
    }
  })

  const restoreMutation = useMutation({
    mutationFn: (levelId: string) =>
      activeTab === 'userLevels'
        ? restoreUserLevel(levelId)
        : restoreStoreLevel(levelId),
    onSuccess: () => {
      notification.success({ message: t('toastSuccess.level.restore') })
      invalidate({ queryKey: [activeTab] })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || t('toastError.level.restore')
      notification.error({ message: errorMessage })
    }
  })
  const handleFilterChange = (updates: Partial<FilterState>) => {
    setPendingFilter((prev) => ({
      ...prev,
      ...updates,
      page: 1
    }))
  }

  const handleSearch = () => {
    setFilter({ ...pendingFilter })
  }
  const handleChangePage = (page: number, pageSize: number) => {
    setFilter((prev) => ({ ...prev, page, limit: pageSize }))
  }

  const handleFilterReset = () => {
    setFilter(defaultFilter)
    setPendingFilter(defaultFilter)
    setDateRange(null)
  }

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates)
    if (dates && dates[0] && dates[1]) {
      handleFilterChange({
        createdAtFrom: dates[0].startOf('day').toISOString(),
        createdAtTo: dates[1].endOf('day').toISOString()
      })
    } else {
      handleFilterChange({
        createdAtFrom: undefined,
        createdAtTo: undefined
      })
    }
  }
  const handleDelete = (levelId: string) => {
    Modal.confirm({
      title: t('levelDetail.delete'),
      content: t('message.delete'),
      onOk: () => deleteMutation.mutate(levelId),
      okText: t('button.delete'),
      cancelText: t('button.cancel'),
      okType: 'danger'
    })
  }

  const handleRestore = (levelId: string) => {
    Modal.confirm({
      title: t('levelDetail.restore'),
      content: t('message.restore'),
      onOk: () => restoreMutation.mutate(levelId),
      okText: t('button.restore'),
      cancelText: t('button.cancel')
    })
  }

  const handleEdit = (levelId: string) => {
    setEditingLevelId(levelId)
    setDrawerOpen(true)
  }
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: t('levelDetail.delete'),
      content: t('message.bulkDelete', { count: selectedRowKeys.length }),
      onOk: () => {
        selectedRowKeys.forEach((levelId) => deleteMutation.mutate(levelId))
        setSelectedRowKeys([])
      },
      okText: t('button.delete'),
      cancelText: t('button.cancel'),
      okType: 'danger'
    })
  }

  const handleBulkRestore = () => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: t('levelDetail.restore'),
      content: t('message.bulkRestore', { count: selectedRowKeys.length }),
      onOk: () => {
        selectedRowKeys.forEach((levelId) => restoreMutation.mutate(levelId))
        setSelectedRowKeys([])
      },
      okText: t('button.restore'),
      cancelText: t('button.cancel')
    })
  }
  const handleTabChange = (key: string) => {
    setActiveTab(key)
    setSelectedRowKeys([])
    handleFilterReset()
  }

  const columns: ColumnsType<LevelType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center' as const,
      fixed: 'left',
      render: (_: any, __: any, idx: number) =>
        (pagination.pageCurrent - 1) * filter.limit + idx + 1,
      width: 60
    },
    {
      title: t('levelDetail.name'),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: LevelType) => <LevelLabel level={record} />
    },
    {
      title: t('levelDetail.floorPoint'),
      dataIndex: 'minPoint',
      key: 'minPoint',
      sorter: true,
      render: (minPoint: number) => minPoint,
      align: 'right' as const,
      width: 150
    },
    {
      title: t('levelDetail.discount'),
      dataIndex: 'discount',
      key: 'discount',
      sorter: true,
      render: (discount: { $numberDecimal: string }) =>
        discount ? `${discount.$numberDecimal}%` : '0%',
      align: 'right' as const,
      width: 150
    },
    {
      title: t('status.status'),
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      width: 150,
      align: 'center' as const,
      render: (isDeleted: boolean) => <ActiveLabel isDeleted={isDeleted} />
    },
    {
      title: t('levelDetail.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      align: 'right' as const,
      width: 150,
      render: (createdAt: string) => humanReadableDate(createdAt)
    },
    {
      title: t('action'),
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: LevelType) => (
        <Space size='small'>
          <Tooltip title={t('button.edit')}>
            <Button
              type='default'
              size='small'
              color='blue'
              icon={<i className='fa-solid fa-pen' />}
              onClick={() => handleEdit(record._id)}
            />
          </Tooltip>
          {record.isDeleted ? (
            <Tooltip title={t('button.restore')}>
              <Button
                type='default'
                size='small'
                icon={<SyncOutlined />}
                onClick={() => handleRestore(record._id)}
                loading={restoreMutation.isPending}
                className='default-green-600 hover:text-green-700'
              />
            </Tooltip>
          ) : (
            <Tooltip title={t('button.delete')}>
              <Button
                type='default'
                size='small'
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record._id)}
                loading={deleteMutation.isPending}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ]

  const levels = data?.levels || []
  const pagination: PaginationType = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page,
    pageCount: data?.filter?.pageCount || 1
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as string[])
    }
  }

  const hasSelected = selectedRowKeys.length > 0
  const hasDeletedSelected = levels
    .filter((level) => selectedRowKeys.includes(level._id))
    .some((level) => level.isDeleted)
  const hasActiveSelected = levels
    .filter((level) => selectedRowKeys.includes(level._id))
    .some((level) => !level.isDeleted)
  // Filter options
  const statusFilterOptions = [
    { label: t('filters.all'), value: 'all' },
    { label: t('status.active'), value: 'active' },
    { label: t('status.deleted'), value: 'deleted' }
  ]

  const tabItems = [
    {
      key: 'userLevels',
      label: <span>{t('levelDetail.userLevel.userLevel')}</span>
    },
    {
      key: 'storeLevels',
      label: <span>{t('levelDetail.storeLevel.storeLevel')}</span>
    }
  ]

  return (
    <div className='w-full'>
      {error && (
        <Alert message={error.message} type='error' className='mb-4' showIcon />
      )}
      <Spin
        spinning={
          isLoading || deleteMutation.isPending || restoreMutation.isPending
        }
        size='large'
      >
        <div className='p-3 bg-white rounded-md'>
          {/* Tabs Section */}
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            size='large'
          />{' '}
          {/* Shared Filter Section */}
          <div className='flex gap-3 items-center flex-wrap mb-3'>
            {' '}
            <SearchInput
              value={pendingFilter.search || ''}
              onChange={(keyword) => handleFilterChange({ search: keyword })}
              onSearch={handleSearch}
              loading={isLoading}
            />
            <Select
              style={{ minWidth: 140 }}
              value={pendingFilter.status}
              onChange={(value) => handleFilterChange({ status: value })}
              options={statusFilterOptions}
              placeholder={t('status.status')}
              allowClear
            />
            <DatePicker.RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              className='min-w-[240px]'
              allowClear
              format='DD-MM-YYYY'
              placeholder={[t('filters.fromDate'), t('filters.toDate')]}
            />{' '}
            <Button type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button onClick={handleFilterReset} type='default'>
              {t('button.reset')}
            </Button>
            <Button
              onClick={() => invalidate({ queryKey: [activeTab] })}
              className='!w-10 flex items-center justify-center'
              type='default'
              loading={isLoading}
              icon={<SyncOutlined spin={isLoading} />}
            />
            {/* Tab-specific create button */}
            {activeTab === 'userLevels' ? (
              <AdminCreateUserLevelItem />
            ) : (
              <AdminCreateStoreLevelItem />
            )}
          </div>
          <div>
            {/* Bulk Actions */}
            {hasSelected && (
              <div className='flex items-center gap-4 mb-4 p-3 bg-blue-50 rounded-lg'>
                <span className='text-sm text-gray-600'>
                  {t('table.selectedCount', { count: selectedRowKeys.length })}
                </span>
                <div className='flex gap-2'>
                  {hasActiveSelected && (
                    <Button
                      size='small'
                      danger
                      onClick={handleBulkDelete}
                      loading={deleteMutation.isPending}
                      icon={<DeleteOutlined />}
                    >
                      {t('button.bulkDelete')}
                    </Button>
                  )}
                  {hasDeletedSelected && (
                    <Button
                      color='green'
                      type='text'
                      size='small'
                      onClick={handleBulkRestore}
                      loading={restoreMutation.isPending}
                      icon={<SyncOutlined />}
                    >
                      {t('button.bulkRestore')}
                    </Button>
                  )}
                </div>{' '}
              </div>
            )}
            <Divider />
            <Table
              rowKey='_id'
              columns={columns}
              dataSource={levels}
              rowSelection={rowSelection}
              loading={false}
              pagination={{
                current: pagination.pageCurrent,
                pageSize: filter.limit,
                total: pagination.size,
                onChange: handleChangePage,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} ${t('of')} ${total} ${t('result')}`,
                pageSizeOptions: [5, 10, 20, 50],
                showSizeChanger: true
              }}
              onChange={(_, __, sorter: any) => {
                if (!Array.isArray(sorter) && sorter.field) {
                  setFilter((prev) => ({
                    ...prev,
                    sortBy: sorter.field as string,
                    order: sorter.order === 'ascend' ? 'asc' : 'desc'
                  }))
                }
              }}
              scroll={{ x: 'max-content' }}
              className='overflow-hidden'
              bordered
            />
          </div>
        </div>
      </Spin>

      {/* Edit Drawer */}
      <Drawer
        title={t('levelDetail.edit')}
        placement='right'
        onClose={() => {
          setDrawerOpen(false)
          setEditingLevelId(null)
        }}
        open={drawerOpen}
        width={400}
        className='edit-drawer'
      >
        {' '}
        {editingLevelId && activeTab === 'userLevels' && (
          <AdminUserLevelForm
            mode='edit'
            oldLevel={levels.find((level) => level._id === editingLevelId)}
            onRun={() => {
              invalidate({ queryKey: ['userLevels'] })
              setDrawerOpen(false)
              setEditingLevelId(null)
            }}
          />
        )}{' '}
        {editingLevelId && activeTab === 'storeLevels' && (
          <AdminStoreLevelForm
            mode='edit'
            oldLevel={levels.find((level) => level._id === editingLevelId)}
            onRun={() => {
              invalidate({ queryKey: ['storeLevels'] })
              setDrawerOpen(false)
              setEditingLevelId(null)
            }}
          />
        )}
      </Drawer>
    </div>
  )
}

export default AdminLevelsTable
