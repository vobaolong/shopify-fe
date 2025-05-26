import { useState, useEffect, Fragment } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { addSeller } from '../../store/actions/seller'
import { getToken } from '../../apis/auth.api'
import { getStoreProfile } from '../../apis/store.api'
import { getStoreLevel } from '../../apis/level.api'
import { getStoreFollowerCount } from '../../apis/followStore.api'
import { countOrder } from '../../apis/order.api'
import Loading from '../ui/Loading'
import Error from '../ui/Error'
import { useTranslation } from 'react-i18next'
import defaultImage from '../../assets/default.webp'

interface SellerInitProps {
  store: any
  actions: (store: any) => void
}

const SellerInit = ({ store, actions }: SellerInitProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [redirect, setRedirect] = useState(false)

  const { _id } = getToken()
  const { storeId } = useParams()
  const { t } = useTranslation()

  const safeStoreId = storeId || ''
  const safeUserId = _id || ''

  const init = () => {
    setIsLoading(true)
    setError('')

    getStoreProfile(safeUserId, safeStoreId)
      .then(async (res) => {
        const data = res.data
        if (data.error) {
          if (data.isManager === false) {
            setRedirect(true)
          } else {
            setError(data.error)
            setIsLoading(false)
          }
        } else {
          const newStore = data.store

          try {
            const res = await getStoreLevel(safeStoreId)
            newStore.level = res.data.level
          } catch {
            newStore.level = {}
          }

          try {
            const res = await getStoreFollowerCount(safeStoreId)
            newStore.numberOfFollowers = res.data.count
          } catch {
            newStore.numberOfFollowers = 0
          }

          try {
            const res1 = await countOrder('Delivered', '', safeStoreId)
            const res2 = await countOrder('Cancelled', '', safeStoreId)
            newStore.numberOfSuccessfulOrders = res1.data.count
            newStore.numberOfFailedOrders = res2.data.count
          } catch {
            newStore.numberOfSuccessfulOrders = 0
            newStore.numberOfFailedOrders = 0
          }

          actions(newStore)
          setIsLoading(false)
        }
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (!store || store._id !== storeId) init()
  }, [storeId])

  return (
    <Fragment>
      {redirect && <Navigate to='/' replace />}

      {isLoading ? (
        <div className='cus-position-relative-loading'>
          <Loading size='small' />
        </div>
      ) : (
        <div className='your-store-wrap'>
          <div className='your-store'>
            <div className='your-store-card btn lang ripple'>
              <img
                loading='lazy'
                src={store.avatar || defaultImage}
                className='your-store-img'
                alt='store avatar'
              />

              <span className='your-store-name unselect res-hide-xl'>
                {!error && store.name}
                {error && <Error msg={error} />}
              </span>
            </div>

            <ul
              className='list-group your-store-options p-3 bg-white fw-normal'
              style={{
                left: '10%'
              }}
            >
              <div className='d-flex align-items-start default'>
                <img
                  loading='lazy'
                  src={store.avatar || defaultImage}
                  className='your-account-img'
                  style={{ width: '35px', height: '35px' }}
                  alt='store avatar'
                />
                <span className='ms-2 d-flex flex-column'>
                  <span className='text-primary fw-bold'>{store.name}</span>
                  <small className='text-secondary'>
                    {store.ownerId?.email}
                  </small>
                </span>
              </div>
              <hr className='my-2' />
              <Link
                className='list-group-item your-store-options-item ripple rounded-1 bg-value border-0'
                to={`/seller/profile/${storeId}`}
              >
                <i className='fw-normal text-primary fs-9 fa-light fa-store'></i>
                {t('storeDetail.profile')}
              </Link>

              <Link
                className='list-group-item your-store-options-item ripple rounded-1 bg-value border-0 mt-2'
                to={`/seller/orders/${storeId}`}
              >
                <i className='fw-normal text-primary fs-9 fa-light fa-receipt'></i>
                {t('storeDetail.orders')}
              </Link>
              <hr className='my-2' />
              <Link
                className='list-group-item your-store-options-item ripple rounded-1 bg-value border-0 mt-2'
                to='/account/store'
              >
                <i className='fw-normal text-primary fs-9 fa-light fa-angle-left'></i>
                {t('button.back')}
              </Link>
            </ul>
          </div>
        </div>
      )}
    </Fragment>
  )
}

function mapStateToProps(state: any) {
  return { store: state.seller.store }
}

function mapDispatchToProps(dispatch: any) {
  return { actions: (store: any) => dispatch(addSeller(store)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(SellerInit)
