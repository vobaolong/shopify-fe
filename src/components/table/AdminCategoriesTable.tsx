import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  listCategories,
  removeCategory,
  restoreCategory
} from '../../apis/category'
import SearchInput from '../ui/SearchInput'
import DeletedLabel from '../label/DeletedLabel'
import CategorySmallCard from '../card/CategorySmallCard'
import ActiveLabel from '../label/ActiveLabel'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import CategorySelector from '../selector/CategorySelector'
import { humanReadableDate } from '../../helper/humanReadable'
import Error from '../ui/Error'
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
import CustomModal from '../ui/Modal'
import { ColumnsType } from 'antd/es/table'
import { Pen, PencilLine, Plus } from 'lucide-react'
import AdminUpsertCategoryForm from '../item/form/AdminUpsertCategoryForm'

const AdminCategoriesTable = () => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmingRestore, setIsConfirmingRestore] = useState(false)
  const [run, setRun] = useState(false)
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
    limit: 10,
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
      toast.success(t('toastSuccess.category.delete'))
      setRun((r) => !r)
    } catch (err: any) {
      toast.error(err?.message || 'Server Error')
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
      toast.success(t('toastSuccess.category.restore'))
      setRun((r) => !r)
    } catch (err: any) {
      toast.error(err?.message || 'Server Error')
    } finally {
      setIsConfirmingRestore(false)
      setLoadingRestore(false)
    }
  }

  const columns: ColumnsType<CategoryType> = [
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
      key: 'name'
    },
    {
      title: t('categoryDetail.parent'),
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId: any) =>
        categoryId ? (
          <span className='hidden-avatar badge bg-value text-dark-emphasis border rounded-1 fw-normal text-sm'>
            <CategorySmallCard category={categoryId} />
          </span>
        ) : (
          <span>-</span>
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
      render: (date: string) => humanReadableDate(date),
      sorter: true,
      align: 'right',
      width: 180
    },
    {
      title: t('action'),
      key: 'action',
      render: (_: any, category: CategoryType) => (
        <div className='text-nowrap d-flex align-items-center gap-2'>
          <Tooltip placement='top' title={t('button.edit')}>
            <Button
              type='primary'
              size='middle'
              onClick={() => {
                setEditingCategory(category)
                setDrawerOpen(true)
              }}
              icon={<Pen size={16} />}
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
                type='default'
                size='middle'
                danger
                onClick={() => removeDeleteCategory(category)}
                icon={<i className='fa-solid fa-trash-alt' />}
              />
            ) : (
              <Button
                color='green'
                variant='outlined'
                size='middle'
                onClick={() => handleRestoreCategory(category)}
                icon={<i className='fa-solid fa-trash-can-arrow-up' />}
              />
            )}
          </Tooltip>
        </div>
      )
    }
  ]

  return (
    <div>
      {error && <Alert message={error.message} type='error' />}
      {/* Delete Confirmation Modal (AntD) */}
      <Modal
        open={isConfirming}
        title={t('categoryDetail.delete')}
        onOk={onSubmitDelete}
        onCancel={() => setIsConfirming(false)}
        okText={t('button.confirm')}
        cancelText={t('button.cancel')}
        okButtonProps={{ danger: true, loading: loadingDelete }}
        confirmLoading={loadingDelete}
        destroyOnClose
      >
        <div className='text-center p-3'>
          <div className='mb-3'>{t('message.delete')}</div>
        </div>
      </Modal>
      {/* Restore Confirmation Modal (AntD) */}
      <Modal
        open={isConfirmingRestore}
        title={t('categoryDetail.restore')}
        onOk={onSubmitRestore}
        onCancel={() => setIsConfirmingRestore(false)}
        okText={t('button.confirm')}
        cancelText={t('button.cancel')}
        confirmLoading={loadingRestore}
        destroyOnClose
      >
        <div className='text-center p-3'>
          <div className='mb-3'>{t('message.restore')}</div>
        </div>
      </Modal>

      <div className='p-3 bg-white rounded-md'>
        <div className='flex gap-3 items-center flex-wrap'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
          />

          <div className='d-flex gap-1'>
            <div className='align-items-center d-flex justify-content-end'>
              <div className='position-relative d-inline-block'>
                <button
                  type='button'
                  className='btn btn-outline-primary ripple cus-tooltip rounded-1'
                  data-bs-toggle='modal'
                  data-bs-target='#admin-category-tree'
                >
                  <i className='fa-light fa-list-tree' />
                  <span className='res-hide ms-2'>
                    {t('categoryDetail.tree')}
                  </span>
                </button>

                <small className='cus-tooltip-msg'>
                  {t('categoryDetail.tree')}
                </small>
              </div>
            </div>
            <CustomModal
              id='admin-category-tree'
              hasCloseBtn={false}
              title={t('categoryDetail.tree')}
              style={{ maxWidth: '1000px', width: '100%', margin: 'auto' }}
            >
              <CategorySelector isActive={true} isSelected={false} />
            </CustomModal>
            <Button
              type='primary'
              onClick={(e) => {
                e.preventDefault()
                setEditingCategory(null)
                setDrawerOpen(true)
              }}
              icon={<Plus size={16} />}
            >
              <span className='res-hide'>{t('categoryDetail.add')}</span>
            </Button>
          </div>
        </div>
        <Divider />
        <Table
          columns={columns}
          dataSource={categories.map((category: CategoryType, idx: number) => ({
            ...category,
            key: category._id || idx
          }))}
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
          rowKey='_id'
          bordered
          scroll={{ x: 'max-content' }}
        />
      </div>
      <Drawer
        title={
          editingCategory ? t('categoryDetail.edit') : t('categoryDetail.add')
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={900}
        destroyOnClose
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
