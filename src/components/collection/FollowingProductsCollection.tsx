import { useState } from 'react'
import { getToken } from '../../apis/auth'
import { useFavoriteProducts } from '../../hooks/useFavorite'
import ProductCard from '../card/ProductCard'
import Loading from '../ui/Loading'
import Error from '../ui/Error'
import Pagination from '../ui/Pagination'
import { useTranslation } from 'react-i18next'
import boxImg from '../../assets/box.svg'
import ShowResult from '../ui/ShowResult'

const FollowingProductsCollection = ({ heading = false }) => {
  const { t } = useTranslation()
  const [run, setRun] = useState(false)
  const { _id } = getToken()

  const [filter, setFilter] = useState({
    search: '',
    sortBy: 'name',
    order: 'desc',
    limit: 8,
    page: 1
  })

  // Use the custom hook instead of direct API call
  const { data, isLoading, error } = useFavoriteProducts(_id, filter)

  // Extract data from query result
  const listProducts = data?.data?.products || []
  const size = data?.data?.size || 0
  const pagination = {
    size,
    pageCurrent: data?.data?.filter?.pageCurrent || 1,
    pageCount: data?.data?.filter?.pageCount || 1
  }

  const handleChangePage = (newPage: number) => {
    setFilter({
      ...filter,
      page: newPage
    })
  }

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {error && <Error msg={error?.message || 'Server Error'} />}
      {heading && <h4 className='text-center'>{t('favProduct')}</h4>}
      <div className='p-3 box-shadow bg-body rounded-2'>
        {!isLoading && pagination.size === 0 ? (
          <div className='m-4 text-center'>
            <img className='mb-3' src={boxImg} alt='boxImg' width={'80px'} />
            <h5>{t('noFavProduct')}</h5>
          </div>
        ) : (
          <>
            <div className='container-fluid p-0 mt-3'>
              <div className='row'>
                {listProducts?.map((product: any, index: number) => (
                  <div className='col-lg-3 col-sm-4 col-6 mb-4' key={index}>
                    <ProductCard product={product} onRun={() => setRun(!run)} />
                  </div>
                ))}
              </div>
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

export default FollowingProductsCollection
