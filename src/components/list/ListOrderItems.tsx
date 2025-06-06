import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import {
  listItemsByOrder,
  listItemsByOrderByStore,
  listItemsByOrderForAdmin
} from '../../apis/order.api'
import { formatPrice } from '../../helper/formatPrice'
import { Spin, Alert } from 'antd'
import ReviewItem from '../item/ReviewItem'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

interface ListOrderItemsProps {
  orderId?: string
  status?: string
  storeId?: string
  by?: string
  items?: any[]
  isLoading?: boolean
}

const ListOrderItems = ({
  orderId = '',
  status = '',
  storeId = '',
  by = 'user',
  items: propItems,
  isLoading: propIsLoading
}: ListOrderItemsProps) => {
  const { t } = useTranslation()
  const { _id } = getToken()

  const {
    data: queryItems,
    isLoading: isQueryLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['orderItems', _id, orderId, storeId, by],
    queryFn: async () => {
      try {
        let response
        if (by === 'store') {
          response = await listItemsByOrderByStore(_id, orderId, storeId)
        } else if (by === 'admin') {
          response = await listItemsByOrderForAdmin(orderId)
        } else {
          response = await listItemsByOrder(_id, orderId)
        }
        return response?.items || []
      } catch (error: any) {
        console.error('Error fetching order items:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        return []
      }
    },
    enabled: !propItems && !!orderId && !!_id
  })

  const items = propItems || queryItems || []
  const isLoading = propIsLoading || isQueryLoading

  if (isLoading) {
    return <Spin size='large' />
  }

  if (isError) {
    return <Alert message={error?.message || 'Server Error'} type='error' />
  }

  return (
    <div className='list-order-items position-relative py-1'>
      <small className='text-muted d-inline-block'>
        {t('orderDetail.note')}
      </small>
      <div className='flex-column flex justify-content-between'>
        {items.map((item: any, index: number) => (
          <div key={index} className='list-item-container'>
            <div className='flex items-center'>
              <div className='!relative !pb-20 !max-w-[80px] !w-full !h-0 rounded-1 border'>
                <img
                  loading='lazy'
                  src={item.productId?.listImages[0]}
                  alt={item.productId?.name}
                  className='absolute w-full h-full top-0 left-0 object-contain'
                />
              </div>

              <div
                className='flex-grow-1 ms-3 align-items-start'
                style={{ flexDirection: 'column-reverse', width: '50%' }}
              >
                {item.productId.quantity > 0 ? (
                  <Link
                    className='text-reset text-decoration-none link-hover d-block mt-1'
                    to={`/product/${item.productId?._id}`}
                    title={item.productId?.name}
                  >
                    <p>{item.productId?.name}</p>
                  </Link>
                ) : (
                  <p className='text-reset text-decoration-none disable d-block mt-1'>
                    {item.productId?.name}
                  </p>
                )}
                <div className='mt-1'>
                  {item.variantValueIds?.map((value: any, index: number) => (
                    <p className='!text-nowrap text-sm' key={index}>
                      {value.variantId?.name}: {value.name}
                    </p>
                  ))}
                </div>
                <div className='mt-1 flex gap-4'>
                  <p className='text-decoration-line-through text-muted'>
                    {formatPrice(item.productId?.price?.$numberDecimal)}
                    <sup>₫</sup>
                  </p>

                  <h4 className='text-primary fs-5'>
                    {formatPrice(item.productId?.salePrice?.$numberDecimal)}
                    <sup>₫</sup>{' '}
                    <span className='text-secondary fs-6'>x {item.count}</span>
                  </h4>
                </div>{' '}
                {item.productId?.isActive && !item.productId?.isSelling && (
                  <Alert message={t('productDetail.error')} type='error' />
                )}
                {item.productId?.isActive &&
                  item.productId?.isSelling &&
                  item.productId?.quantity <= 0 && (
                    <Alert message={t('productDetail.soldOut')} type='error' />
                  )}{' '}
                {item.productId?.isActive &&
                  item.productId?.isSelling &&
                  item.productId?.quantity > 0 &&
                  item.productId?.quantity < item.count && (
                    <Alert
                      message={`${t('productDetail.warning')} ${
                        item.productId?.quantity
                      } `}
                      type='warning'
                    />
                  )}
              </div>

              {by === 'user' && status === 'Delivered' && (
                <div className='flex justify-between items-center my-2'>
                  <ReviewItem
                    orderId={item?.orderId}
                    storeId={item?.productId?.storeId?._id}
                    productId={item?.productId?._id}
                    productName={item?.productId?.name}
                    productImage={item.productId?.listImages[0]}
                    productVariant={item.variantValueIds?.map(
                      (value: any, index: number) => value.variantId?.name
                    )}
                    productVariantValue={item.variantValueIds?.map(
                      (value: any, index: number) => value.name
                    )}
                    date={item?.updatedAt}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListOrderItems
