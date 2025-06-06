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
  Modal,
  Spin
} from 'antd'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { listBrands, removeBrand, restoreBrand } from '../../apis/brand.api'
import useInvalidate from '../../hooks/useInvalidate'
import { BrandType } from '../../@types/entity.types'
import { useAntdApp } from '../../hooks/useAntdApp'
import { PaginationType } from '../../@types/pagination.type'
import SearchInput from '../ui/SearchInput'
import CategorySmallCard from '../card/CategorySmallCard'
import DeletedLabel from '../label/DeletedLabel'
import ActiveLabel from '../label/ActiveLabel'
import AdminEditBrandForm from '../item/form/AdminEditBrandForm'
import AdminCreateBrandForm from '../item/form/AdminCreateBrandForm'
import { humanReadableDate } from '../../helper/humanReadable'
import { ColumnsType } from 'antd/es/table'
import { BrandFilterState, defaultBrandFilter } from '../../@types/filter.type'

interface BrandsResponse {
  brands: BrandType[]
  size: number
  filter: { pageCurrent: number; pageCount: number }
}

const fetchBrands = async (filter: any): Promise<BrandsResponse> => {
  const res = await listBrands(filter)
  return res.data || res
}

const AdminBrandsTable = () => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const invalidate = useInvalidate()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [filter, setFilter] = useState<BrandFilterState>(defaultBrandFilter)
  const [pendingFilter, setPendingFilter] =
    useState<BrandFilterState>(defaultBrandFilter)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery<BrandsResponse, Error>({
    queryKey: ['brands', filter],
    queryFn: () => fetchBrands(filter)
  })
  const deleteMutation = useMutation({
    mutationFn: (brandId: string) => removeBrand(brandId),
    onSuccess: () => {
      notification.success({ message: t('toastSuccess.brand.delete') })
      invalidate({ queryKey: ['brands'] })
    },
    onError: () => {
      notification.error({ message: t('toastSuccess.brand.delete') })
    }
  })
  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: (brandId: string) => restoreBrand(brandId),
    onSuccess: () => {
      notification.success({ message: t('toastSuccess.brand.restore') })
      invalidate({ queryKey: ['brands'] })
    },
    onError: () => {
      notification.error({ message: t('toastSuccess.brand.restore') })
    }
  })

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (brandIds: string[]) => {
      return Promise.all(brandIds.map((id) => removeBrand(id)))
    },
    onSuccess: () => {
      notification.success({ message: t('toastSuccess.brand.delete') })
      invalidate({ queryKey: ['brands'] })
      setSelectedRowKeys([])
    },
    onError: () => {
      notification.error({ message: 'Bulk delete failed' })
    }
  })

  // Bulk restore mutation
  const bulkRestoreMutation = useMutation({
    mutationFn: async (brandIds: string[]) => {
      return Promise.all(brandIds.map((id) => restoreBrand(id)))
    },
    onSuccess: () => {
      notification.success({ message: t('toastSuccess.brand.restore') })
      invalidate({ queryKey: ['brands'] })
      setSelectedRowKeys([])
    },
    onError: () => {
      notification.error({ message: 'Bulk restore failed' })
    }
  })

  const brands: BrandType[] = data?.brands || []
  const pagination: PaginationType = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page || 1,
    pageCount: data?.filter?.pageCount || 1
  }

  const handleChangePage = (newPage: number) => {
    setFilter({
      ...filter,
      page: newPage
    })
  }
  const handleDelete = (brand: BrandType) => {
    Modal.confirm({
      title: t('brandDetail.del'),
      content: `${t('confirmDelete')} "${brand.name}"?`,
      okText: t('button.delete'),
      cancelText: t('button.cancel'),
      okType: 'danger',
      onOk: () => deleteMutation.mutate(brand._id)
    })
  }

  const handleRestore = (brand: BrandType) => {
    Modal.confirm({
      title: t('brandDetail.res'),
      content: `${t('confirmRestore')} "${brand.name}"?`,
      okText: t('button.restore'),
      cancelText: t('button.cancel'),
      onOk: () => restoreMutation.mutate(brand._id)
    })
  }

  const handleBulkDelete = () => {
    const activeBrands = brands.filter(
      (brand) => selectedRowKeys.includes(brand._id) && !brand.isDeleted
    )

    Modal.confirm({
      title: `${t('brandDetail.del')} (${activeBrands.length} ${t('items')})`,
      content: `${t('confirmDeleteSelected')} ${activeBrands.length} ${t('brands')}?`,
      okText: t('button.delete'),
      cancelText: t('button.cancel'),
      okType: 'danger',
      onOk: () =>
        bulkDeleteMutation.mutate(
          selectedRowKeys.filter((id) => {
            const brand = brands.find((b) => b._id === id)
            return brand && !brand.isDeleted
          })
        )
    })
  }

  const handleBulkRestore = () => {
    const deletedBrands = brands.filter(
      (brand) => selectedRowKeys.includes(brand._id) && brand.isDeleted
    )

    Modal.confirm({
      title: `${t('brandDetail.res')} (${deletedBrands.length} ${t('items')})`,
      content: `${t('confirmRestoreSelected')} ${deletedBrands.length} ${t('brands')}?`,
      okText: t('button.restore'),
      cancelText: t('button.cancel'),
      onOk: () =>
        bulkRestoreMutation.mutate(
          selectedRowKeys.filter((id) => {
            const brand = brands.find((b) => b._id === id)
            return brand && brand.isDeleted
          })
        )
    })
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys as string[])
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: BrandType) => ({
      name: record.name
    })
  }

  const hasSelected = selectedRowKeys.length > 0
  const selectedBrands = brands.filter((brand) =>
    selectedRowKeys.includes(brand._id)
  )
  const selectedDeletedBrands = selectedBrands.filter(
    (brand) => brand.isDeleted
  )
  const selectedActiveBrands = selectedBrands.filter(
    (brand) => !brand.isDeleted
  )

  const handleCategoryChange = (value: string) => {
    setPendingFilter((prev) => ({ ...prev, categoryId: value, page: 1 }))
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
    setFilter({ ...pendingFilter })
  }

  const columns: ColumnsType<BrandType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) =>
        index + 1 + (filter.page || 1) * (filter.limit || 10),
      width: 50
    },
    {
      title: t('brandDetail.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string) => <span>{text}</span>
    },
    {
      title: t('brandDetail.categories'),
      dataIndex: 'categoryIds',
      key: 'categoryIds',
      render: (categories: any[]) => (
        <div style={{ maxHeight: 200, overflow: 'auto' }}>
          <Space direction='vertical' size='small'>
            {categories.map((category, idx) => (
              <div key={idx}>
                <CategorySmallCard category={category} />
              </div>
            ))}
          </Space>
        </div>
      )
    },
    {
      title: t('status.status'),
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      width: 100,
      align: 'center',
      render: (isDeleted: boolean) =>
        isDeleted ? <DeletedLabel /> : <ActiveLabel />
    },
    {
      title: t('brandDetail.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      align: 'right',
      sorter: true,
      render: (date: string) => humanReadableDate(date)
    },
    {
      title: t('action'),
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (_: any, brand: BrandType) => (
        <Space size='small'>
          <Tooltip title={t('button.edit')}>
            <Button
              variant='filled'
              size='small'
              icon={<i className='fa-duotone fa-pen-to-square' />}
              onClick={() => {
                setEditingBrandId(brand._id)
                setDrawerOpen(true)
              }}
            />
          </Tooltip>
          <Tooltip
            title={!brand.isDeleted ? t('button.delete') : t('button.restore')}
          >
            <Button
              variant='filled'
              size='small'
              danger={!brand.isDeleted}
              loading={
                !brand.isDeleted
                  ? deleteMutation.isPending
                  : restoreMutation.isPending
              }
              icon={
                !brand.isDeleted ? (
                  <i className='fa-solid fa-trash-alt' />
                ) : (
                  <i className='fa-solid fa-trash-can-arrow-up' />
                )
              }
              onClick={() =>
                !brand.isDeleted ? handleDelete(brand) : handleRestore(brand)
              }
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    setFilter((prev) => ({
      ...prev,
      sortBy: sorter.field || prev.sortBy,
      order:
        sorter.order === 'ascend'
          ? 'asc'
          : sorter.order === 'descend'
            ? 'desc'
            : prev.order
    }))
  }

  return (
    <div>
      {error && <Alert message={error.message} type='error' showIcon />}
      <Spin spinning={isLoading} size='large'>
        <div className='p-3 bg-white rounded-md'>
          <div className='flex justify-between items-center'>
            <div className='flex gap-3 items-center flex-wrap'>
              <SearchInput
                value={pendingFilter.search || ''}
                onChange={(keyword) =>
                  setPendingFilter((prev) => ({
                    ...prev,
                    search: keyword,
                    page: 1
                  }))
                }
                onSearch={handleSearch}
              />
              <DatePicker.RangePicker
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
              <Button type='primary' onClick={handleSearch}>
                {t('search')}
              </Button>
              <Tooltip title={t('button.refresh')}>
                <Button
                  onClick={() => invalidate({ queryKey: ['brands'] })}
                  className='!w-10'
                  type='default'
                  loading={isLoading}
                  icon={<i className='fa fa-refresh' />}
                />
              </Tooltip>
            </div>
            <Button
              type='primary'
              onClick={() => {
                setEditingBrandId(null)
                setDrawerOpen(true)
              }}
              icon={<i className='fa-light fa-plus' />}
            >
              <span className='res-hide'>{t('brandDetail.add')}</span>
            </Button>
          </div>
          {hasSelected && (
            <div className='mb-4 p-3 bg-gray-50 rounded-md'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>
                  {t('selected')}: {selectedRowKeys.length} {t('items')}
                </span>
                <Space>
                  {selectedActiveBrands.length > 0 && (
                    <Button
                      type='primary'
                      danger
                      size='small'
                      loading={bulkDeleteMutation.isPending}
                      onClick={handleBulkDelete}
                      icon={<i className='fa-solid fa-trash-alt' />}
                    >
                      {t('button.delete')} ({selectedActiveBrands.length})
                    </Button>
                  )}
                  {selectedDeletedBrands.length > 0 && (
                    <Button
                      type='default'
                      size='small'
                      loading={bulkRestoreMutation.isPending}
                      onClick={handleBulkRestore}
                      icon={<i className='fa-solid fa-trash-can-arrow-up' />}
                    >
                      {t('button.restore')} ({selectedDeletedBrands.length})
                    </Button>
                  )}
                  <Button
                    size='small'
                    onClick={() => setSelectedRowKeys([])}
                    icon={<i className='fa-solid fa-times' />}
                  >
                    {t('button.clear')}
                  </Button>
                </Space>
              </div>
            </div>
          )}
          <Divider />
          <Table
            columns={columns}
            dataSource={brands}
            rowKey='_id'
            loading={isLoading}
            rowSelection={rowSelection}
            pagination={{
              current: pagination.pageCurrent,
              pageSize: filter.limit,
              total: pagination.size,
              onChange: handleChangePage,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} ${t('of')} ${total} ${t('result')}`
            }}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </Spin>
      <Drawer
        title={editingBrandId ? t('brandDetail.edit') : t('brandDetail.add')}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={700}
        destroyOnHidden
      >
        {editingBrandId ? (
          <AdminEditBrandForm brandId={editingBrandId} />
        ) : (
          <AdminCreateBrandForm />
        )}
      </Drawer>
    </div>
  )
}

export default AdminBrandsTable
