import React, { useState } from 'react'
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
  Divider,
  Drawer
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SyncOutlined
} from '@ant-design/icons'
import {
  listVariants,
  removeVariant,
  restoreVariant
} from '../../apis/variant.api'
import useInvalidate from '../../hooks/useInvalidate'
import { useAntdApp } from '../../hooks/useAntdApp'
import { PaginationType } from '../../@types/pagination.type'
import SearchInput from '../ui/SearchInput'
import ActiveLabel from '../label/ActiveLabel'
import CategorySmallCard from '../card/CategorySmallCard'
import VariantValuesTable from './VariantValuesTable'
import { formatDate } from '../../helper/humanReadable'
import { ColumnsType } from 'antd/es/table'
import {
  VariantFilterState,
  defaultVariantFilter
} from '../../@types/filter.type'
import AdminVariantForm from '../selector/AdminVariantForm'
import { BaseStatus, SortType } from '../../enums/OrderStatus.enum'

interface VariantsResponse {
  variants: any[]
  size: number
  filter: { pageCurrent: number; pageCount: number }
}

const AdminVariantsTable = () => {
  const { t } = useTranslation()
  const { message } = useAntdApp()
  const invalidate = useInvalidate()

  const [tableState, setTableState] = useState({
    selectedRowKeys: [] as string[],
    filter: defaultVariantFilter,
    pendingFilter: defaultVariantFilter
  })

  const [uiState, setUiState] = useState({
    drawerOpen: false,
    drawerMode: 'CREATE' as 'CREATE' | 'UPDATE',
    editingId: null as string | null,
    variantValuesModalOpen: false,
    selectedVariantId: null as string | null
  })

  const { data, isLoading, error } = useQuery<VariantsResponse, Error>({
    queryKey: ['variants', tableState.filter],
    queryFn: async () => {
      const res = await listVariants(tableState.filter)
      return res.data || res
    },
    enabled: !!tableState.filter
  })

  const deleteMutation = useMutation({
    mutationFn: removeVariant,
    onSuccess: () => {
      message.success(t('toastSuccess.variant.delete'))
      invalidate({ queryKey: ['variants'] })
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.error || t('toastError.variant.delete')
      )
    }
  })

  const restoreMutation = useMutation({
    mutationFn: restoreVariant,
    onSuccess: () => {
      message.success(t('toastSuccess.variant.restore'))
      invalidate({ queryKey: ['variants'] })
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.error || t('toastError.variant.restore')
      )
    }
  })

  const handlers = {
    filterChange: (updates: Partial<VariantFilterState>) => {
      setTableState((prev) => ({
        ...prev,
        pendingFilter: { ...prev.pendingFilter, ...updates, page: 1 }
      }))
    },
    search: () => {
      setTableState((prev) => ({ ...prev, filter: { ...prev.pendingFilter } }))
    },
    changePage: (page: number, pageSize: number) => {
      setTableState((prev) => ({
        ...prev,
        filter: { ...prev.filter, page, limit: pageSize }
      }))
    },
    filterReset: () => {
      setTableState((prev) => ({
        ...prev,
        filter: defaultVariantFilter,
        pendingFilter: defaultVariantFilter
      }))
    },
    showConfirm: (
      title: string,
      content: string,
      onOk: () => void,
      isDanger = false
    ) => {
      Modal.confirm({
        title,
        content,
        onOk,
        okText: isDanger ? t('button.delete') : t('button.restore'),
        cancelText: t('button.cancel'),
        ...(isDanger && { okType: 'danger' })
      })
    },
    delete: (variantId: string) => {
      handlers.showConfirm(
        t('variantDetail.del'),
        t('message.delete'),
        () => deleteMutation.mutate(variantId),
        true
      )
    },
    restore: (variantId: string) => {
      handlers.showConfirm(t('variantDetail.res'), t('message.restore'), () =>
        restoreMutation.mutate(variantId)
      )
    },
    bulkAction: (isDelete: boolean) => {
      if (tableState.selectedRowKeys.length === 0) return
      const title = isDelete ? t('variantDetail.del') : t('variantDetail.res')
      const content = t(
        isDelete ? 'message.bulkDelete' : 'message.bulkRestore',
        {
          count: tableState.selectedRowKeys.length
        }
      )
      const mutation = isDelete ? deleteMutation : restoreMutation
      handlers.showConfirm(
        title,
        content,
        () => {
          tableState.selectedRowKeys.forEach((id) => mutation.mutate(id))
          setTableState((prev) => ({ ...prev, selectedRowKeys: [] }))
        },
        isDelete
      )
    },

    openDrawer: (mode: 'CREATE' | 'UPDATE', id?: string) => {
      setUiState((prev) => ({
        ...prev,
        drawerMode: mode,
        editingId: id || null,
        drawerOpen: true
      }))
    },

    viewVariantValues: (variantId: string) => {
      setUiState((prev) => ({
        ...prev,
        selectedVariantId: variantId,
        variantValuesModalOpen: true
      }))
    },

    closeDrawer: () => {
      setUiState((prev) => ({ ...prev, drawerOpen: false }))
    },

    closeModal: () => {
      setUiState((prev) => ({ ...prev, variantValuesModalOpen: false }))
    },

    tableChange: (selectedKeys: React.Key[]) => {
      setTableState((prev) => ({
        ...prev,
        selectedRowKeys: selectedKeys as string[]
      }))
    },

    sort: (sorter: any) => {
      console.log(sorter)
      if (!Array.isArray(sorter) && sorter.field) {
        setTableState((prev) => ({
          ...prev,
          filter: {
            ...prev.filter,
            sortBy: sorter.field as string,
            order: sorter.order === 'ascend' ? SortType.ASC : SortType.DESC
          }
        }))
      }
    }
  }
  const variants = data?.variants || []

  const pagination: PaginationType = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || tableState.filter.page || 1,
    pageCount: data?.filter?.pageCount || 1
  }
  const hasSelected = tableState.selectedRowKeys.length > 0
  const hasDeletedSelected = variants
    .filter((variant) => tableState.selectedRowKeys.includes(variant._id))
    .some((variant) => variant.isDeleted)
  const hasActiveSelected = variants
    .filter((variant) => tableState.selectedRowKeys.includes(variant._id))
    .some((variant) => !variant.isDeleted)

  const config = {
    statusFilterOptions: [
      { label: t('filters.all'), value: BaseStatus.ALL },
      { label: t('status.active'), value: BaseStatus.ACTIVE },
      { label: t('status.deleted'), value: BaseStatus.DELETED }
    ],

    rowSelection: {
      selectedRowKeys: tableState.selectedRowKeys,
      onChange: handlers.tableChange
    },

    renderActionButton: (
      icon: React.ReactNode,
      tooltip: string,
      onClick: () => void,
      props?: any
    ) => (
      <Tooltip title={tooltip}>
        <Button
          type='text'
          size='small'
          icon={icon}
          onClick={onClick}
          {...props}
        />
      </Tooltip>
    )
  }

  const columns: ColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      fixed: 'left',
      render: (_: any, __: any, idx: number) =>
        (pagination.pageCurrent - 1) * (tableState.filter.limit || 8) + idx + 1,
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
            <span key={index}>
              <CategorySmallCard category={category} />
            </span>
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
      align: 'center',
      render: (isDeleted: boolean) => <ActiveLabel isDeleted={isDeleted} />
    },
    {
      title: t('variantDetail.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      align: 'right',
      width: 100,
      render: (createdAt: string) => formatDate(createdAt)
    },
    {
      title: t('action'),
      key: 'action',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: any) => (
        <Space size='small'>
          {config.renderActionButton(
            <InfoCircleOutlined />,
            t('button.detail'),
            () => handlers.viewVariantValues(record._id)
          )}
          {config.renderActionButton(<EditOutlined />, t('button.edit'), () =>
            handlers.openDrawer('UPDATE', record._id)
          )}
          {record.isDeleted
            ? config.renderActionButton(
                <SyncOutlined />,
                t('button.restore'),
                () => handlers.restore(record._id),
                {
                  loading: restoreMutation.isPending,
                  className: '!text-green-600 !hover:text-green-700'
                }
              )
            : config.renderActionButton(
                <DeleteOutlined />,
                t('button.delete'),
                () => handlers.delete(record._id),
                { danger: true, loading: deleteMutation.isPending }
              )}
        </Space>
      )
    }
  ]

  return (
    <div className='w-full'>
      {' '}
      {error && (
        <Alert
          message={error?.message || String(error) || 'Error occurred'}
          type='error'
          className='mb-4'
          showIcon
        />
      )}
      <Spin spinning={isLoading}>
        <div className='p-3 bg-white rounded-md'>
          <div className='flex gap-3 items-center flex-wrap justify-between mb-3'>
            <div className='flex gap-3 items-center flex-wrap'>
              <SearchInput
                value={tableState.pendingFilter.search || ''}
                onChange={(keyword) =>
                  handlers.filterChange({ search: keyword })
                }
                onSearch={handlers.search}
                loading={isLoading}
              />
              <Select
                style={{ minWidth: 140 }}
                value={tableState.pendingFilter.status}
                onChange={(value) => handlers.filterChange({ status: value })}
                options={config.statusFilterOptions}
                placeholder={t('status.status')}
                allowClear
              />
              <Button type='primary' onClick={handlers.search}>
                {t('search')}
              </Button>
              <Button onClick={handlers.filterReset} type='default'>
                {t('button.reset')}
              </Button>
              <Button
                onClick={() => invalidate({ queryKey: ['variants'] })}
                type='default'
                loading={isLoading}
                icon={<SyncOutlined spin={isLoading} />}
              />
            </div>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => handlers.openDrawer('CREATE')}
            >
              <span className='hidden sm:inline'>{t('variantDetail.add')}</span>
            </Button>
          </div>{' '}
          {hasSelected && (
            <div className='flex items-center gap-4 mb-4 p-3 bg-blue-50 rounded-lg'>
              <span className='text-sm text-gray-600'>
                {t('table.selectedCount', {
                  count: tableState.selectedRowKeys.length
                })}
              </span>
              <div className='flex gap-2'>
                {hasActiveSelected && (
                  <Button
                    size='small'
                    type='text'
                    danger
                    onClick={() => handlers.bulkAction(true)}
                    loading={deleteMutation.isPending}
                    icon={<DeleteOutlined />}
                  >
                    {t('button.bulkDelete')}
                  </Button>
                )}
                {hasDeletedSelected && (
                  <Button
                    size='small'
                    type='text'
                    className='text-green-600 hover:text-green-700'
                    onClick={() => handlers.bulkAction(false)}
                    loading={restoreMutation.isPending}
                    icon={<SyncOutlined />}
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
            rowSelection={config.rowSelection}
            loading={false}
            pagination={{
              current: pagination.pageCurrent,
              pageSize: tableState.filter.limit,
              total: pagination.size,
              onChange: handlers.changePage,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} ${t('of')} ${total} ${t('result')}`,
              pageSizeOptions: [5, 10, 20, 50],
              showSizeChanger: true
            }}
            onChange={(_, __, sorter: any) => handlers.sort(sorter)}
            scroll={{ x: 'max-content' }}
            className='overflow-hidden'
            bordered
          />
        </div>
      </Spin>
      <Drawer
        open={uiState.drawerOpen}
        onClose={handlers.closeDrawer}
        width={600}
        title={
          uiState.drawerMode === 'CREATE'
            ? t('variantDetail.add')
            : t('button.edit')
        }
        destroyOnHidden
      >
        <AdminVariantForm
          mode={uiState.drawerMode}
          variantId={uiState.editingId}
          onSuccess={() => {
            handlers.closeDrawer()
            invalidate({ queryKey: ['variants'] })
          }}
          onClose={handlers.closeDrawer}
        />
      </Drawer>
      <Modal
        open={uiState.variantValuesModalOpen}
        onCancel={handlers.closeModal}
        width={1000}
        title={t('breadcrumbs.variantValues')}
        footer={null}
        destroyOnHidden
      >
        {uiState.selectedVariantId && (
          <VariantValuesTable variantId={uiState.selectedVariantId} />
        )}
      </Modal>
    </div>
  )
}

export default AdminVariantsTable
