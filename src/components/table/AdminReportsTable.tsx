import { useDeleteReport } from '../../hooks/useReport'
import { useQuery } from '@tanstack/react-query'
import { listReportsForAdmin } from '../../apis/report.api'
import {
  Table,
  Button,
  Modal,
  Alert,
  Divider,
  Tabs,
  Tooltip,
  Select,
  DatePicker,
  notification,
  Typography
} from 'antd'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SearchInput from '../ui/SearchInput'
import { humanReadableDate } from '../../helper/humanReadable'
import { PaginationType } from '../../@types/pagination.type'
import { ReportType } from '../../@types/entity.types'
import { Dayjs } from 'dayjs'
import { ColumnType } from 'antd/es/table'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'

const tabOptions = [
  { labelKey: 'title.listReportShop', value: 'stores' },
  { labelKey: 'title.listReportProduct', value: 'products' },
  { labelKey: 'title.listReportReview', value: 'reviews' }
]

const filterFieldOptions = [
  { label: '_id', value: '_id' },
  { label: 'objectId', value: 'objectId' },
  { label: 'email', value: 'email' }
]

type Filter = {
  search: string
  sortBy: string
  activeTab: string
  order: string
  limit: number
  page: number
  isStore?: boolean
  isProduct?: boolean
  isReview?: boolean
  field: string
  createdAtFrom?: string
  createdAtTo?: string
}

const { Text } = Typography

const AdminReportsTable = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('stores')
  const [filterField, setFilterField] = useState<string>('_id')
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null)
  const [filter, setFilter] = useState<Filter>({
    search: '',
    sortBy: 'createdAt',
    activeTab: 'stores',
    order: 'desc',
    limit: 10,
    page: 1,
    isStore: true,
    isProduct: false,
    isReview: false,
    field: '_id',
    createdAtFrom: undefined,
    createdAtTo: undefined
  })
  const [pendingFilter, setPendingFilter] = useState<Filter>(filter)
  const [error, setError] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [isProcessingBulkDelete, setIsProcessingBulkDelete] = useState(false)

  const { data, isLoading, refetch, isSuccess } = useQuery({
    queryKey: ['admin-reports', filter],
    queryFn: async () => {
      return await listReportsForAdmin(filter)
    }
  })
  const deleteMutation = useDeleteReport()

  const reports: ReportType[] = data?.reports || []
  const pagination: PaginationType = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page,
    pageCount: data?.filter?.pageCount || 1
  }

  const columns: ColumnType<ReportType>[] = useMemo(
    () => [
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
        title: t('reportDetail.id'),
        dataIndex: '_id',
        key: '_id',
        render: (id: string) => (
          <Text
            className='uppercase'
            copyable={{ text: id.toUpperCase(), icon: <CopyOutlined /> }}
          >
            #{id.slice(-10).toUpperCase()}
          </Text>
        )
      },
      {
        title: t('reportDetail.objectId'),
        dataIndex: ['objectId', '_id'],
        key: 'objectId',
        render: (_: any, record: ReportType) => (
          <Text
            className='uppercase'
            copyable={{
              text: record.objectId?._id || '-',
              icon: <CopyOutlined />
            }}
          >
            #{record.objectId?._id.slice(-10).toUpperCase()}
          </Text>
        )
      },
      {
        title: t('reportDetail.userId'),
        dataIndex: ['reportBy', 'email'],
        key: 'userId',
        render: (_: any, record: ReportType) => record.reportBy?.email || '-'
      },
      {
        title: t('reportDetail.reason'),
        dataIndex: 'reason',
        key: 'reason'
      },
      {
        title: t('reportDetail.createAt'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: true,
        render: (createdAt: string) => humanReadableDate(createdAt)
      },
      {
        title: t('action'),
        key: 'action',
        render: (_: any, record: ReportType) => (
          <div className='flex gap-2'>
            <Tooltip title={t('button.view')}>
              <Button
                type='primary'
                icon={<i className='fa-solid fa-eye' />}
                href={getLinkTo(record)}
              />
            </Tooltip>
            <Tooltip title={t('button.delete')}>
              <Button
                type='default'
                variant='outlined'
                danger
                icon={<DeleteOutlined />}
                loading={deleteMutation.isPending}
                onClick={() => handleDelete(record._id)}
              />
            </Tooltip>
          </div>
        )
      }
    ],
    [t, filter.limit, pagination.pageCurrent, deleteMutation.isPending]
  )

  function getLinkTo(report: ReportType) {
    switch (activeTab) {
      case 'stores':
        return `/stores/${report.objectId?._id}`
      case 'products':
        return `/products/${report.objectId?._id}`
      case 'reviews':
        return `/reviews/${report.objectId?._id}`
      default:
        return '#'
    }
  }

  // Handlers
  const handleChangePage = (page: number, pageSize: number) => {
    setFilter((prev) => ({ ...prev, page, limit: pageSize }))
  }
  const handleFieldChange = (value: string) => {
    setFilterField(value)
    setPendingFilter((prev) => ({ ...prev, field: value }))
  }
  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    setDateRange(dates)
    if (Array.isArray(dates) && dates[0] && dates[1]) {
      setPendingFilter((prev) => ({
        ...prev,
        createdAtFrom: dates[0]?.startOf('day').toISOString(),
        createdAtTo: dates[1]?.endOf('day').toISOString(),
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
  const handleDelete = (reportId: string) => {
    Modal.confirm({
      title: t('reportDetail.delete'),
      content: t('confirmDialog'),
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(reportId as any)
          notification.success({
            message: t('toastSuccess.report.delete'),
            duration: 1.5
          })
          refetch()
        } catch (err: any) {
          setError(err?.message)
        }
      }
    })
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: t('warning.noItemSelected'),
        duration: 1.5
      })
      return
    }

    Modal.confirm({
      title: t('reportDetail.bulkDelete'),
      content: t('confirmDialog.bulkDelete', { count: selectedRowKeys.length }),
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      onOk: async () => {
        setIsProcessingBulkDelete(true)
        try {
          // Delete reports one by one (or implement batch delete API if available)
          for (const reportId of selectedRowKeys) {
            await deleteMutation.mutateAsync(reportId as any)
          }
          notification.success({
            message: t('toastSuccess.report.bulkDelete', {
              count: selectedRowKeys.length
            }),
            duration: 1.5
          })
          setSelectedRowKeys([])
          refetch()
        } catch (err: any) {
          setError(err?.message)
        } finally {
          setIsProcessingBulkDelete(false)
        }
      }
    })
  }

  // Handle selection change
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys as string[])
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelectAll: (
      selected: boolean,
      selectedRows: ReportType[],
      changeRows: ReportType[]
    ) => {
      if (selected) {
        const newSelectedKeys = [
          ...selectedRowKeys,
          ...changeRows.map((row) => row._id)
        ]
        setSelectedRowKeys([...new Set(newSelectedKeys)])
      } else {
        const changeRowKeys = changeRows.map((row) => row._id)
        setSelectedRowKeys(
          selectedRowKeys.filter((key) => !changeRowKeys.includes(key))
        )
      }
    },
    getCheckboxProps: (record: ReportType) => ({
      name: record._id
    })
  }

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key)
    setFilter((prev) => ({
      ...prev,
      activeTab: key,
      isStore: key === 'stores',
      isProduct: key === 'products',
      isReview: key === 'reviews',
      page: 1
    }))
    setPendingFilter((prev) => ({
      ...prev,
      activeTab: key,
      isStore: key === 'stores',
      isProduct: key === 'products',
      isReview: key === 'reviews',
      page: 1
    }))
  }

  return (
    <div className='w-full'>
      <div className='bg-white px-2 rounded-2 mb-3'>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabOptions.map((tab) => ({
            key: tab.value,
            label: t(tab.labelKey)
          }))}
          className='w-full'
          moreIcon={null}
        />
      </div>
      {error && <Alert message={error} type='error' showIcon />}
      <div className='p-3 box-shadow bg-body rounded-2'>
        <div className='flex gap-2 mb-2'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
            searchField={filterField}
            onFieldChange={handleFieldChange}
            fieldOptions={filterFieldOptions}
          />
          <DatePicker.RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            allowClear
            format='DD-MM-YYYY'
          />
          <Button type='primary' onClick={handleSearch} loading={isLoading}>
            {t('search')}
          </Button>
        </div>
        <Divider />
        {selectedRowKeys.length > 0 && (
          <div className='mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Text strong>
                  {t('bulkSelection.selected', {
                    count: selectedRowKeys.length
                  })}
                </Text>
                <Button
                  size='small'
                  type='link'
                  onClick={() => setSelectedRowKeys([])}
                >
                  {t('button.clearSelection')}
                </Button>
              </div>
              <div className='flex gap-2'>
                <Button
                  type='primary'
                  danger
                  icon={<DeleteOutlined />}
                  loading={isProcessingBulkDelete}
                  onClick={handleBulkDelete}
                >
                  {t('button.bulkDelete')}
                </Button>
              </div>
            </div>
          </div>
        )}
        <Table
          columns={columns}
          dataSource={reports}
          rowKey='_id'
          loading={isLoading}
          bordered
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
    </div>
  )
}

export default AdminReportsTable
