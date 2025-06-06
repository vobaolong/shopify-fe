/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCategoryById } from '../../apis/category.api'
import { listActiveProducts } from '../../apis/product.api'
import MainLayout from '../../components/layout/MainLayout'
import ProductCard from '../../components/card/ProductCard'
import Pagination from '../../components/ui/Pagination'
import { Spin, Alert } from 'antd'
import ProductFilter from '../../components/filter/ProductFilter'
import ListCategories from '../../components/list/ListCategories'
import { useTranslation } from 'react-i18next'
import MetaData from '../../components/layout/meta/MetaData'

const CategoryPage = () => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { categoryId } = useParams()
  const [category, setCategory] = useState({})
  const [listProducts, setListProducts] = useState([])
  const [pagination, setPagination] = useState({
    size: 0
  })
  const [filter, setFilter] = useState({
    search: '',
    rating: '',
    categoryId,
    brandId: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'sold',
    order: 'desc',
    limit: 10,
    page: 1
  })

  const getCategory = () => {
    getCategoryById(categoryId)
      .then((data) => {
        if (data.success) setCategory(data.category)
        else return
      })
      .catch((error) => {
        return
      })
  }

  const init = () => {
    setError('')
    setIsLoading(true)
    listActiveProducts(filter)
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
  }, [filter])

  useEffect(() => {
    getCategory()
    setFilter({
      ...filter,
      categoryId
    })
  }, [categoryId])

  const handleChangePage = (newPage) => {
    setFilter({
      ...filter,
      page: newPage
    })
  }

  return (
    <MainLayout>
      <div className='position-relative pt-4'>
        {' '}
        {isLoading && <Spin size='large' />}
        {error && <Alert message={error} type='error' />}
        <MetaData title={`${category.name} | ShopBase Việt Nam`} />
        <nav aria-label='breadcrumb'>
          <ol className='breadcrumb'>
            <Link to='/' className='breadcrumb-item text-decoration-none'>
              {t('home')}
            </Link>

            {category.categoryId?.categoryId && (
              <Link
                to={`/category/${category.categoryId.categoryId._id}`}
                className='breadcrumb-item text-decoration-none'
              >
                {category.categoryId.categoryId.name}
              </Link>
            )}

            {category.categoryId && (
              <Link
                to={`/category/${category.categoryId._id}`}
                className='breadcrumb-item text-decoration-none'
              >
                {category.categoryId.name}
              </Link>
            )}

            {category && (
              <Link
                to={`/category/${category._id}`}
                className='breadcrumb-item active'
              >
                {category.name}
              </Link>
            )}
          </ol>
        </nav>
        <div className='mb-4'>
          <ListCategories categoryId={categoryId} heading={false} />
        </div>
        <div className='flex justify-content-between align-items-end'>
          <ProductFilter filter={filter} setFilter={setFilter} />
        </div>
        <div className='product-search-list row mt-3'>
          {listProducts?.map((product, index) => (
            <div
              className='col-xl-2-5 col-md-3 col-sm-4 col-6 mb-4'
              key={index}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {pagination.size !== 0 && (
          <Pagination pagination={pagination} onChangePage={handleChangePage} />
        )}
      </div>
    </MainLayout>
  )
}

export default CategoryPage
