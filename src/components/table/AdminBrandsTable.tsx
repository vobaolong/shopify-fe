/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth'
import { listBrands, removeBrand, restoreBrand } from '../../apis/brand'
import Pagination from '../ui/Pagination'
import SearchInput from '../ui/SearchInput'
import SortByButton from './sub/SortByButton'
import DeletedLabel from '../label/DeletedLabel'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import CategorySmallCard from '../card/CategorySmallCard'
import ActiveLabel from '../label/ActiveLabel'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Error from '../ui/Error'
import { humanReadableDate } from '../../helper/humanReadable'
import { Table } from 'antd'
import { useQuery } from '@tanstack/react-query'

interface Brand {
  _id: string
  name: string
  categoryIds: any[]
  isDeleted: boolean
  createdAt: string
  // ...other fields
}

interface BrandsResponse {
  brands: Brand[]
  size: number
  filter: { pageCurrent: number; pageCount: number }
}

const fetchBrands = async (filter: any): Promise<BrandsResponse> => {
  const res = await listBrands(filter)
  return res.data || res
}

const AdminBrandsTable = ({ heading = false }) => {
  const { t } = useTranslation()
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isConfirmingRestore, setIsConfirmingRestore] = useState(false)
  const [run, setRun] = useState(false)
  const [deletedBrand, setDeletedBrand] = useState<Brand | null>(null)
  const [restoredBrand, setRestoredBrand] = useState<Brand | null>(null)
  const { _id } = getToken()
  const [filter, setFilter] = useState({
    search: '',
    sortBy: 'name',
    categoryId: '',
    order: 'asc',
    limit: 8,
    page: 1
  })

  const { data, isLoading, error, refetch } = useQuery<BrandsResponse, Error>({
    queryKey: ['brands', _id, filter, run],
    queryFn: () => fetchBrands(filter)
  })

  const brands: Brand[] = data?.brands || []
  const pagination = data?.filter || { pageCurrent: 1, pageCount: 1 }
  const dataSource = brands.map((brand: Brand, idx: number) => ({
    ...brand,
    key: brand._id || idx
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

  const handleDelete = (brand: Brand) => {
    setDeletedBrand(brand)
    setIsConfirmingDelete(true)
  }

  const handleRestore = (brand: Brand) => {
    setRestoredBrand(brand)
    setIsConfirmingRestore(true)
  }

  const onSubmitDelete = () => {
    if (!deletedBrand) return
    removeBrand(_id, deletedBrand._id)
      .then((res) => {
        const data = res.data || res
        if (data.error) toast.error(data.error)
        else {
          toast.success(t('toastSuccess.brand.delete'))
          setRun((r) => !r)
        }
        setIsConfirmingDelete(false)
      })
      .catch(() => {
        toast.error('Server Error')
        setIsConfirmingDelete(false)
      })
  }

  const onSubmitRestore = () => {
    if (!restoredBrand) return
    restoreBrand(_id, restoredBrand._id)
      .then((res) => {
        const data = res.data || res
        if (data.error) toast.error(data.error)
        else {
          toast.success(t('toastSuccess.brand.restore'))
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
      title: t('brandDetail.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>
    },
    {
      title: t('brandDetail.categories'),
      dataIndex: 'categoryIds',
      key: 'categoryIds',
      render: (categories: any[]) => (
        <div
          style={{ maxHeight: 200, overflow: 'auto' }}
          className='d-flex flex-column gap-2 my-2'
        >
          {categories.map((category, idx) => (
            <div
              className='hidden-avatar fs-9 badge bg-value text-dark-emphasis border rounded-1 fw-normal text-start'
              key={idx}
            >
              <CategorySmallCard category={category} />
            </div>
          ))}
        </div>
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
      title: t('brandDetail.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => humanReadableDate(date)
    },
    {
      title: t('action'),
      key: 'action',
      render: (_: any, brand: Brand) => (
        <div className='text-nowrap my-1'>
          <div className='position-relative d-inline-block'>
            <Link
              type='button'
              className='btn btn-sm btn-outline-secondary ripple me-2 cus-tooltip'
              to={`/admin/brand/values/${brand._id}`}
            >
              <i className='fa-solid fa-circle-info'></i>
            </Link>
            <span className='cus-tooltip-msg'>{t('button.detail')}</span>
          </div>
          <div className='position-relative d-inline-block'>
            <Link
              type='button'
              className='btn btn-sm btn-outline-primary ripple me-2 rounded-1 cus-tooltip'
              to={`/admin/brand/edit/${brand._id}`}
            >
              <i className='fa-duotone fa-pen-to-square'></i>
            </Link>
            <span className='cus-tooltip-msg'>{t('button.edit')}</span>
          </div>
          <div className='position-relative d-inline-block'>
            {!brand.isDeleted ? (
              <button
                type='button'
                className='btn btn-sm btn-outline-danger ripple rounded-1 cus-tooltip'
                onClick={() => handleDelete(brand)}
              >
                <i className='fa-solid fa-trash-alt'></i>
              </button>
            ) : (
              <button
                type='button'
                className='btn btn-sm btn-outline-success ripple rounded-1 cus-tooltip'
                onClick={() => handleRestore(brand)}
              >
                <i className='fa-solid fa-trash-can-arrow-up'></i>
              </button>
            )}
            <span className=' cus-tooltip-msg'>
              {!brand.isDeleted ? t('button.delete') : t('button.restore')}
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
      {isConfirmingDelete && deletedBrand && (
        <ConfirmDialog
          title={t('brandDetail.del')}
          color='danger'
          onSubmit={onSubmitDelete}
          onClose={() => setIsConfirmingDelete(false)}
        />
      )}
      {isConfirmingRestore && restoredBrand && (
        <ConfirmDialog
          title={t('brandDetail.res')}
          onSubmit={onSubmitRestore}
          onClose={() => setIsConfirmingRestore(false)}
        />
      )}

      {heading && <h5 className='text-start'>{t('title.productBrands')}</h5>}
      <div className='p-3 bg-white rounded-md'>
        <div className='flex gap-3 items-center flex-wrap'>
          <SearchInput onChange={handleChangeKeyword} />
          <Link
            type='button'
            className='btn btn-primary ripple text-nowrap rounded-1'
            to='/admin/brand/create'
          >
            <i className='fa-light fa-plus'></i>
            <span className='ms-2 res-hide'>{t('brandDetail.add')}</span>
          </Link>
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
          {brands.length !== 0 && (
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

export default AdminBrandsTable
