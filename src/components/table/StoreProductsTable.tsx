/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import {
  listProductsForManager,
  sellingProduct as showOrHide
} from '../../apis/product.api'
import { formatDate, humanReadableDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import Pagination from '../ui/Pagination'
import SearchInput from '../ui/SearchInput'
import SortByButton from './sub/SortByButton'
import CategorySmallCard from '../card/CategorySmallCard'
import ProductActiveLabel from '../label/ProductActiveLabel'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import ProductSmallCard from '../card/ProductSmallCard'
import { toast } from 'react-toastify'
import ShowResult from '../ui/ShowResult'
import boxImg from '../../assets/box.svg'
import * as XLSX from 'xlsx'
import {
  ProductFilterState,
  defaultProductFilter
} from '../../@types/filter.type'

const StoreProductsTable = ({ storeId = '', selectedOption = 'all' }) => {
  const { t } = useTranslation()
  const [run, setRun] = useState(false)
  const [error, setError] = useState('')
  const { _id } = getToken()
  const [products, setProducts] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [sellingProduct, setSellingProduct] = useState<any>({})
  const [pagination, setPagination] = useState({
    size: 0,
    pageCurrent: 1,
    pageCount: 1
  })
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
  const init = () => {
    setError('')
    setIsLoading(true)
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
    listProductsForManager(_id, filterCopy, storeId)
      .then((data) => {
        const response = data.data || data
        if (response.error) setError(response.error)
        else {
          setProducts(response.products || [])
          setPagination({
            size: response.size || 0,
            pageCurrent: response.filter?.pageCurrent || 1,
            pageCount: response.filter?.pageCount || 1
          })
        }
        setIsLoading(false)
        setTimeout(() => setError(''), 3000)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => setError(''), 3000)
      })
  }

  useEffect(() => {
    init()
  }, [filter, storeId, run, selectedOption])

  useEffect(() => {
    setFilter({
      ...filter
    })
  }, [])
  const handleFilterChange = (updates: Partial<ProductFilterState>) => {
    setPendingFilter((prev) => ({
      ...prev,
      ...updates,
      page: 1
    }))
  }

  const handleSearch = () => {
    setFilter({ ...pendingFilter })
  }

  const handleChangeKeyword = (keyword: string) => {
    handleFilterChange({ search: keyword })
  }

  const handleChangePage = (newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }))
  }

  const handleSetSortBy = (order: string, sortBy: string) => {
    setFilter((prev) => ({ ...prev, order: order as 'asc' | 'desc', sortBy }))
  }
  const handleSellingProduct = (product: any) => {
    setSellingProduct(product)
    setIsConfirming(true)
  }

  const onSubmit = () => {
    setError('')
    if (!isConfirming) return
    setIsLoading(true)
    const value = { isSelling: !sellingProduct.isSelling }
    const action = sellingProduct.isSelling ? 'hide' : 'show'
    showOrHide(_id, value, storeId, sellingProduct._id)
      .then((data) => {
        const response = data.data || data
        if (response.error) {
          setError(response.error)
        } else {
          toast.success(t(`toastSuccess.product.${action}`))
          setRun((prev) => !prev)
        }
        setTimeout(() => {
          setError('')
        }, 3000)
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
  }
  const exportToXLSX = () => {
    const filteredProducts = allProducts.map((product, index) => ({
      No: index + 1,
      Id: product._id,
      ProductName: product.name,
      Price: `${formatPrice(product.price?.$numberDecimal)} đ`,
      SalePrice: `${formatPrice(product.salePrice?.$numberDecimal)} đ`,
      Quantity: product.quantity,
      Sold: product.sold,
      Category: product.categoryId?.name,
      VariantValue: product.variantValueIds
        .map((value: any) => value.name)
        .join(', '),
      Rating: product.rating,
      Active: product.isActive,
      Selling: product.isSelling,
      CreatedAt: formatDate(product.createdAt)
    }))

    const worksheet = XLSX.utils.json_to_sheet(filteredProducts)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
    XLSX.writeFile(workbook, 'Products.xlsx')
  }
  return (
    <div className='position-relative'>
      {alerts.isSellingAlert && selectedOption === 'all' ? (
        <div className='alert alert-info'>
          <i className='text-primary fa-solid fa-circle-info' /> Tất cả - Mục
          này chứa tất cả sản phẩm
          <button
            className='btn-close'
            onClick={() =>
              setAlerts((prev) => ({ ...prev, isSellingAlert: false }))
            }
          />
        </div>
      ) : null}

      {alerts.isAllAlert && selectedOption === 'selling' ? (
        <div className='alert alert-info'>
          <i className='text-primary fa-solid fa-circle-info' /> Đang bán - Mục
          này chứa các sản phẩm có thể bán.
          <button
            className='btn-close'
            onClick={() =>
              setAlerts((prev) => ({ ...prev, isAllAlert: false }))
            }
          />
        </div>
      ) : null}

      {alerts.isHiddenAlert && selectedOption === 'hidden' ? (
        <div className='alert alert-info'>
          <i className='text-primary fa-solid fa-circle-info' /> Đã ẩn - Mục này
          chứa các sản phẩm mà Nhà bán đã tắt toàn bộ lựa chọn. Khách hàng không
          thể xem và đặt hàng.
          <button
            className='btn-close'
            onClick={() =>
              setAlerts((prev) => ({ ...prev, isHiddenAlert: false }))
            }
          />
        </div>
      ) : null}

      {alerts.isOutOfStockAlert && selectedOption === 'outOfStock' ? (
        <div className='alert alert-info'>
          <i className='text-primary fa-solid fa-circle-info' /> Hết hàng - Mục
          này chứa các sản phẩm đã hết hàng. Khách hàng không thể xem và đặt
          hàng.
          <button
            className='btn-close'
            onClick={() =>
              setAlerts((prev) => ({ ...prev, isOutOfStockAlert: false }))
            }
          />
        </div>
      ) : null}

      {alerts.isInfringingAlert && selectedOption === 'infringing' ? (
        <div className='alert alert-info'>
          <i className='text-primary fa-solid fa-circle-info' /> Vi phạm - Mục
          này chứa các sản phẩm bị tạm khoá. Khách hàng không thể xem và đặt
          hàng.
          <button
            className='btn-close'
            onClick={() =>
              setAlerts((prev) => ({ ...prev, isInfringingAlert: false }))
            }
          />
        </div>
      ) : null}

      {isLoading && (
        <div className='d-flex justify-content-center p-3'>
          <div className='spinner-border' />
        </div>
      )}
      {error && <div className='alert alert-danger'>{error}</div>}
      {isConfirming && (
        <ConfirmDialog
          title={
            sellingProduct.isSelling
              ? t('title.hideProduct')
              : t('title.showProduct')
          }
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}

      <div className='p-3 box-shadow bg-body rounded-2'>
        <div className='mb-3 d-flex justify-content-between'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
          />
          {selectedOption === 'all' && (
            <button
              type='button'
              className='btn btn-sm btn-success ripple'
              onClick={exportToXLSX}
            >
              <i className='fa-solid fa-file-excel me-2' />
              {t('productDetail.export')}
            </button>
          )}
        </div>
        {!isLoading && pagination.size === 0 ? (
          <div className='my-4 text-center'>
            <img className='mb-3' src={boxImg} alt='boxImg' width={'80px'} />
            <h5>{t('productDetail.noProduct')}</h5>
          </div>
        ) : (
          <>
            <div className='table-scroll my-2'>
              <table className='table align-middle table-hover table-sm text-start'>
                <thead>
                  <tr>
                    <th scope='col' className='text-center'></th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.name')}
                        sortBy='name'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.category')}
                        sortBy='categoryId'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>

                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.brand')}
                        sortBy='brandId'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col' className='text-end'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.price')}
                        sortBy='price'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>

                    <th scope='col' className='text-end'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.salePrice')}
                        sortBy='salePrice'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>

                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.stock')}
                        sortBy='quantity'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>

                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.sold')}
                        sortBy='sold'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>

                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.values')}
                        sortBy='variantValueIds'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>

                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('filters.rating')}
                        sortBy='rating'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>

                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('status.status')}
                        sortBy='isActive'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>

                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.date')}
                        sortBy='createdAt'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>

                    <th scope='col'>
                      <span>{t('action')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      {' '}
                      <th scope='row'>
                        {index +
                          1 +
                          ((filter.page || 1) - 1) * (filter.limit || 8)}
                      </th>
                      <td
                        style={{
                          whiteSpace: 'normal',
                          minWidth: '400px',
                          width: 'fit-content'
                        }}
                      >
                        <small>
                          <ProductSmallCard product={product} />
                        </small>
                      </td>
                      <td>
                        <small className='badge border rounded-1 bg-value text-dark-emphasis'>
                          <CategorySmallCard
                            parent={false}
                            category={product.categoryId}
                          />
                        </small>
                      </td>
                      <td>{product.brandId?.name}</td>
                      <td className='text-end'>
                        {formatPrice(product.price?.$numberDecimal)}
                        <sup>₫</sup>
                      </td>
                      <td className='text-end'>
                        {formatPrice(product.salePrice?.$numberDecimal)}
                        <sup>₫</sup>
                      </td>
                      <td>{product.quantity}</td>
                      <td>{product.sold}</td>
                      <td style={{ whiteSpace: 'normal' }}>
                        <div
                          className='d-flex flex-wrap justify-content-start align-items-center gap-1'
                          style={{
                            width: '250px',
                            maxHeight: '120px',
                            overflow: 'auto'
                          }}
                        >
                          {product.variantValueIds?.length > 0 ? (
                            product.variantValueIds?.map((value: any) => (
                              <small
                                key={value._id}
                                className='badge rounded-1 text-dark-emphasis bg-value me-1'
                              >
                                {value.name}
                              </small>
                            ))
                          ) : (
                            <small>-</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <small>
                          <i className='fa-solid fa-star text-warning me-1' />
                          {product.rating}
                        </small>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.9rem' }}>
                          <ProductActiveLabel isActive={product.isActive} />
                        </span>
                      </td>
                      <td>
                        <small>{humanReadableDate(product.createdAt)}</small>
                      </td>
                      <td>
                        <div className='d-flex justify-content-start align-items-center'>
                          <div className='position-relative d-inline-block'>
                            <Link
                              type='button'
                              className='btn btn-sm btn-outline-primary ripple rounded-1 cus-tooltip'
                              to={`/seller/products/edit/${product._id}/${storeId}`}
                            >
                              <i className='fa-duotone fa-pen-to-square' />
                            </Link>
                            <span className='cus-tooltip-msg'>
                              {t('button.edit')}
                            </span>
                          </div>
                          <div className='position-relative d-inline-block'>
                            <button
                              type='button'
                              className={`btn btn-sm rounded-1 ripple ms-2 cus-tooltip btn-outline-${
                                !product.isSelling ? 'success' : 'secondary'
                              }`}
                              onClick={() => handleSellingProduct(product)}
                            >
                              <i
                                className={`fa-solid ${
                                  !product.isSelling ? 'fa-box' : 'fa-archive'
                                }`}
                              />
                            </button>
                            <span className='cus-tooltip-msg'>
                              {!product.isSelling
                                ? t('button.show')
                                : t('button.hide')}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='d-flex justify-content-between align-items-center px-4'>
              <ShowResult
                limit={filter.limit}
                size={pagination.size}
                pageCurrent={pagination.pageCurrent}
              />
              {pagination.size !== 0 && (
                <Pagination
                  pagination={pagination}
                  onChangePage={handleChangePage}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default StoreProductsTable
