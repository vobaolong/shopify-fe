import React, { useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Table,
  Button,
  Space,
  Tooltip,
  Alert,
  Modal,
  Typography,
  Spin,
  Select
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  UndoOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { useAntdApp } from '../../hooks/useAntdApp'
import DeletedLabel from '../label/DeletedLabel'
import ActiveLabel from '../label/ActiveLabel'
import AddVariantValueItem from '../item/AddVariantValueItem'
import AdminEditVariantValueForm from '../item/form/AdminEditVariantValueForm'
import SearchInput from '../ui/SearchInput'
import { humanReadableDate } from '../../helper/humanReadable'
import { ColumnsType } from 'antd/es/table'
import { PaginationType } from '../../@types/pagination.type'
import {
  VariantValueFilterState,
  defaultVariantValueFilter
} from '../../@types/filter.type'
import {
  useVariantValues,
  useRemoveVariantValue,
  useRestoreVariantValue
} from '../../hooks/useVariantValue'

const { Text } = Typography

const VariantValuesTable = ({ variantId = '', isActive = false }) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [editedVariantValue, setEditedVariantValue] = useState<any>({})
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [filter, setFilter] = useState<VariantValueFilterState>({
    ...defaultVariantValueFilter,
    variantId
  })
  const [pendingFilter, setPendingFilter] = useState<VariantValueFilterState>({
    ...defaultVariantValueFilter,
    variantId
  })

  const { data, isLoading, error, refetch } = useVariantValues(
    variantId,
    isActive,
    isActive ? {} : filter
  )
  const deleteMutation = useRemoveVariantValue()
  const restoreMutation = useRestoreVariantValue()

  const variantValues = data?.variantValues || []
  const variant = data?.variant || {}
  const pagination: PaginationType = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page || 1,
    pageCount: data?.filter?.pageCount || 1
  }
  const handleFilterChange = (updates: Partial<VariantValueFilterState>) => {
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
    const resetFilter = { ...defaultVariantValueFilter, variantId }
    setFilter(resetFilter)
    setPendingFilter(resetFilter)
  }

  const handleEditClick = (value: any) => {
    setEditedVariantValue(value)
    setEditModalVisible(true)
  }
  const handleEditModalClose = () => {
    setEditModalVisible(false)
  }

  const handleDelete = (variantValue: any) => {
    if (!variantValue?._id) {
      notification.error({ message: 'Invalid variant value selected' })
      return
    }

    Modal.confirm({
      title: t('dialog.deleteValue'),
      content: t('message.confirmDelete'),
      okText: t('button.delete'),
      cancelText: t('button.cancel'),
      okType: 'danger',
      onOk: () => {
        deleteMutation.mutate(variantValue._id, {
          onSuccess: (data) => {
            const response = data.data || data
            if (response.error) {
              notification.error({ message: response.error })
            } else {
              notification.success({
                message: t('toastSuccess.variantValue.delete')
              })
              refetch() // Refresh the data
            }
          },
          onError: (error) => {
            console.error('Delete error:', error)
            notification.error({
              message: 'Failed to delete item. Please try again.'
            })
          }
        })
      }
    })
  }

  const handleRestore = (variantValue: any) => {
    if (!variantValue?._id) {
      notification.error({ message: 'Invalid variant value selected' })
      return
    }

    Modal.confirm({
      title: t('dialog.restoreValue'),
      content: t('message.confirmRestore'),
      okText: t('button.restore'),
      cancelText: t('button.cancel'),
      onOk: () => {
        restoreMutation.mutate(variantValue._id, {
          onSuccess: (data) => {
            const response = data.data || data
            if (response.error) {
              notification.error({ message: response.error })
            } else {
              notification.success({
                message: t('toastSuccess.variantValue.restore')
              })
              refetch() // Refresh the data
            }
          },
          onError: (error) => {
            console.error('Restore error:', error)
            notification.error({
              message: 'Failed to restore item. Please try again.'
            })
          }
        })
      }
    })
  }
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: t('dialog.deleteValue'),
      content: t('message.bulkDelete', { count: selectedRowKeys.length }),
      onOk: async () => {
        try {
          // Process deletions sequentially to avoid overwhelming the server
          for (const valueId of selectedRowKeys) {
            await deleteMutation.mutateAsync(valueId)
          }
          notification.success({
            message:
              t('toastSuccess.variantValue.bulkDelete', {
                count: selectedRowKeys.length
              }) || `Successfully deleted ${selectedRowKeys.length} items`
          })
          setSelectedRowKeys([])
          refetch() // Refresh the data
        } catch (error) {
          console.error('Bulk delete error:', error)
          notification.error({
            message: 'Failed to delete some items. Please try again.'
          })
        }
      },
      okText: t('button.delete'),
      cancelText: t('button.cancel'),
      okType: 'danger'
    })
  }
  const handleBulkRestore = () => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: t('dialog.restoreValue'),
      content: t('message.bulkRestore', { count: selectedRowKeys.length }),
      onOk: async () => {
        try {
          for (const valueId of selectedRowKeys) {
            await restoreMutation.mutateAsync(valueId)
          }
          notification.success({
            message:
              t('toastSuccess.variantValue.bulkRestore', {
                count: selectedRowKeys.length
              }) || `Successfully restored ${selectedRowKeys.length} items`
          })
          setSelectedRowKeys([])
          refetch()
        } catch (error) {
          notification.error({
            message: 'Failed to restore some items. Please try again.'
          })
        }
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
      width: 50,
      render: (_: any, __: any, index: number) =>
        (pagination.pageCurrent - 1) * (filter.limit || 8) + index + 1,
      align: 'center' as const
    },
    {
      title: t('variantDetail.value.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text>{name}</Text>
    },
    ...(isActive
      ? []
      : [
          {
            title: t('status.status'),
            dataIndex: 'isDeleted',
            key: 'status',
            width: 100,
            render: (isDeleted: boolean) =>
              isDeleted ? <DeletedLabel /> : <ActiveLabel />
          },
          {
            title: t('createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            align: 'right' as const,
            sorter: true,
            render: (date: string) => <Text>{humanReadableDate(date)}</Text>
          },
          {
            title: t('action'),
            key: 'action',
            width: 120,
            align: 'center' as const,
            fixed: 'right' as const,
            render: (_: any, record: any) => (
              <Space size='small'>
                <Tooltip title={t('button.edit')}>
                  <Button
                    type='primary'
                    ghost
                    size='small'
                    icon={<EditOutlined />}
                    onClick={() => handleEditClick(record)}
                  />
                </Tooltip>
                {!record.isDeleted ? (
                  <Tooltip title={t('button.delete')}>
                    <Button
                      type='primary'
                      danger
                      ghost
                      size='small'
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(record)}
                      loading={deleteMutation.isPending}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title={t('button.restore')}>
                    <Button
                      type='primary'
                      ghost
                      size='small'
                      icon={<UndoOutlined />}
                      onClick={() => handleRestore(record)}
                      loading={restoreMutation.isPending}
                    />
                  </Tooltip>
                )}
              </Space>
            )
          }
        ])
  ]
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as string[])
    }
  }

  const hasSelected = selectedRowKeys.length > 0
  const hasDeletedSelected = variantValues
    .filter((value: any) => value?._id && selectedRowKeys.includes(value._id))
    .some((value: any) => value.isDeleted)
  const hasActiveSelected = variantValues
    .filter((value: any) => value?._id && selectedRowKeys.includes(value._id))
    .some((value: any) => !value.isDeleted)

  const statusFilterOptions = [
    { label: t('filters.all'), value: 'all' },
    { label: t('status.active'), value: 'active' },
    { label: t('status.deleted'), value: 'deleted' }
  ]

  return (
    <div className='w-full'>
      {error && (
        <Alert
          message='Error loading variant values'
          description={error?.message || 'An error occurred'}
          type='error'
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Spin spinning={isLoading} size='large'>
        <div className='p-3 bg-white rounded-md'>
          {!isActive && (
            <div className='flex gap-3 items-center flex-wrap mb-3 mt-3 justify-between'>
              <div className='flex gap-3 items-center flex-wrap'>
                <SearchInput
                  value={pendingFilter.search || ''}
                  onChange={(keyword) =>
                    handleFilterChange({ search: keyword })
                  }
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
                  onClick={() => refetch()}
                  className='!w-10 flex items-center justify-center'
                  type='default'
                  loading={isLoading}
                  icon={<SyncOutlined spin={isLoading} />}
                />
              </div>
              <AddVariantValueItem
                variantId={variantId}
                variantName={variant?.name}
                onRun={refetch}
              />
            </div>
          )}

          {!isActive && hasSelected && (
            <div className='mb-3 p-3 bg-blue-50 rounded-md border border-blue-200'>
              <div className='flex items-center justify-between'>
                <Text className='text-blue-700'>
                  {t('table.selectedRows', { count: selectedRowKeys.length })}
                </Text>
                <Space>
                  {hasActiveSelected && (
                    <Button
                      type='primary'
                      danger
                      size='small'
                      onClick={handleBulkDelete}
                      loading={deleteMutation.isPending}
                    >
                      {t('button.bulkDelete')}
                    </Button>
                  )}
                  {hasDeletedSelected && (
                    <Button
                      type='primary'
                      size='small'
                      onClick={handleBulkRestore}
                      loading={restoreMutation.isPending}
                    >
                      {t('button.bulkRestore')}
                    </Button>
                  )}
                  <Button size='small' onClick={() => setSelectedRowKeys([])}>
                    {t('button.clearSelection')}
                  </Button>
                </Space>
              </div>
            </div>
          )}

          <Table
            columns={columns}
            dataSource={variantValues}
            loading={isLoading}
            rowKey='_id'
            rowSelection={!isActive ? rowSelection : undefined}
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
            size='small'
          />
        </div>
      </Spin>

      {!isActive && (
        <Modal
          title={t('variantDetail.value.edit')}
          open={editModalVisible}
          onCancel={handleEditModalClose}
          footer={null}
          closable
        >
          <AdminEditVariantValueForm
            oldVariantValue={editedVariantValue}
            onRun={refetch}
          />
        </Modal>
      )}
    </div>
  )
}

export default VariantValuesTable
