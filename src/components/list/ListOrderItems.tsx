import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import {
  listItemsByOrder,
  listItemsByOrderByStore,
  listItemsByOrderForAdmin
} from '../../apis/order.api'
import { formatPrice } from '../../helper/formatPrice'
import Loading from '../ui/Loading'
import Error from '../ui/Error'
import ReviewItem from '../item/ReviewItem'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

const ListOrderItems = ({
  orderId = '',
  status = '',
  storeId = '',
  by = 'user'
}) => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['orderItems', _id, orderId, storeId, by],
    queryFn: async () => {
      if (by === 'store') {
        return listItemsByOrderByStore(_id, orderId, storeId).then(
          (res) => res.data
        )
      } else if (by === 'admin') {
        return listItemsByOrderForAdmin(orderId).then((res) => res.data)
      } else {
        return listItemsByOrder(_id, orderId).then((res) => res.data)
      }
    },
    enabled: !!orderId
  })
  const items: any[] = data?.items || []

  return (
    <div className='list-order-items position-relative py-1'>
      {isLoading && <Loading />}
      {isError && <Error msg={error?.message || 'Server Error'} />}
      <small className='text-muted d-inline-block'>
        {t('orderDetail.note')}
      </small>
      <div className='flex-column d-flex  justify-content-between'>
        {items.map((item: any, index: number) => (
          <div key={index} className='list-item-container'>
            <div className='d-flex align-items-center'>
              <div
                className='border rounded-1'
                style={{
                  position: 'relative',
                  paddingBottom: '80px',
                  maxWidth: '80px',
                  width: '100%',
                  height: '0'
                }}
              >
                <img
                  loading='lazy'
                  className='rounded-1'
                  src={item.productId?.listImages[0]}
                  alt={item.productId?.name}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '0',
                    objectFit: 'contain'
                  }}
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
                    <p
                      className='text-muted'
                      style={{ fontSize: '0.9rem' }}
                      key={index}
                    >
                      {value.variantId?.name}: {value.name}
                    </p>
                  ))}
                </div>

                <div className='mt-1 d-flex gap-4'>
                  <p className='text-decoration-line-through text-muted'>
                    {formatPrice(item.productId?.price?.$numberDecimal)}
                    <sup>₫</sup>
                  </p>

                  <h4 className='text-primary fs-5'>
                    {formatPrice(item.productId?.salePrice?.$numberDecimal)}
                    <sup>₫</sup>{' '}
                    <span className='text-secondary fs-6'>x {item.count}</span>
                  </h4>
                </div>

                {item.productId?.isActive && !item.productId?.isSelling && (
                  <Error msg={t('productDetail.error')} />
                )}

                {item.productId?.isActive &&
                  item.productId?.isSelling &&
                  item.productId?.quantity <= 0 && (
                    <Error msg={t('productDetail.soldOut')} />
                  )}

                {item.productId?.isActive &&
                  item.productId?.isSelling &&
                  item.productId?.quantity > 0 &&
                  item.productId?.quantity < item.count && (
                    <Error
                      msg={`${t('productDetail.warning')} ${
                        item.productId?.quantity
                      } `}
                    />
                  )}
              </div>

              {by === 'user' && status === 'Delivered' && (
                <div className='d-flex justify-content-between align-items-center my-2'>
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
