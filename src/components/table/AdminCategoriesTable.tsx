import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  listCategories,
  removeCategory,
  restoreCategory
} from '../../apis/category'
import Pagination from '../ui/Pagination'
import SearchInput from '../ui/SearchInput'
import DeletedLabel from '../label/DeletedLabel'
import CategorySmallCard from '../card/CategorySmallCard'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import ActiveLabel from '../label/ActiveLabel'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import CategorySelector from '../selector/CategorySelector'
import { humanReadableDate } from '../../helper/humanReadable'
import Modal from '../ui/Modal'
import Error from '../ui/Error'
import { Table } from 'antd'
import { useQuery } from '@tanstack/react-query'

interface Category {
  _id: string
  name: string
  image?: string
  categoryId?: any
  isDeleted: boolean
  createdAt: string
}

interface CategoriesResponse {
  categories: Category[]
  size: number
  filter: { pageCurrent: number; pageCount: number }
}

const fetchCategories = async (filter: any): Promise<CategoriesResponse> => {
  const res = await listCategories(filter)
  return res.data || res
}

const AdminCategoriesTable = ({ heading = false }) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmingRestore, setIsConfirmingRestore] = useState(false)
  const [run, setRun] = useState(false)
  const [deletedCategory, setDeletedCategory] = useState<Category | null>(null)
  const [restoredCategory, setRestoredCategory] = useState<Category | null>(
    null
  )
  const [filter, setFilter] = useState({
    search: '',
    categoryId: '',
    sortBy: 'categoryId',
    order: 'asc',
    limit: 7,
    page: 1
  })

  const { data, isLoading, error } = useQuery<CategoriesResponse, Error>({
    queryKey: ['categories', filter, run],
    queryFn: () => fetchCategories(filter)
  })

  const categories: Category[] = data?.categories || []
  const pagination = data?.filter || { pageCurrent: 1, pageCount: 1 }
  const dataSource = categories.map((category: Category, idx: number) => ({
    ...category,
    key: category._id || idx
  }))

  const handleChangeKeyword = (keyword: string) => {
    setFilter({
      ...filter,
      search: keyword,
      page: 1
    })
  }

  const handleChangePage = (newPage: number) => {
    setFilter({
      ...filter,
      page: newPage
    })
  }

  const handleSetSortBy = (order: string, sortBy: string) => {
    setFilter({
      ...filter,
      sortBy,
      order
    })
  }

  const removeDeleteCategory = (category: Category) => {
    setDeletedCategory(category)
    setIsConfirming(true)
  }

  const handleRestoreCategory = (category: Category) => {
    setRestoredCategory(category)
    setIsConfirmingRestore(true)
  }

  const onSubmitDelete = () => {
    if (!deletedCategory) return
    removeCategory(deletedCategory._id)
      .then((res) => {
        const data = res.data || res
        if (data.error) toast.error(data.error)
        else {
          toast.success(t('toastSuccess.category.delete'))
          setRun((r) => !r)
        }
        setIsConfirming(false)
      })
      .catch(() => {
        toast.error('Server Error')
        setIsConfirming(false)
      })
  }

  const onSubmitRestore = () => {
    if (!restoredCategory) return
    restoreCategory(restoredCategory._id)
      .then((res) => {
        const data = res.data || res
        if (data.error) toast.error(data.error)
        else {
          toast.success(t('toastSuccess.category.restore'))
          setRun((r) => !r)
        }
        setIsConfirmingRestore(false)
      })
      .catch(() => {
        toast.error('Server Error')
        setIsConfirmingRestore(false)
      })
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) =>
        index + 1 + (filter.page - 1) * filter.limit,
      width: 50
    },
    {
      title: t('categoryDetail.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: t('categoryDetail.img'),
      dataIndex: 'image',
      key: 'image',
      render: (image: string, record: any) =>
        image ? (
          <div className='relative w-[50px] h-[50px]'>
            <img
              loading='lazy'
              src={image}
              alt={record.name}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: '0',
                left: '0',
                objectFit: 'contain',
                borderRadius: '0.25rem',
                boxShadow:
                  'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
              }}
            />
          </div>
        ) : (
          '-'
        )
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
      render: (date: string) => humanReadableDate(date)
    },
    {
      title: t('action'),
      key: 'action',
      render: (_: any, category: Category) => (
        <div className='text-nowrap'>
          <div className='position-relative d-inline-block'>
            <Link
              type='button'
              className='btn btn-sm btn-outline-primary ripple me-2 rounded-1 cus-tooltip'
              to={`/admin/category/edit/${category._id}`}
              title={t('button.edit')}
            >
              <i className='fa-duotone fa-pen-to-square'></i>
            </Link>
            <span className='cus-tooltip-msg'>{t('button.edit')}</span>
          </div>
          <div className='position-relative d-inline-block'>
            {!category.isDeleted ? (
              <button
                type='button'
                className='btn btn-sm btn-outline-danger rounded-1 ripple cus-tooltip'
                onClick={() => removeDeleteCategory(category)}
                title={t('button.delete')}
              >
                <i className='fa-solid fa-trash-alt'></i>
              </button>
            ) : (
              <button
                type='button'
                className='btn btn-sm btn-outline-success ripple cus-tooltip'
                onClick={() => handleRestoreCategory(category)}
                title={t('button.restore')}
              >
                <i className='fa-solid fa-trash-can-arrow-up'></i>
              </button>
            )}
            <span className='cus-tooltip-msg'>
              {!category.isDeleted ? t('button.delete') : t('button.restore')}
            </span>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {error && <Error msg={error.message || 'Server Error'} />}
      {isConfirming && deletedCategory && (
        <ConfirmDialog
          title={t('categoryDetail.delete')}
          message={t('message.delete')}
          color='danger'
          onSubmit={onSubmitDelete}
          onClose={() => setIsConfirming(false)}
        />
      )}
      {isConfirmingRestore && restoredCategory && (
        <ConfirmDialog
          title={t('categoryDetail.restore')}
          message={t('message.restore')}
          onSubmit={onSubmitRestore}
          onClose={() => setIsConfirmingRestore(false)}
        />
      )}
      <div className='mb-2'>
        {heading && <h5 className='text-start'>{t('admin.categories')}</h5>}
      </div>

      <div className='p-3 box-shadow bg-body rounded-2'>
        <div className=' d-flex align-items-center justify-content-between mb-3'>
          <SearchInput onChange={handleChangeKeyword} />

          <div className='d-flex gap-1'>
            <div className='align-items-center d-flex justify-content-end'>
              <div className='position-relative d-inline-block'>
                <button
                  type='button'
                  className='btn btn-outline-primary ripple cus-tooltip rounded-1'
                  data-bs-toggle='modal'
                  data-bs-target='#admin-category-tree'
                >
                  <i className='fa-light fa-list-tree'></i>
                  <span className='res-hide ms-2'>
                    {t('categoryDetail.tree')}
                  </span>
                </button>

                <small className='cus-tooltip-msg'>
                  {t('categoryDetail.tree')}
                </small>
              </div>
            </div>
            <Modal
              id='admin-category-tree'
              hasCloseBtn={false}
              title={t('categoryDetail.tree')}
              style={{ maxWidth: '1000px', width: '100%', margin: 'auto' }}
            >
              <CategorySelector isActive={true} isSelected={false} />
            </Modal>
            <Link
              type='button'
              className='btn btn-primary ripple text-nowrap rounded-1'
              to='/admin/category/create'
            >
              <i className='fa-light fa-plus'></i>
              <span className='ms-2 res-hide'>{t('categoryDetail.add')}</span>
            </Link>
          </div>
        </div>

        <div className='table-scroll my-2'>
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={isLoading}
            pagination={false}
          />
        </div>
        <div className='flex justify-between items-center px-4'>
          {/* <ShowResult
            limit={filter.limit}
            size={categories.length}
            pageCurrent={pagination.pageCurrent}
          /> */}
          {categories.length !== 0 && (
            <Pagination
              pagination={pagination}
              onChangePage={handleChangePage}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminCategoriesTable
