import { useState } from 'react'
import { getToken } from '../../apis/auth.api'
import { useListWishlist } from '../../hooks/useWishlist'
import ProductCard from '../card/ProductCard'
import { Spin, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import CardMini from '../card/CardMini'

const WishlistCollection = ({ heading = false }) => {
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
  const { data, isLoading, error } = useListWishlist(_id, filter)
  const listProducts = data?.products || []

  return (
    <Spin spinning={isLoading}>
      <div className='bg-white p-3 rounded shadow-sm'>
        {error && (
          <Alert
            message={error?.message || 'Server Error'}
            type='error'
            showIcon
          />
        )}
        <h4 className='text-center'>{t('favProduct')}</h4>
        <div className='container-fluid p-0 mt-3'>
          <div className='row'>
            {listProducts?.map((product: any, index: number) => (
              <div className='col-auto' key={product._id || index}>
                <CardMini product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default WishlistCollection
