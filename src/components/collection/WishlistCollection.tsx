import { useState } from 'react'
import { getToken } from '../../apis/auth.api'
import { useListWishlist } from '../../hooks/useWishlist'
import ProductCard from '../card/ProductCard'
import { Spin, Alert, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import WishlistCard from '../card/WishlistCard'

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
          <Row gutter={[16, 16]}>
            {listProducts?.map((product: any, index: number) => (
              <Col key={product._id || index}>
                <WishlistCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </Spin>
  )
}

export default WishlistCollection
