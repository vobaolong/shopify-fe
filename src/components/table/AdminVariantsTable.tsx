import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Table,
  Button,
  Space,
  Tooltip,
  Alert,
  Select,
  Modal,
  Spin,
  Tag,
  Divider
} from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { getToken } from '../../apis/auth.api'
import {
  listVariants,
  removeVariant,
  restoreVariant
} from '../../apis/variant.api'
import useInvalidate from '../../hooks/useInvalidate'
import { useAntdApp } from '../../hooks/useAntdApp'
import { PaginationType } from '../../@types/pagination.type'
import SearchInput from '../ui/SearchInput'
import DeletedLabel from '../label/DeletedLabel'
import ActiveLabel from '../label/ActiveLabel'
import CategorySmallCard from '../card/CategorySmallCard'
import { humanReadableDate } from '../../helper/humanReadable'
import { ColumnsType } from 'antd/es/table'
import {
  VariantFilterState,
  defaultVariantFilter
} from '../../@types/filter.type'

interface VariantsResponse {
  variants: any[]
  size: number
  filter: { pageCurrent: number; pageCount: number }
}

const AdminVariantsTable = ({ heading = false }) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const invalidate = useInvalidate()
  const { _id: userId } = getToken()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [filter, setFilter] = useState<VariantFilterState>(defaultVariantFilter)
  const [pendingFilter, setPendingFilter] =
    useState<VariantFilterState>(defaultVariantFilter)

  const fetchVariants = async (filter: any): Promise<VariantsResponse> => {
    const res = await listVariants(userId, filter)
    return res.data || res
  }

  const { data, isLoading, error } = useQuery<VariantsResponse, Error>({
    queryKey: ['variants', filter],
    queryFn: () => fetchVariants(filter),
    enabled: !!userId
  })

  const deleteMutation = useMutation({
    mutationFn: (variantId: string) => removeVariant(userId, variantId),
    onSuccess: () => {
      notification.success({ message: t('toastSuccess.variant.delete') })
      invalidate({ queryKey: ['variants'] })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || t('toastError.variant.delete')
      notification.error({ message: errorMessage })
    }
  })

  const restoreMutation = useMutation({
    mutationFn: (variantId: string) => restoreVariant(userId, variantId),
    onSuccess: () => {
      notification.success({ message: t('toastSuccess.variant.restore') })
      invalidate({ queryKey: ['variants'] })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || t('toastError.variant.restore')
      notification.error({ message: errorMessage })
    }
  })

  const handleFilterChange = (updates: Partial<VariantFilterState>) => {
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
    setFilter(defaultVariantFilter)
    setPendingFilter(defaultVariantFilter)
  }

  const handleDelete = (variantId: string) => {
    Modal.confirm({
      title: t('variantDetail.del'),
      content: t('message.delete'),
      onOk: () => deleteMutation.mutate(variantId),
      okText: t('button.delete'),
      cancelText: t('button.cancel'),
      okType: 'danger'
    })
  }

  const handleRestore = (variantId: string) => {
    Modal.confirm({
      title: t('variantDetail.res'),
      content: t('message.restore'),
      onOk: () => restoreMutation.mutate(variantId),
      okText: t('button.restore'),
      cancelText: t('button.cancel')
    })
  }

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: t('variantDetail.del'),
      content: t('message.bulkDelete', { count: selectedRowKeys.length }),
      onOk: () => {
        selectedRowKeys.forEach((variantId) => deleteMutation.mutate(variantId))
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
      title: t('variantDetail.res'),
      content: t('message.bulkRestore', { count: selectedRowKeys.length }),
      onOk: () => {
        selectedRowKeys.forEach((variantId) =>
          restoreMutation.mutate(variantId)
        )
        setSelectedRowKeys([])
      },
      okText: t('button.restore'),
      cancelText: t('button.cancel')
    })
  }
  const columns: ColumnsType<any> = [
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
      title: t('variantDetail.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className='font-medium'>{name}</span>,
      width: 150
    },
    {
      title: t('variantDetail.categories'),
      dataIndex: 'categoryIds',
      key: 'categoryIds',
      render: (categoryIds: any[]) => (
        <div className='flex flex-col gap-1 max-h-32 overflow-auto'>
          {categoryIds.map((category, index) => (
            <Tag key={index} className='text-xs'>
              <CategorySmallCard category={category} />
            </Tag>
          ))}
        </div>
      ),
      width: 300
    },
    {
      title: t('status.status'),
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      width: 100,
      align: 'center' as const,
      render: (isDeleted: boolean) =>
        isDeleted ? <DeletedLabel /> : <ActiveLabel />
    },
    {
      title: t('variantDetail.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      align: 'right' as const,
      width: 140,
      render: (createdAt: string) => humanReadableDate(createdAt)
    },
    {
      title: t('action'),
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space size='small'>
          <Tooltip title={t('button.detail')}>
            <Link to={`/admin/variant/values/${record._id}`}>
              <Button
                type='default'
                size='small'
                icon={<i className='fa-solid fa-circle-info' />}
              />
            </Link>
          </Tooltip>
          <Tooltip title={t('button.edit')}>
            <Link to={`/admin/variant/edit/${record._id}`}>
              <Button
                type='primary'
                size='small'
                icon={<i className='fa-duotone fa-pen-to-square' />}
              />
            </Link>
          </Tooltip>
          {record.isDeleted ? (
            <Tooltip title={t('button.restore')}>
              <Button
                type='default'
                size='small'
                icon={<i className='fa-solid fa-trash-can-arrow-up' />}
                onClick={() => handleRestore(record._id)}
                loading={restoreMutation.isPending}
                className='text-green-600 border-green-600 hover:text-green-700 hover:border-green-700'
              />
            </Tooltip>
          ) : (
            <Tooltip title={t('button.delete')}>
              <Button
                type='default'
                danger
                size='small'
                icon={<i className='fa-solid fa-trash-alt' />}
                onClick={() => handleDelete(record._id)}
                loading={deleteMutation.isPending}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ]

  const variants = data?.variants || []
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
  const hasDeletedSelected = variants
    .filter((variant) => selectedRowKeys.includes(variant._id))
    .some((variant) => variant.isDeleted)
  const hasActiveSelected = variants
    .filter((variant) => selectedRowKeys.includes(variant._id))
    .some((variant) => !variant.isDeleted)

  // Filter options
  const statusFilterOptions = [
    { label: t('filters.all'), value: 'all' },
    { label: t('status.active'), value: 'active' },
    { label: t('status.deleted'), value: 'deleted' }
  ]

  return (
    <div className='w-full'>
      {error && (
        <Alert message={error.message} type='error' className='mb-4' showIcon />
      )}
      <Spin spinning={isLoading} size='large'>
        <div className='p-3 bg-white rounded-md'>
          <div className='flex gap-3 items-center flex-wrap mb-3'>
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
            <Button type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button onClick={handleFilterReset} type='default'>
              {t('button.reset')}
            </Button>
            <Button
              onClick={() => invalidate({ queryKey: ['variants'] })}
              className='!w-10 flex items-center justify-center'
              type='default'
              loading={isLoading}
              icon={<SyncOutlined spin={isLoading} />}
            />
            <Link to='/admin/variant/create'>
              <Button type='primary' icon={<i className='fa-light fa-plus' />}>
                <span className='hidden sm:inline'>
                  {t('variantDetail.add')}
                </span>
              </Button>
            </Link>
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
                      icon={<i className='fa-solid fa-trash-alt' />}
                    >
                      {t('button.bulkDelete')}
                    </Button>
                  )}
                  {hasDeletedSelected && (
                    <Button
                      size='small'
                      onClick={handleBulkRestore}
                      loading={restoreMutation.isPending}
                      icon={<i className='fa-solid fa-trash-can-arrow-up' />}
                      className='text-green-600 border-green-600 hover:text-green-700 hover:border-green-700'
                    >
                      {t('button.bulkRestore')}
                    </Button>
                  )}
                </div>
              </div>
            )}
            <Divider />
            <Table
              rowKey='_id'
              columns={columns}
              dataSource={variants}
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
    </div>
  )
}

export default AdminVariantsTable
