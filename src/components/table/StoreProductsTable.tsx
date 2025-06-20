import React, { useState } from 'react'
import { getToken } from '../../apis/auth.api'
import {
  listProductsForManager,
  sellingProduct as showOrHide
} from '../../apis/product.api'
import { formatDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import { useQuery } from '@tanstack/react-query'
import { Table, Button, Modal, Alert, Tooltip, Tabs, Rate, Spin } from 'antd'
import {
  FileExcelOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import CategorySmallCard from '../card/CategorySmallCard'
import ProductActiveLabel from '../label/ProductActiveLabel'
import { useTranslation } from 'react-i18next'
import ProductSmallCard from '../card/ProductSmallCard'
import { toast } from 'react-toastify'
import {
  ProductFilterState,
  defaultProductFilter
} from '../../@types/filter.type'
import SellerProductForm from '../item/form/SellerProductForm'
import SearchInput from '../ui/SearchInput'
import { useAntdApp } from '../../hooks/useAntdApp'
import { useExportProducts } from '../../hooks/useExportProducts'
import { ProductStatus } from '../../enums/OrderStatus.enum'
import { ColumnsType } from 'antd/es/table'

interface StoreProductsTableProps {
  storeId: string
  run: boolean
}

const StoreProductsTable = ({
  storeId,
  run = false
}: StoreProductsTableProps) => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const { message } = useAntdApp()
  const { exportProducts } = useExportProducts()

  const [uiState, setUiState] = useState({
    isConfirming: false,
    drawerOpen: false,
    selectedOption: ProductStatus.ALL,
    selectedRowKeys: [] as React.Key[]
  })

  const [filterState, setFilterState] = useState({
    filter: defaultProductFilter,
    pendingFilter: defaultProductFilter
  })

  const [productState, setProductState] = useState({
    sellingProduct: {} as any,
    editingProductId: undefined as string | undefined
  })

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      'products',
      filterState.filter,
      storeId,
      uiState.selectedOption,
      run
    ],
    queryFn: async () => {
      let filterCopy = { ...filterState.filter }
      switch (uiState.selectedOption) {
        case ProductStatus.SELLING:
          filterCopy.isSelling = true
          break
        case ProductStatus.HIDDEN:
          filterCopy.isSelling = false
          break
        case ProductStatus.OUT_OF_STOCK:
          filterCopy.quantity = 0
          break
        case ProductStatus.INFRINGING:
          filterCopy.isActive = false
          break
        default:
          break
      }
      const res = await listProductsForManager({ ...filterCopy }, storeId)
      return res.data || res
    }
  })

  const products = data?.products || []

  const pagination = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || 1,
    pageCount: data?.filter?.pageCount || 1
  }

  const handleChangeKeyword = (keyword: string) => {
    setFilterState((prev) => ({
      ...prev,
      pendingFilter: { ...prev.pendingFilter, search: keyword, page: 1 }
    }))
  }

  const handleSearch = () => {
    setFilterState((prev) => ({ ...prev, filter: { ...prev.pendingFilter } }))
  }

  const handleSellingProduct = (product: any) => {
    setProductState((prev) => ({ ...prev, sellingProduct: product }))
    setUiState((prev) => ({ ...prev, isConfirming: true }))
  }

  const exportToXLSX = () => exportProducts(products, 'Products')
  const onSubmit = async () => {
    if (!uiState.isConfirming) return
    try {
      const value = { isSelling: !productState.sellingProduct.isSelling }
      const action = productState.sellingProduct.isSelling ? 'hide' : 'show'
      const res = await showOrHide(
        _id,
        value,
        storeId,
        productState.sellingProduct._id
      )
      const response = res.data || res
      if (response.error) {
        message.error(response.error)
      } else {
        message.success(t(`toastSuccess.product.${action}`))
        refetch()
      }
    } catch {
      message.error('Server Error')
    } finally {
      setUiState((prev) => ({ ...prev, isConfirming: false }))
    }
  }

  const rowSelection = {
    selectedRowKeys: uiState.selectedRowKeys,
    onChange: (keys: React.Key[]) =>
      setUiState((prev) => ({ ...prev, selectedRowKeys: keys }))
  }

  const columns: ColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      align: 'center',
      fixed: 'left',
      render: (_: any, __: any, idx: number) =>
        idx +
        1 +
        ((filterState.filter.page || 1) - 1) * (filterState.filter.limit || 8)
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
      render: (cat: any) => <CategorySmallCard category={cat} />
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
      align: 'right',
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
      align: 'right',
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
      align: 'center'
    },
    {
      title: t('productDetail.sold'),
      dataIndex: 'sold',
      key: 'sold',
      align: 'center'
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
      align: 'center',
      width: 120,
      key: 'rating',
      render: (rating: number) => (
        <Rate
          disabled
          allowHalf
          value={rating}
          className='!text-[13px] [&_.ant-rate-star]:!mr-0.5'
        />
      )
    },
    {
      title: t('status.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      align: 'center',
      render: (isActive: boolean) => <ProductActiveLabel isActive={isActive} />
    },
    {
      title: t('productDetail.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      width: 100,
      align: 'right',
      render: (date: string) => <span>{formatDate(date)}</span>
    },
    {
      title: t('action'),
      key: 'action',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: any) => (
        <div className='flex gap-2 items-center justify-center'>
          <Tooltip title={t('button.edit')}>
            <Button
              icon={<EditOutlined />}
              size='small'
              type='text'
              ghost
              onClick={() => {
                setProductState((prev) => ({
                  ...prev,
                  editingProductId: record._id
                }))
                setUiState((prev) => ({ ...prev, drawerOpen: true }))
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
              type={record.isSelling ? 'text' : 'primary'}
              onClick={() => handleSellingProduct(record)}
            />
          </Tooltip>
        </div>
      )
    }
  ]

  const productStatus = [
    { label: t('productDetail.all'), value: ProductStatus.ALL },
    { label: t('productDetail.selling'), value: ProductStatus.SELLING },
    { label: t('productDetail.hidden'), value: ProductStatus.HIDDEN },
    { label: t('productDetail.outOfStock'), value: ProductStatus.OUT_OF_STOCK },
    { label: t('status.infringing'), value: ProductStatus.INFRINGING }
  ]

  return (
    <Spin spinning={isLoading}>
      <div className='w-full'>
        {isError && !isLoading && storeId && (
          <Alert
            message='Server Error'
            type='error'
            showIcon
            className='mb-2'
          />
        )}{' '}
        <Modal
          open={uiState.isConfirming}
          title={
            productState.sellingProduct.isSelling
              ? t('title.hideProduct')
              : t('title.showProduct')
          }
          onOk={onSubmit}
          onCancel={() =>
            setUiState((prev) => ({ ...prev, isConfirming: false }))
          }
          okText={
            productState.sellingProduct.isSelling
              ? t('button.hide')
              : t('button.show')
          }
          cancelText={t('button.cancel')}
          confirmLoading={isLoading}
        >
          <p>
            {productState.sellingProduct.isSelling
              ? t('message.confirmHideProduct')
              : t('message.confirmShowProduct')}
          </p>
        </Modal>
        <div className='p-3 bg-white rounded-md'>
          <Tabs
            activeKey={uiState.selectedOption}
            onChange={(key) =>
              setUiState((prev) => ({
                ...prev,
                selectedOption: key as ProductStatus
              }))
            }
            items={productStatus.map((status) => ({
              key: status.value,
              label: status.label
            }))}
          />
          <div className='flex gap-3 items-center justify-between mb-3'>
            <SearchInput
              value={filterState.pendingFilter.search || ''}
              onChange={handleChangeKeyword}
              onSearch={handleSearch}
              loading={isLoading}
            />
            {uiState.selectedOption === ProductStatus.ALL && (
              <Button
                icon={<FileExcelOutlined />}
                type='primary'
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
            rowSelection={rowSelection}
            bordered
            pagination={{
              current: pagination.pageCurrent,
              total: pagination.size,
              pageSize: filterState.filter.limit
            }}
            locale={{ emptyText: t('productDetail.noProduct') }}
          />
        </div>
        <SellerProductForm
          open={uiState.drawerOpen}
          onClose={() => setUiState((prev) => ({ ...prev, drawerOpen: false }))}
          storeId={storeId}
          productId={productState.editingProductId}
          onSuccess={() => {
            setUiState((prev) => ({ ...prev, drawerOpen: false }))
            setProductState((prev) => ({
              ...prev,
              editingProductId: undefined
            }))
            refetch()
          }}
        />
      </div>
    </Spin>
  )
}

export default StoreProductsTable
