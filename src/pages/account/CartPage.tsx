import React, { useState, useEffect } from 'react'
import { getToken } from '../../apis/auth.api'
import { useTranslation } from 'react-i18next'
import { listCarts } from '../../apis/cart.api'
import cartEmpty from '../../assets/cartEmpty.png'
import { Spin, Alert } from 'antd'
import MainLayout from '../../components/layout/MainLayout'
import StoreSmallCard from '../../components/card/StoreSmallCard'
import ListCartItemsForm from '../../components/list/ListCartItemsForm'
import ListBestSellerProduct from '../../components/list/ListBestSellerProduct'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import MetaData from '../../components/layout/meta/MetaData'
import { useNavigate, useLocation } from 'react-router-dom'
import { createOrder } from '../../apis/order.api'
import useUpdateDispatch from '../../hooks/useUpdateDispatch'
import { socketId } from '../../socket'
import { CartType } from '../../@types/entity.types'

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

const CartPage = () => {
  const { _id } = getToken()
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [run, setRun] = useState(false)
  const [carts, setCarts] = useState<CartType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { cartCount } = useSelector((state: any) => state.account.user)
  const [updateDispatch] = useUpdateDispatch()
  let query = useQuery()

  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    setError('')
    listCarts(_id, { limit: '1000', page: '1' })
      .then((data) => {
        if (data?.data?.error) setError(data.data.error)
        else setCarts(data?.data?.carts || [])
        setTimeout(() => setError(''), 3000)
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => setError(''), 3000)
      })
  }, [run])

  useEffect(() => {
    const isOrder = query.get('isOrder')
    const cartId = query.get('cartId')
    const storeId = query.get('storeId')

    if (isOrder && cartId && storeId) {
      const orderString = localStorage.getItem('order')
      const orderBody = orderString ? JSON.parse(orderString) : null

      createOrder(_id, cartId, orderBody)
        .then((data) => {
          if (data?.data?.error) setError(data.data.error)
          else {
            updateDispatch('account', data.data.user)
            socketId.emit('createNotificationOrder', {
              objectId: data.data.order?._id,
              from: _id,
              to: storeId
            })
            navigate('/account/order')
            toast.success(t('toastSuccess.order.create'))
          }
          setIsLoading(false)
          setTimeout(() => setError(''), 3000)
        })
        .catch(() => {
          setError('Server Error')
          setTimeout(() => setError(''), 3000)
          setIsLoading(false)
        })
        .finally(() => {
          localStorage.removeItem('order')
        })
    }
  }, [query])

  return (
    <MainLayout>
      <div className='position-relative pt-4'>
        {' '}
        {isLoading && <Spin size='large' />}
        {error && <Alert message={error} type='error' />}
        <MetaData title={`${t('cart')}`} />
        {cartCount === 0 ? (
          <div className=''>
            <h5>{t('cart')}</h5>
            <div className='bg-white pb-3 mb-3 box-shadow rounded-2 items-center justify-content-center flex flex-column gap-2'>
              <img
                loading='lazy'
                src={cartEmpty}
                style={{ width: '200px' }}
                alt=''
              />
              <span className='text-danger'>{t('cartDetail.empty')}</span>
              <span className=''>{t('cartDetail.emptyRefer')}</span>
            </div>
            <ListBestSellerProduct sortBy='sold' heading={t('bestSeller')} />
          </div>
        ) : (
          <div className='accordion' id='accordionPanelsStayOpen'>
            <div
              style={{ backgroundColor: '#f1f5f9' }}
              className='container-fluid sticky-top-nav py-3 res-hide'
            >
              <div className='bg-white rounded-1 row p-1'>
                <div className='col-5'>
                  <label className='text-secondary fs-9'>
                    {t('cartDetail.all')} ({cartCount}{' '}
                    {t('cartDetail.products')})
                  </label>
                </div>
                <div className='col-7 flex'>
                  <div className='col-5 text-secondary text-center fs-9'>
                    {t('cartDetail.unitPrice')}
                  </div>
                  <div className='col-3 text-secondary text-center fs-9'>
                    {t('cartDetail.quantity')}
                  </div>
                  <div className='col-3 text-secondary text-center fs-9'>
                    {t('cartDetail.total')}
                  </div>
                  <div className='col-1 text-secondary text-center fs-9'>
                    <i className='fa-regular fa-trash-can pointer' />
                  </div>
                </div>
              </div>
            </div>
            {carts.map((cart, index) => (
              <div className='accordion-item mb-2' key={cart._id || index}>
                <h2
                  className='accordion-header'
                  id={`panelsStayOpen-heading-${index}`}
                >
                  <button
                    className='accordion-button btn'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target={`#panelsStayOpen-collapse-${index}`}
                    aria-expanded='true'
                    aria-controls={`panelsStayOpen-collapse-${index}`}
                  >
                    <StoreSmallCard store={cart.store} />
                    <i
                      style={{ fontSize: '0.9rem' }}
                      className='fa-solid fa-angle-right ms-1 text-secondary'
                    />
                  </button>
                </h2>
                <div
                  id={`panelsStayOpen-collapse-${index}`}
                  className='accordion-collapse collapse show'
                  aria-labelledby={`panelsStayOpen-collapse-${index}`}
                >
                  {' '}
                  <div className='accordion-body px-3'>
                    {!('isActive' in cart.store) && (
                      <Alert
                        message={t('toastError.storeBanned')}
                        type='error'
                        showIcon
                      />
                    )}

                    {'isActive' in cart.store && !cart.store.isOpen && (
                      <Alert
                        message={t('toastError.storeClosing')}
                        type='warning'
                        showIcon
                      />
                    )}

                    {'isActive' in cart.store && cart.store.isOpen && (
                      <ListCartItemsForm
                        cartId={cart._id}
                        storeId={
                          typeof cart.store === 'string'
                            ? cart.store
                            : cart.store._id
                        }
                        storeAddress={
                          typeof cart.store === 'string'
                            ? ''
                            : cart.store.address
                        }
                        userId={
                          typeof cart.userId === 'string'
                            ? cart.userId
                            : cart.userId._id
                        }
                        onRun={() => setRun(!run)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default CartPage
