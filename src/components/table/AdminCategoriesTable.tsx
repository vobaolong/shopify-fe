import { useState } from 'react'
import {
  listCategories,
  removeCategory,
  restoreCategory
} from '../../apis/category.api'
import SearchInput from '../ui/SearchInput'
import CategorySmallCard from '../card/CategorySmallCard'
import ActiveLabel from '../label/ActiveLabel'
import { useTranslation } from 'react-i18next'
import CategorySelector from '../selector/CategorySelector'
import { formatDate } from '../../helper/humanReadable'
import {
  Table,
  Button,
  Alert,
  Modal,
  Avatar,
  Tooltip,
  Drawer,
  Divider
} from 'antd'
import { useQuery } from '@tanstack/react-query'
import { CategoryType } from '../../@types/entity.types'
import { ColumnsType } from 'antd/es/table'
import AdminUpsertCategoryForm from '../item/form/AdminUpsertCategoryForm'
import { useAntdApp } from '../../hooks/useAntdApp'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SyncOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'

const AdminCategoriesTable = () => {
  const { t } = useTranslation()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmingRestore, setIsConfirmingRestore] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [run, setRun] = useState(false)
  const { message } = useAntdApp()
  const [deletedCategory, setDeletedCategory] = useState<CategoryType | null>(
    null
  )
  const [restoredCategory, setRestoredCategory] = useState<CategoryType | null>(
    null
  )
  const [filter, setFilter] = useState({
    search: '',
    categoryId: '',
    sortBy: 'categoryId',
    order: 'asc',
    limit: 5,
    page: 1
  })
  const [pendingFilter, setPendingFilter] = useState(filter)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [loadingRestore, setLoadingRestore] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null
  )

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories', filter, run],
    queryFn: async () => {
      return await listCategories(filter)
    }
  })

  const categories: CategoryType[] = data?.categories || []
  const pagination = data?.filter || { pageCurrent: 1, pageCount: 1 }

  const handleChangeKeyword = (keyword: string) => {
    setPendingFilter({
      ...pendingFilter,
      search: keyword,
      page: 1
    })
  }

  const handleSearch = () => {
    setFilter({ ...pendingFilter })
  }

  const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
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

  const removeDeleteCategory = (category: CategoryType) => {
    setDeletedCategory(category)
    setIsConfirming(true)
  }

  const handleRestoreCategory = (category: CategoryType) => {
    setRestoredCategory(category)
    setIsConfirmingRestore(true)
  }

  const onSubmitDelete = async () => {
    if (!deletedCategory) return
    setLoadingDelete(true)
    try {
      await removeCategory(deletedCategory._id)
      message.success(t('toastSuccess.category.delete'))
      setRun((r) => !r)
    } catch (err: any) {
      message.error(t('toastError.category.delete'))
    } finally {
      setIsConfirming(false)
      setLoadingDelete(false)
    }
  }
  const onSubmitRestore = async () => {
    if (!restoredCategory) return
    setLoadingRestore(true)
    try {
      await restoreCategory(restoredCategory._id)
      message.success(t('toastSuccess.category.restore'))
      setRun((r) => !r)
    } catch (err: any) {
      message.error(t('toastError.category.restore'))
    } finally {
      setIsConfirmingRestore(false)
      setLoadingRestore(false)
    }
  }

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: t('categoryDetail.delete'),
      content: t('message.bulkDelete', { count: selectedRowKeys.length }),
      onOk: async () => {
        setLoadingDelete(true)
        try {
          await Promise.all(
            selectedRowKeys.map((categoryId) => removeCategory(categoryId))
          )
          message.success(t('toastSuccess.category.bulkDelete'))
          setSelectedRowKeys([])
          setRun((r) => !r)
        } catch (err: any) {
          message.error(t('toastError.category.bulkDelete'))
        } finally {
          setLoadingDelete(false)
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
      title: t('categoryDetail.restore'),
      content: t('message.bulkRestore', { count: selectedRowKeys.length }),
      onOk: async () => {
        setLoadingRestore(true)
        try {
          await Promise.all(
            selectedRowKeys.map((categoryId) => restoreCategory(categoryId))
          )
          message.success(t('toastSuccess.category.bulkRestore'))
          setSelectedRowKeys([])
          setRun((r) => !r)
        } catch (err: any) {
          message.error(t('toastError.category.bulkRestore'))
        } finally {
          setLoadingRestore(false)
        }
      },
      okText: t('button.restore'),
      cancelText: t('button.cancel')
    })
  }

  const columns: ColumnsType<CategoryType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      fixed: 'left',
      render: (_: any, __: any, idx: number) =>
        (pagination.pageCurrent - 1) * filter.limit + idx + 1,
      width: 60
    },

    {
      title: t('categoryDetail.img'),
      dataIndex: 'image',
      key: 'image',
      render: (image: string, record: any) =>
        image ? (
          <Avatar src={image} alt={record.name} shape='square' size={40} />
        ) : (
          '-'
        ),
      width: 60
    },
    {
      title: t('categoryDetail.name'),
      dataIndex: 'name',
      key: 'name',
      width: 250
    },
    {
      title: t('categoryDetail.parent'),
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId: any) =>
        categoryId ? (
          <CategorySmallCard category={categoryId} />
        ) : (
          <span>-</span>
        )
    },
    {
      title: t('status.status'),
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      align: 'center',
      width: 120,
      render: (isDeleted: boolean) => <ActiveLabel isDeleted={isDeleted} />
    },
    {
      title: t('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      sorter: true,
      align: 'right',
      width: 120
    },
    {
      title: t('action'),
      key: 'action',
      fixed: 'right',
      width: 120,
      align: 'center',
      render: (_: any, category: CategoryType) => (
        <div className='flex items-center justify-center gap-3'>
          <Tooltip placement='top' title={t('button.edit')}>
            <Button
              type='text'
              size='small'
              onClick={() => {
                setEditingCategory(category)
                setDrawerOpen(true)
              }}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip
            placement='top'
            title={
              !category.isDeleted ? t('button.delete') : t('button.restore')
            }
          >
            {!category.isDeleted ? (
              <Button
                type='text'
                size='small'
                danger
                onClick={() => removeDeleteCategory(category)}
                icon={<DeleteOutlined />}
              />
            ) : (
              <Button
                color='green'
                variant='text'
                size='small'
                onClick={() => handleRestoreCategory(category)}
                icon={<SyncOutlined />}
              />
            )}
          </Tooltip>
        </div>
      )
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as string[])
    }
  }

  const hasSelected = selectedRowKeys.length > 0
  const hasDeletedSelected = categories
    .filter((category) => selectedRowKeys.includes(category._id))
    .some((category) => category.isDeleted)
  const hasActiveSelected = categories
    .filter((category) => selectedRowKeys.includes(category._id))
    .some((category) => !category.isDeleted)

  return (
    <div>
      {error && <Alert message={error.message} type='error' />}
      <Modal
        open={isConfirming}
        title={t('categoryDetail.delete')}
        onOk={onSubmitDelete}
        onCancel={() => setIsConfirming(false)}
        okText={t('button.confirm')}
        cancelText={t('button.cancel')}
        okButtonProps={{ danger: true, loading: loadingDelete }}
        confirmLoading={loadingDelete}
        destroyOnHidden
      >
        <div className='text-center p-3'>
          <div className='mb-3'>{t('message.delete')}</div>
        </div>
      </Modal>
      <Modal
        open={isConfirmingRestore}
        title={t('categoryDetail.restore')}
        onOk={onSubmitRestore}
        onCancel={() => setIsConfirmingRestore(false)}
        okText={t('button.confirm')}
        cancelText={t('button.cancel')}
        confirmLoading={loadingRestore}
        destroyOnHidden
      >
        <div className='text-center p-3'>
          <div className='mb-3'>{t('message.restore')}</div>
        </div>
      </Modal>

      <div className='p-3 bg-white rounded-md'>
        <div className='flex gap-3 items-center flex-wrap justify-between'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
          />
          <div className='flex gap-2'>
            <div className='items-center flex justify-content-end'>
              <Button
                icon={<UnorderedListOutlined />}
                type='default'
                onClick={() => setModalOpen(true)}
              >
                <span className='res-hide'>{t('categoryDetail.tree')}</span>
              </Button>
            </div>
            <Modal
              title={t('categoryDetail.tree')}
              open={modalOpen}
              onCancel={() => setModalOpen(false)}
              footer={null}
              width={1000}
            >
              <CategorySelector isActive={true} />
            </Modal>
            <Button
              type='primary'
              onClick={(e) => {
                e.preventDefault()
                setEditingCategory(null)
                setDrawerOpen(true)
              }}
              icon={<PlusOutlined />}
            >
              <span className='res-hide'>{t('categoryDetail.add')}</span>
            </Button>
          </div>
        </div>
        <Divider />
        {hasSelected && (
          <div className='text-end mb-3'>
            {hasActiveSelected && (
              <Button
                danger
                type='default'
                onClick={handleBulkDelete}
                loading={loadingDelete}
                icon={<DeleteOutlined />}
              >
                {t('button.bulkDelete')} ({selectedRowKeys.length})
              </Button>
            )}
            {hasDeletedSelected && (
              <Button
                onClick={handleBulkRestore}
                loading={loadingRestore}
                icon={<SyncOutlined />}
                color='green'
                variant='outlined'
              >
                {t('button.bulkRestore')}
              </Button>
            )}
          </div>
        )}

        <Table
          columns={columns}
          dataSource={categories.map((category: CategoryType, idx: number) => ({
            ...category,
            key: category._id || idx
          }))}
          rowKey='_id'
          rowSelection={rowSelection}
          loading={isLoading}
          pagination={{
            current: pagination.pageCurrent,
            pageSize: filter.limit,
            total: data?.size || 0,
            onChange: (page, pageSize) =>
              handleTableChange({ current: page, pageSize }, {}, {}),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('of')} ${total} ${t('result')}`
          }}
          onChange={handleTableChange}
          bordered
          size='small'
          scroll={{ x: 'max-content' }}
        />
      </div>
      <Drawer
        title={
          editingCategory ? t('categoryDetail.edit') : t('categoryDetail.add')
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={600}
        destroyOnHidden
      >
        <AdminUpsertCategoryForm
          categoryId={editingCategory ? editingCategory._id : undefined}
          key={editingCategory ? editingCategory._id : 'create'}
          onSuccess={() => {
            setDrawerOpen(false)
            setRun((r) => !r)
          }}
        />
      </Drawer>
    </div>
  )
}

export default AdminCategoriesTable
