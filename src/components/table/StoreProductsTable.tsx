/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import {
  listProductsForManager,
  sellingProduct as showOrHide
} from '../../apis/product.api'
import { formatDate, humanReadableDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Button, Modal, Alert, Spin, Tooltip, Tabs } from 'antd'
import {
  SearchOutlined,
  FileExcelOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import SortByButton from './sub/SortByButton'
import CategorySmallCard from '../card/CategorySmallCard'
import ProductActiveLabel from '../label/ProductActiveLabel'
import { useTranslation } from 'react-i18next'
import ProductSmallCard from '../card/ProductSmallCard'
import { toast } from 'react-toastify'
import boxImg from '../../assets/box.svg'
import * as XLSX from 'xlsx'
import {
  ProductFilterState,
  defaultProductFilter
} from '../../@types/filter.type'
import SellerProductForm from '../item/form/SellerProductForm'
import SearchInput from '../ui/SearchInput'
import { Empty } from 'antd/lib'

interface StoreProductsTableProps {
  storeId?: string
  run?: boolean
}

const StoreProductsTable = ({
  storeId = '',
  run = false
}: StoreProductsTableProps) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const { _id } = getToken()
  const [isConfirming, setIsConfirming] = useState(false)
  const [sellingProduct, setSellingProduct] = useState<any>({})
  const [alerts, setAlerts] = useState({
    isAllAlert: true,
    isSellingAlert: true,
    isHiddenAlert: true,
    isOutOfStockAlert: true,
    isInfringingAlert: true
  })
  const [filter, setFilter] = useState<ProductFilterState>(defaultProductFilter)
  const [pendingFilter, setPendingFilter] =
    useState<ProductFilterState>(defaultProductFilter)
  const queryClient = useQueryClient()

  // Tabs state
  const [selectedOption, setSelectedOption] = useState('all')
  const productStatus = [
    {
      label: t('productDetail.all'),
      value: 'all'
    },
    { label: t('productDetail.selling'), value: 'selling' },
    { label: t('productDetail.hidden'), value: 'hidden' },
    { label: t('productDetail.outOfStock'), value: 'outOfStock' },
    { label: t('status.infringing'), value: 'infringing' }
  ]

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', filter, storeId, selectedOption, run],
    queryFn: async () => {
      let filterCopy = { ...filter }
      switch (selectedOption) {
        case 'selling':
          filterCopy.isSelling = true
          break
        case 'hidden':
          filterCopy.isSelling = false
          break
        case 'outOfStock':
          filterCopy.quantity = 0
          break
        case 'infringing':
          filterCopy.isActive = false
          break
        default:
          break
      }
      const res = await listProductsForManager({ ...filterCopy }, storeId)
      return res.data || res
    }
  })

  const products = Array.isArray(data?.products) ? data.products : []
  const pagination = {
    size: typeof data?.size === 'number' ? data.size : 0,
    pageCurrent:
      typeof data?.filter?.pageCurrent === 'number'
        ? data.filter.pageCurrent
        : 1,
    pageCount:
      typeof data?.filter?.pageCount === 'number' ? data.filter.pageCount : 1
  }

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

  const handleSellingProduct = (product: any) => {
    setSellingProduct(product)
    setIsConfirming(true)
  }

  const onSubmit = async () => {
    setError('')
    if (!isConfirming) return
    try {
      const value = { isSelling: !sellingProduct.isSelling }
      const action = sellingProduct.isSelling ? 'hide' : 'show'
      const res = await showOrHide(_id, value, storeId, sellingProduct._id)
      const response = res.data || res
      if (response.error) {
        setError(response.error)
      } else {
        toast.success(t(`toastSuccess.product.${action}`))
        refetch()
      }
    } catch {
      setError('Server Error')
    } finally {
      setIsConfirming(false)
      setTimeout(() => setError(''), 3000)
    }
  }

  const exportToXLSX = () => {
    const filteredProducts = Array.isArray(data?.products)
      ? data.products.map((product: any, index: number) => ({
          No: index + 1,
          Id: product._id,
          ProductName: product.name,
          Price: `${formatPrice(product.price?.$numberDecimal)} đ`,
          SalePrice: `${formatPrice(product.salePrice?.$numberDecimal)} đ`,
          Quantity: product.quantity,
          Sold: product.sold,
          Category: product.categoryId?.name,
          VariantValue: product.variantValueIds
            ?.map((value: any) => value.name)
            .join(', '),
          Rating: product.rating,
          Active: product.isActive,
          Selling: product.isSelling,
          CreatedAt: formatDate(product.createdAt)
        }))
      : []
    const worksheet = XLSX.utils.json_to_sheet(filteredProducts)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
    XLSX.writeFile(workbook, 'Products.xlsx')
  }

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | undefined>(
    undefined
  )

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      align: 'center' as const,
      render: (_: any, __: any, idx: number) =>
        idx + 1 + ((filter.page || 1) - 1) * (filter.limit || 8)
    },
    {
      title: t('productDetail.name'),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => <ProductSmallCard product={record} />,
      width: 300
    },
    {
      title: t('productDetail.category'),
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (cat: any) => <CategorySmallCard parent={false} category={cat} />
    },
    {
      title: t('productDetail.brand'),
      dataIndex: ['brandId', 'name'],
      key: 'brandId',
      render: (_: any, record: any) => record.brandId?.name || '-'
    },
    {
      title: t('productDetail.price'),
      dataIndex: ['price', '$numberDecimal'],
      key: 'price',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <span>
          {formatPrice(record.price?.$numberDecimal)}
          <sup>₫</sup>
        </span>
      )
    },
    {
      title: t('productDetail.salePrice'),
      dataIndex: ['salePrice', '$numberDecimal'],
      key: 'salePrice',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <span>
          {formatPrice(record.salePrice?.$numberDecimal)}
          <sup>₫</sup>
        </span>
      )
    },
    {
      title: t('productDetail.stock'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const
    },
    {
      title: t('productDetail.sold'),
      dataIndex: 'sold',
      key: 'sold',
      align: 'center' as const
    },
    {
      title: t('productDetail.values'),
      dataIndex: 'variantValueIds',
      key: 'variantValueIds',
      render: (values: any[]) => (
        <div className='flex flex-wrap gap-1 max-h-28 overflow-auto w-64'>
          {values?.length > 0 ? (
            values.map((value) => (
              <span
                key={value._id}
                className='badge rounded bg-gray-100 text-gray-700'
              >
                {value.name}
              </span>
            ))
          ) : (
            <span>-</span>
          )}
        </div>
      )
    },
    {
      title: t('filters.rating'),
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <span>
          <i className='fa-solid fa-star text-yellow-400 mr-1' />
          {rating}
        </span>
      )
    },
    {
      title: t('status.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => <ProductActiveLabel isActive={isActive} />
    },
    {
      title: t('productDetail.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => <span>{humanReadableDate(date)}</span>
    },
    {
      title: t('action'),
      key: 'action',
      render: (_: any, record: any) => (
        <div className='flex gap-2'>
          <Tooltip title={t('button.edit')}>
            <Button
              icon={<EditOutlined />}
              size='small'
              type='primary'
              ghost
              onClick={() => {
                setEditingProductId(record._id)
                setDrawerOpen(true)
              }}
            />
          </Tooltip>
          <Tooltip
            title={record.isSelling ? t('button.hide') : t('button.show')}
          >
            <Button
              icon={
                record.isSelling ? <EyeInvisibleOutlined /> : <EyeOutlined />
              }
              size='small'
              type={record.isSelling ? 'default' : 'primary'}
              onClick={() => handleSellingProduct(record)}
            />
          </Tooltip>
        </div>
      )
    }
  ]

  const handleChangePage = (page: number) => {
    setFilter((prev) => ({ ...prev, page }))
  }

  return (
    <div className='w-full'>
      {error && (
        <Alert message={error} type='error' showIcon className='mb-2' />
      )}
      {isError && (
        <Alert message='Server Error' type='error' showIcon className='mb-2' />
      )}
      <Modal
        open={isConfirming}
        title={
          sellingProduct.isSelling
            ? t('title.hideProduct')
            : t('title.showProduct')
        }
        onOk={onSubmit}
        onCancel={() => setIsConfirming(false)}
        okText={sellingProduct.isSelling ? t('button.hide') : t('button.show')}
        cancelText={t('button.cancel')}
        confirmLoading={isLoading}
      >
        <p>
          {sellingProduct.isSelling
            ? t('message.confirmHideProduct')
            : t('message.confirmShowProduct')}
        </p>
      </Modal>
      <div className='p-3 bg-white rounded-md'>
        <Tabs
          activeKey={selectedOption}
          onChange={setSelectedOption}
          items={productStatus.map((status) => ({
            key: status.value,
            label: status.label
          }))}
        />
        <div className='flex gap-3 items-center justify-between mb-3'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
          />
          {selectedOption === 'all' && (
            <Button
              icon={<FileExcelOutlined />}
              type='primary'
              variant='solid'
              color='green'
              onClick={exportToXLSX}
            >
              {t('productDetail.export')}
            </Button>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={products}
          rowKey='_id'
          className='mb-4'
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pagination.pageCurrent,
            total: pagination.size,
            pageSize: filter.limit,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            pageSizeOptions: ['5', '10', '20', '50']
          }}
          locale={{
            emptyText: <Empty description={t('productDetail.noProduct')} />
          }}
        />
      </div>
      <SellerProductForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        storeId={storeId}
        productId={editingProductId}
        onSuccess={() => {
          setDrawerOpen(false)
          setEditingProductId(undefined)
          refetch()
        }}
      />
    </div>
  )
}

export default StoreProductsTable
