import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Table,
  Button,
  Select,
  Modal,
  Alert,
  notification,
  Divider,
  Rate
} from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import SearchInput from '../ui/SearchInput'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { ProductType } from '../../@types/entity.types'
import ProductSmallCard from '../card/ProductSmallCard'
import CategorySmallCard from '../card/CategorySmallCard'
import ProductActiveLabel from '../label/ProductActiveLabel'
import { humanReadableDate } from '../../helper/humanReadable'
import { useTranslation } from 'react-i18next'
import {
  listProductsForAdmin,
  activeProduct as activeOrInactive
} from '../../apis/product.api'
import {
  sendActiveProductEmail,
  sendBanProductEmail
} from '../../apis/notification.api'
import useInvalidate from '../../hooks/useInvalidate'
import { ColumnsType } from 'antd/es/table'
import { formatPrice } from '../../helper/formatPrice'
import StarRating from '../label/StarRating'

const { RangePicker } = DatePicker

const AdminProductsTable = () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState({
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    order: 'desc',
    limit: 5,
    page: 1,
    createdAtFrom: undefined,
    createdAtTo: undefined
  })
  const [pendingFilter, setPendingFilter] = useState(filter)
  const [activeProduct, setActiveProduct] = useState<ProductType | null>(null)
  const [error, setError] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const invalidate = useInvalidate()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const mutation = useMutation({
    mutationFn: ({
      productId,
      value
    }: {
      productId: string
      value: { isActive: boolean }
    }) => activeOrInactive(value, productId),
    onSuccess: (data, variables) => {
      const { value } = variables
      const isActiveText = value.isActive
        ? t('toastSuccess.product.active')
        : t('toastSuccess.product.ban')
      notification.success({
        message: isActiveText
      })
      if (activeProduct && !activeProduct.isActive) {
        sendActiveProductEmail((activeProduct.storeId as any)?.ownerId)
      } else if (activeProduct) {
        sendBanProductEmail((activeProduct.storeId as any)?.ownerId)
      }
      invalidate({ queryKey: ['products'] })
    },
    onError: () => {
      setError('Server Error')
    },
    onSettled: () => {
      setIsConfirming(false)
    }
  })

  const handleChangeKeyword = (keyword: string) => {
    setPendingFilter((prev) => ({ ...prev, search: keyword, page: 1 }))
  }
  const handleStatusChange = (value: string) => {
    setPendingFilter((prev) => ({ ...prev, status: value, page: 1 }))
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
  const handleChangePage = (page: number, pageSize: number) => {
    setFilter((prev) => ({ ...prev, page, limit: pageSize }))
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', filter],
    queryFn: () => listProductsForAdmin(filter)
  })
  const products: ProductType[] = data?.products || []
  const pagination = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page,
    pageCount: data?.filter?.pageCount || 1
  }

  const columns: ColumnsType<ProductType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (_: any, __: any, idx: number) =>
        (pagination.pageCurrent - 1) * filter.limit + idx + 1,
      width: 60,
      fixed: 'left'
    },

    {
      title: t('productDetail.name'),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, product: ProductType) => (
        <ProductSmallCard product={product} />
      ),
      width: 300
    },
    // {
    //   title: t('store'),
    //   dataIndex: 'storeId',
    //   key: 'storeId',
    //   render: (store: any) => <StoreSmallCard store={store} />
    // },
    {
      title: t('productDetail.category'),
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (category: any) => <CategorySmallCard category={category} />
    },
    {
      title: t('productDetail.price'),
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price: any) => (
        <span>
          {formatPrice(price?.$numberDecimal)}
          <sup> ₫</sup>
        </span>
      ),
      sorter: true,
      width: 150
    },
    {
      title: t('productDetail.stock'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
      sorter: true
    },
    {
      title: t('productDetail.sold'),
      dataIndex: 'sold',
      key: 'sold',
      align: 'right',
      sorter: true
    },
    {
      title: t('filters.rating'),
      dataIndex: 'rating',
      key: 'rating',
      align: 'right',
      sorter: true,
      render: (rating: number) => <StarRating stars={rating} />
    },
    {
      title: t('status.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      sorter: true,
      render: (isActive: boolean) => <ProductActiveLabel isActive={isActive} />
    },
    {
      title: t('productDetail.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span>{humanReadableDate(createdAt)}</span>
      ),
      sorter: true
    },
    {
      title: t('action'),
      key: 'action',
      align: 'center',
      render: (_: any, product: ProductType) => (
        <Button
          type={product.isActive ? 'default' : 'primary'}
          size='small'
          danger={product.isActive}
          onClick={() => handleActiveProduct(product)}
        >
          {product.isActive ? t('button.ban') : t('button.active')}
        </Button>
      )
    }
  ]

  const handleActiveProduct = (product: ProductType) => {
    setActiveProduct(product)
    setIsConfirming(true)
  }

  const onSubmit = () => {
    if (!activeProduct) return
    setError('')
    const value = { isActive: !activeProduct.isActive }
    mutation.mutate({ productId: activeProduct._id, value })
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
  }

  return (
    <div className='w-full'>
      {error && <Alert message={error} type='error' />}
      <Modal
        open={isConfirming}
        title={
          !activeProduct?.isActive
            ? t('dialog.activeStore')
            : t('dialog.banStore')
        }
        onCancel={() => setIsConfirming(false)}
        onOk={onSubmit}
        okText={t('button.confirm')}
        cancelText={t('button.cancel')}
        confirmLoading={mutation.isPending}
      />
      <div className='p-3 bg-white rounded-md'>
        <div className='mb-3 flex gap-3 items-center flex-wrap'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
          />
          <Select
            style={{ minWidth: 140 }}
            value={pendingFilter.status}
            onChange={handleStatusChange}
            options={[
              { label: t('filters.all'), value: 'all' },
              { label: t('productStatus.selling'), value: 'selling' },
              { label: t('productStatus.unselling'), value: 'unselling' },
              { label: t('productStatus.infringing'), value: 'infringing' },
              { label: t('productStatus.outOfStock'), value: 'outOfStock' }
            ]}
            allowClear={false}
          />
          <RangePicker
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
          <Button
            onClick={() => refetch()}
            className='!h-10 !w-10 flex items-center justify-center'
            type='default'
            loading={isLoading}
            icon={<SyncOutlined spin={isLoading} />}
          />
        </div>
        <Divider />
        <Table
          columns={columns}
          dataSource={products}
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
              `${range[0]}-${range[1]} ${t('of')} ${total} ${t('result')}`,
            pageSizeOptions: [5, 10, 20, 50],
            showSizeChanger: true
          }}
          onChange={handleTableChange}
          size='small'
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  )
}

export default AdminProductsTable
