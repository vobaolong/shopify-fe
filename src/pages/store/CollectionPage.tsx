/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { listSellingProductsByStore } from '../../apis/product.api'
import useUpdateEffect from '../../hooks/useUpdateEffect'
import ProductCard from '../../components/card/ProductCard'
import Pagination from '../../components/ui/Pagination'
import { Spin, Alert } from 'antd'
import ProductFilter from '../../components/filter/ProductFilter'
import StoreLayout from '../../components/layout/StoreLayout'
import MainLayout from '../../components/layout/MainLayout'
import { useTranslation } from 'react-i18next'
import ShowResult from '../../components/ui/ShowResult'
import { selectStoreStore } from '../../store/slices/storeSlice'

const CollectionPage = () => {
  const store = useSelector(selectStoreStore)
  const { t } = useTranslation()

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const keyword = new URLSearchParams(useLocation().search).get('keyword') || ''
  const [listProducts, setListProducts] = useState([])
  const [pagination, setPagination] = useState({
    size: 0
  })
  const [filter, setFilter] = useState({
    search: keyword,
    rating: '',
    minPrice: 0,
    maxPrice: '',
    sortBy: 'sold',
    order: 'desc',
    categoryId: '',
    limit: 10,
    page: 1
  })

  const init = () => {
    setError('')
    setIsLoading(true)
    listSellingProductsByStore(filter, store._id)
      .then((data) => {
        if (data.error) setError(data.error)
        else {
          setPagination({
            size: data.size,
            pageCurrent: data.filter.pageCurrent,
            pageCount: data.filter.pageCount
          })
          setListProducts(data.products)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error)
        setIsLoading(false)
      })
  }
  useEffect(() => {
    init()
  }, [filter, store])

  useUpdateEffect(() => {
    setFilter({
      ...filter,
      search: keyword,
      page: 1
    })
  }, [keyword])
  const handleChangePage = (newPage) => {
    setFilter({
      ...filter,
      page: newPage
    })
  }
  const paths = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: `${store.name}`, url: `/store/${store._id}` },
    { name: t('breadcrumbs.collection'), url: `/store/collection/${store._id}` }
  ]
  return typeof store.isActive === 'boolean' && !store.isActive ? (
    <MainLayout>
      <Alert message={t('toastError.storeBanned')} type='error' showIcon />
    </MainLayout>
  ) : (
    <StoreLayout store={store} paths={paths}>
      <div className='position-relative'>
        {isLoading && (
          <div className='flex justify-content-center p-4'>
            <Spin size='large' />
          </div>
        )}
        {error && <Alert message={error} type='error' showIcon />}

        <ProductFilter filter={filter} setFilter={setFilter} />

        <div className='row mt-3'>
          {listProducts?.map((product, index) => (
            <div
              className='col-xl-2-5 col-lg-3 col-md-3 col-sm-4 col-6 mb-4'
              key={index}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {!isLoading && pagination.size === 0 && (
          <div className='flex justify-content-center mt-5 text-primary text-center'>
            <h5>{t('productDetail.noProduct')}</h5>
          </div>
        )}
        <div className='flex px-5 items-center justify-content-between'>
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
      </div>
    </StoreLayout>
  )
}

export default CollectionPage
