import { getToken } from '../../apis/auth'
import {
  getOrderByUser,
  getOrderByStore,
  getOrderForAdmin,
  listItemsByOrder
} from '../../apis/order'
import { humanReadableDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import Loading from '../ui/Loading'
import Error from '../ui/Error'
import OrderStatusLabel from '../label/OrderStatusLabel'
import Paragraph from '../ui/Paragraph'
import ListOrderItems from '../list/ListOrderItems'
import SellerUpdateOrderStatus from '../button/SellerUpdateOrderStatus'
import UserCancelOrderButton from '../button/UserCancelOrderButton'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { totalProducts } from '../../helper/total'
import { useSelector } from 'react-redux'
import Modal from '../ui/Modal'
import ReturnOrderForm from '../item/form/ReturnOrderForm'
import { calcTime } from '../../helper/calcTime'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { returnReasons } from '../../constants/reasons.constant'
import { OrderStatus, ReturnStatus } from '../../enums/OrderStatus.enum'

interface OrderDetailInfoProps {
  orderId: string
  storeId?: string
  by?: 'user' | 'store' | 'admin'
  isEditable?: boolean
}

const OrderDetailInfo = ({
  orderId = '',
  storeId = '',
  by = 'user',
  isEditable = false
}: OrderDetailInfoProps) => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const { level: userLevel } = useSelector((state: any) => state.account.user)
  const queryClient = useQueryClient()

  // Query for order
  const {
    data: orderData,
    isLoading: isOrderLoading,
    error: orderError,
    refetch: refetchOrder
  } = useQuery({
    queryKey: ['order', by, orderId, storeId, _id],
    queryFn: async () => {
      if (by === 'store') return await getOrderByStore(_id, orderId, storeId)
      if (by === 'admin') return await getOrderForAdmin(_id, orderId)
      return await getOrderByUser(_id, orderId)
    },
    enabled: !!orderId && !!_id
  })

  // Query for items (only for user)
  const {
    data: itemsData,
    isLoading: isItemsLoading,
    error: itemsError,
    refetch: refetchItems
  } = useQuery({
    queryKey: ['order-items', orderId, _id],
    queryFn: () => listItemsByOrder(_id, orderId),
    enabled: by === 'user' && !!orderId && !!_id
  })

  const order = orderData?.data?.order || {}
  const items = by === 'user' ? itemsData?.data?.items || [] : []

  const totalOrderSalePrice = items.reduce((total: number, item: any) => {
    if (item.productId?.salePrice) {
      return total + item.productId?.salePrice.$numberDecimal * item.count
    }
    return total
  }, 0)

  const saleFromPlatform =
    totalOrderSalePrice - totalProducts(items, userLevel).amountFromUser1

  const handleReload = () => {
    refetchOrder()
    if (by === 'user') refetchItems()
  }

  return (
    <div className='position-relative'>
      {(isOrderLoading || isItemsLoading) && <Loading />}
      {orderError ? (
        <Error msg={orderError.message} />
      ) : itemsError ? (
        <Error msg={itemsError.message} />
      ) : (
        <>
          <div className='flex flex-wrap justify-start items-center pb-2'>
            <h5 className='mx-1 orderID uppercase pe-3 border-r'>
              {t('orderDetail.id')} #{order._id}
            </h5>
            {(!isEditable ||
              by === 'admin' ||
              (isEditable &&
                by === 'store' &&
                order.status !== OrderStatus.NOT_PROCESSED &&
                order.status !== OrderStatus.PROCESSING &&
                order.status !== OrderStatus.SHIPPED)) && (
              <span className='fs-6 mb-2 ms-3 status'>
                <OrderStatusLabel status={order.status} />
                <span className='d-inline-block position-relative'>
                  <i
                    style={{ cursor: 'help' }}
                    className='fa-solid fa-circle-info ms-1 border rounded-circle cus-tooltip text-muted opacity-50'
                  ></i>
                  <small className='cus-tooltip-msg'>
                    {t('orderDetail.lastUpdateTime')}{' '}
                    {humanReadableDate(order.updatedAt)}
                  </small>
                </span>
              </span>
            )}
            {by === 'user' && order.status === OrderStatus.NOT_PROCESSED && (
              <div className='ms-4 mb-2'>
                <UserCancelOrderButton
                  orderId={order._id}
                  status={order.status}
                  detail={true}
                  createdAt={order.createdAt}
                  onRun={handleReload}
                />
              </div>
            )}
            {isEditable &&
              by === 'store' &&
              (order.status === OrderStatus.NOT_PROCESSED ||
                order.status === OrderStatus.PROCESSING ||
                order.status === OrderStatus.SHIPPED) && (
                <div className='mx-4 mb-2'>
                  <SellerUpdateOrderStatus
                    storeId={storeId}
                    orderId={orderId}
                    status={order.status}
                    onRun={handleReload}
                  />
                </div>
              )}
            {by === 'user' &&
              order.status === OrderStatus.DELIVERED &&
              calcTime(order.updatedAt) < 360 && (
                <div className='ms-auto position-relative d-inline-block'>
                  <button
                    className='btn btn-outline-primary rounded-1 ripple text-nowrap'
                    type='button'
                    data-bs-toggle='modal'
                    data-bs-target={`#request-return-order`}
                    disabled={
                      order.returnRequests &&
                      order.returnRequests.status !== ReturnStatus.REJECTED
                    }
                  >
                    {(() => {
                      if (!order.returnRequests) {
                        return t('orderDetail.return')
                      }
                      switch (order.returnRequests?.status) {
                        case ReturnStatus.PENDING:
                          return t('orderDetail.sentReturn')
                        case ReturnStatus.APPROVED:
                          return t('orderDetail.returnApproved')
                        case ReturnStatus.REJECTED:
                          return t('orderDetail.returnRejected')
                        default:
                          return t('orderDetail.return')
                      }
                    })()}
                  </button>

                  <Modal
                    id={`request-return-order`}
                    hasCloseBtn={false}
                    title={`${t('orderDetail.return')}`}
                  >
                    <ReturnOrderForm
                      reasons={returnReasons}
                      orderId={order._id}
                      userId={order.userId?._id}
                      storeId={order.storeId?._id}
                    />
                  </Modal>
                </div>
              )}
            {order.status === 'Returned' && (
              <span className='ms-3'>
                Lý do trả hàng: <b> {order.returnRequests?.reason}</b>
              </span>
            )}
            <i
              onClick={handleReload}
              className='btn fa-light
              fa-arrow-rotate-left ms-auto'
            ></i>
          </div>
          <div className='container-fluid mb-3'>
            <div className='row py-2 border rounded-1'>
              <div className='col-sm-6'>
                <Paragraph
                  label={t('orderDetail.date')}
                  colon
                  value={humanReadableDate(order.createdAt)}
                />
              </div>
              <div className='col-sm-6'>
                <Paragraph
                  label={t('orderDetail.store')}
                  colon
                  value={
                    <Link
                      className='link-hover'
                      title=''
                      to={`/store/${order.storeId?._id}`}
                    >
                      {order.storeId?.name}
                    </Link>
                  }
                />
              </div>
            </div>
          </div>

          <div className='container-fluid mb-3'>
            <div className='row py-2 border rounded-1'>
              <div className='col-sm-6'>
                <p className='border-bottom pb-2' style={{ fontWeight: '500' }}>
                  {t('orderDetail.senderAddress')}
                </p>
                <div>
                  <Paragraph value={order.storeId?.name} />
                  <Paragraph value={order.storeId?.address} />
                </div>
              </div>
              <div className='col-sm-6'>
                <p className='border-bottom pb-2' style={{ fontWeight: '500' }}>
                  {t('orderDetail.userReceiver')}
                </p>
                <div>
                  <Paragraph value={`${order.firstName} ${order.lastName}`} />
                  <Paragraph value={order.phone} />
                  <Paragraph value={order.address} />
                </div>
              </div>
            </div>
          </div>
          <div className='container-fluid mb-3'>
            <div className='row py-2 border rounded-1'>
              <div className='border-bottom pb-2'>
                <p style={{ fontWeight: '500' }}>
                  {t('orderDetail.ship_payment')}
                </p>
              </div>
              <div>
                <Paragraph
                  label={t('orderDetail.deliveryUnit')}
                  colon
                  value={'Giao hàng nhanh'}
                />
                <Paragraph
                  label={t('orderDetail.paymentMethod')}
                  colon
                  value={
                    order.isPaidBefore
                      ? t('orderDetail.onlinePayment')
                      : t('orderDetail.cod')
                  }
                />
              </div>
            </div>
          </div>
          <div className='container-fluid mb-3'>
            <div className='row py-2 border rounded-1'>
              <div className='border-bottom pb-2'>
                <p className='fw-normal'>{t('orderDetail.listProducts')}</p>
              </div>
              <ListOrderItems
                orderId={orderId}
                storeId={storeId}
                by={by}
                status={order.status}
              />
              <div className='d-flex justify-content-end border-top flex-column align-items-end'>
                {by === 'user' && getToken().role === 'user' && (
                  <div className='d-flex flex-column text-start text-nowrap fs-9'>
                    <div className='row gap-3 border-bottom py-2'>
                      <div className='col fw-normal'>
                        {t('cartDetail.subTotal')}
                      </div>
                      <div className='col text-end'>
                        <span>
                          {formatPrice(totalOrderSalePrice)}
                          <sup>₫</sup>
                        </span>
                      </div>
                    </div>
                    {saleFromPlatform !== 0 && (
                      <div className='row gap-3 border-bottom py-2'>
                        <div className='col'>
                          {t('cartDetail.BuynowVoucherApplied')}
                        </div>
                        <div className='col text-end'>
                          <span>
                            -{formatPrice(saleFromPlatform)}
                            <sup>₫</sup>
                          </span>
                        </div>
                      </div>
                    )}
                    <div className='row gap-3 border-bottom py-2'>
                      <div className='col'>{t('cartDetail.shippingFee')}</div>
                      <div className='col text-end'>
                        <span>
                          {formatPrice(order.shippingFee?.$numberDecimal)}
                          <sup>₫</sup>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div className='row gap-3 py-2 d-flex align-items-center text-nowrap'>
                  <div className='col'>{t('cartDetail.total')}:</div>
                  <div className='col text-end'>
                    <span className='text-primary fw-bold fs-12 d-flex'>
                      {formatPrice(order.amountFromUser?.$numberDecimal)} ₫
                      {by !== 'user' && (
                        <span
                          title={t('orderDetail.includedDiscount')}
                          className='d-inline-block position-relative ms-3'
                        >
                          <i
                            style={{ fontSize: '15px', cursor: 'help' }}
                            className='fa-solid fa-circle-info ms-1 border rounded-circle text-secondary opacity-50'
                          ></i>
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default OrderDetailInfo
