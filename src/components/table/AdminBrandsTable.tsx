import { useState } from 'react'
import { Link } from 'react-router-dom'
import { listBrands, removeBrand, restoreBrand } from '../../apis/brand'
import Pagination from '../ui/Pagination'
import SearchInput from '../ui/SearchInput'
import DeletedLabel from '../label/DeletedLabel'
import ConfirmDialog from '../ui/ConfirmDialog'
import CategorySmallCard from '../card/CategorySmallCard'
import ActiveLabel from '../label/ActiveLabel'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { humanReadableDate } from '../../helper/humanReadable'
import {
  Table,
  Drawer,
  Button,
  Select,
  DatePicker,
  Alert,
  Space,
  Tooltip,
  Divider
} from 'antd'
import { useQuery } from '@tanstack/react-query'
import AdminCreateBrandForm from '../item/form/AdminCreateBrandForm'
import AdminEditBrandForm from '../item/form/AdminEditBrandForm'
import dayjs from 'dayjs'
import { BrandType } from '../../@types/entity.types'
import { PaginationType } from '../../@types/pagination.type'

interface BrandsResponse {
  brands: BrandType[]
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
  const [deletedBrand, setDeletedBrand] = useState<BrandType | null>(null)
  const [restoredBrand, setRestoredBrand] = useState<BrandType | null>(null)
  const [filter, setFilter] = useState({
    search: '',
    sortBy: 'name',
    categoryId: '',
    order: 'asc',
    limit: 8,
    page: 1,
    createdAtFrom: undefined,
    createdAtTo: undefined
  })
  const [pendingFilter, setPendingFilter] = useState({
    search: '',
    sortBy: 'name',
    categoryId: '',
    order: 'asc',
    limit: 8,
    page: 1,
    createdAtFrom: undefined,
    createdAtTo: undefined
  })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null)

  const { data, isLoading, error, refetch } = useQuery<BrandsResponse, Error>({
    queryKey: ['brands', filter, run],
    queryFn: () => fetchBrands(filter)
  })

  const brands: BrandType[] = data?.brands || []
  const pagination: PaginationType = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page,
    pageCount: data?.filter?.pageCount || 1
  }

  const handleChangePage = (newPage: number) => {
    setFilter({
      ...filter,
      page: newPage
    })
  }

  const handleDelete = (brand: BrandType) => {
    setDeletedBrand(brand)
    setIsConfirmingDelete(true)
  }

  const handleRestore = (brand: BrandType) => {
    setRestoredBrand(brand)
    setIsConfirmingRestore(true)
  }

  const onSubmitDelete = () => {
    if (!deletedBrand) return
    removeBrand(deletedBrand._id)
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
    restoreBrand(restoredBrand._id)
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
      render: (_: any, brand: BrandType) => (
        <Space size='small'>
          <Tooltip title={t('button.detail')}>
            <Link to={`/admin/brand/values/${brand._id}`}>
              <Button icon={<i className='fa-solid fa-circle-info' />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('button.edit')}>
            <Button
              type='primary'
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
              type={!brand.isDeleted ? 'primary' : 'default'}
              danger={!brand.isDeleted}
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

      <div className='p-3 bg-white rounded-md'>
        <div className='flex justify-between items-center'>
          <div className='flex gap-3 items-center flex-wrap'>
            <SearchInput
              value={pendingFilter.search}
              onChange={(keyword) =>
                setPendingFilter((prev) => ({
                  ...prev,
                  search: keyword,
                  page: 1
                }))
              }
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
                onClick={() => refetch()}
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

        <Divider />
        <Table
          columns={columns}
          dataSource={brands}
          rowKey='_id'
          loading={isLoading}
          bordered
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

      <Drawer
        title={editingBrandId ? t('brandDetail.edit') : t('brandDetail.add')}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={900}
        destroyOnClose
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
