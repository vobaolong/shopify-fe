import { Spin, Alert, Descriptions, Button, Typography, Divider } from 'antd'
import { getToken } from '../../apis/auth.api'
import {
  getOrderByUser,
  getOrderByStore,
  getOrderForAdmin,
  listItemsByOrder
} from '../../apis/order.api'
import { humanReadableDate } from '../../helper/humanReadable'
import { formatPrice } from '../../helper/formatPrice'
import { useTranslation } from 'react-i18next'
import { totalProducts } from '../../helper/total'
import { useSelector } from 'react-redux'
import ReturnOrderForm from '../item/form/ReturnOrderForm'
import { calcTime } from '../../helper/calcTime'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { returnReasons } from '../../constants/reasons.constant'
import { OrderStatus, ReturnStatus } from '../../enums/OrderStatus.enum'
import React from 'react'
import ListOrderItems from '../list/ListOrderItems'

interface OrderDetailInfoProps {
  orderId: string
  storeId?: string | null
  by?: 'user' | 'store' | 'admin'
  isEditable?: boolean
}

const { Title, Text } = Typography

const OrderDetailInfo: React.FC<OrderDetailInfoProps> = ({
  orderId,
  storeId,
  by = 'user',
  isEditable = false
}) => {
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
      if (by === 'store' && storeId)
        return await getOrderByStore(orderId, storeId)
      if (by === 'admin') return await getOrderForAdmin(orderId)
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
    <div className='space-y-4'>
      {(isOrderLoading || isItemsLoading) && (
        <Spin className='w-full flex justify-center my-8' />
      )}
      {orderError ? (
        <Alert
          type='error'
          message={orderError.message}
          showIcon
          className='mb-4'
        />
      ) : itemsError ? (
        <Alert
          type='error'
          message={itemsError.message}
          showIcon
          className='mb-4'
        />
      ) : (
        <>
          <div className='flex items-center gap-2 mb-2'>
            <Title level={4} className='!mb-0'>
              {t('orderDetail.id')} #{order._id}
            </Title>
            <Button
              size='small'
              onClick={handleReload}
              icon={<i className='fa-light fa-arrow-rotate-left' />}
            />
          </div>
          <Descriptions bordered column={1} size='small'>
            <Descriptions.Item label={t('orderDetail.date')}>
              {humanReadableDate(order.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label={t('orderDetail.store')}>
              {order.storeId?.name}
            </Descriptions.Item>
            <Descriptions.Item label={t('orderDetail.senderAddress')}>
              <div>{order.storeId?.name}</div>
              <div>{order.storeId?.address}</div>
            </Descriptions.Item>
            <Descriptions.Item label={t('orderDetail.userReceiver')}>
              <div>
                {order.firstName} {order.lastName}
              </div>
              <div>{order.phone}</div>
              <div>{order.address}</div>
            </Descriptions.Item>
            <Descriptions.Item label={t('orderDetail.ship_payment')}>
              <div>{t('orderDetail.deliveryUnit')}: Giao hàng nhanh</div>
              <div>
                {t('orderDetail.paymentMethod')}:{' '}
                {order.isPaidBefore
                  ? t('orderDetail.onlinePayment')
                  : t('orderDetail.cod')}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label={t('orderDetail.status')}>
              <span className='capitalize'>{order.status}</span>
              <span className='ml-2 text-xs text-gray-400'>
                {t('orderDetail.lastUpdateTime')}{' '}
                {humanReadableDate(order.updatedAt)}
              </span>
            </Descriptions.Item>
            {order.status === 'Returned' && (
              <Descriptions.Item label={t('orderDetail.returnReason')}>
                <Text type='danger'>{order.returnRequests?.reason}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>

          <Divider orientation='left'>{t('orderDetail.listProducts')}</Divider>
          {/* ListOrderItems có thể refactor thành table antd nếu muốn */}
          <ListOrderItems
            orderId={orderId}
            storeId={storeId as string}
            by={by}
            status={order.status}
          />

          {by === 'user' && getToken().role === 'user' && (
            <div className='bg-gray-50 rounded p-3'>
              <div className='flex justify-between border-b py-2'>
                <span>{t('cartDetail.subTotal')}</span>
                <span>
                  {formatPrice(totalOrderSalePrice)}
                  <sup>₫</sup>
                </span>
              </div>
              {saleFromPlatform !== 0 && (
                <div className='flex justify-between border-b py-2'>
                  <span>{t('cartDetail.BuynowVoucherApplied')}</span>
                  <span>
                    -{formatPrice(saleFromPlatform)}
                    <sup>₫</sup>
                  </span>
                </div>
              )}
              <div className='flex justify-between border-b py-2'>
                <span>{t('cartDetail.shippingFee')}</span>
                <span>
                  {formatPrice(order.shippingFee?.$numberDecimal)}
                  <sup>₫</sup>
                </span>
              </div>
              <div className='flex justify-between py-2'>
                <span className='font-bold text-primary'>
                  {t('cartDetail.total')}:
                </span>
                <span className='font-bold text-primary'>
                  {formatPrice(order.amountFromUser?.$numberDecimal)} ₫
                </span>
              </div>
            </div>
          )}

          {/* Return order button & modal */}
          {by === 'user' &&
            order.status === OrderStatus.DELIVERED &&
            calcTime(order.updatedAt) < 360 && (
              <div className='mt-4'>
                <Button
                  type='dashed'
                  disabled={
                    order.returnRequests &&
                    order.returnRequests.status !== ReturnStatus.REJECTED
                  }
                  onClick={() => {
                    // open return modal logic here
                  }}
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
                </Button>
                {/* <ReturnOrderForm ... /> */}
              </div>
            )}
        </>
      )}
    </div>
  )
}

export default OrderDetailInfo
