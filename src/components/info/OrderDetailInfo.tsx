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
import { calcTime } from '../../helper/calcTime'
import { useQuery } from '@tanstack/react-query'
import { OrderStatus, ReturnStatus, Role } from '../../enums/OrderStatus.enum'
import React from 'react'
import ListOrderItems from '../list/ListOrderItems'

interface OrderDetailInfoProps {
  orderId: string
  storeId?: string | null
  by?: Role.USER | Role.STORE | Role.ADMIN
  isEditable?: boolean
}

const { Title, Text } = Typography

const OrderDetailInfo: React.FC<OrderDetailInfoProps> = ({
  orderId,
  storeId,
  by = Role.USER,
  isEditable = false
}) => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const { level: userLevel } = useSelector((state: any) => state.account.user)

  const {
    data: orderData,
    isLoading: isOrderLoading,
    error: orderError,
    refetch: refetchOrder
  } = useQuery({
    queryKey: ['order', by, orderId, storeId, _id],
    queryFn: async () => {
      if (by === Role.STORE && storeId)
        return await getOrderByStore(orderId, storeId)
      if (by === Role.ADMIN) return await getOrderForAdmin(orderId)
      return await getOrderByUser(_id, orderId)
    },
    enabled: !!orderId && !!_id
  })

  const {
    data: itemsData,
    isLoading: isItemsLoading,
    error: itemsError,
    refetch: refetchItems
  } = useQuery({
    queryKey: ['orderItems', orderId, _id, storeId || '', by],
    queryFn: async () => {
      try {
        const response = await listItemsByOrder(_id, orderId)
        return response?.items || []
      } catch (error: any) {
        return []
      }
    },
    enabled: by === Role.USER && !!orderId && !!_id,
    retry: 1
  })

  const order = orderData?.order || {}
  const items = by === Role.USER ? itemsData || [] : []

  const totalOrderSalePrice = items.reduce((total: number, item: any) => {
    if (item?.productId?.salePrice) {
      const salePrice = parseFloat(item.productId.salePrice.$numberDecimal) || 0
      const count = item.count || 0
      return total + salePrice * count
    }
    return total
  }, 0)

  const saleFromPlatform =
    totalOrderSalePrice - totalProducts(items, userLevel).amountFromUser1

  const handleReload = () => {
    refetchOrder()
    if (by === Role.USER) refetchItems()
  }

  if (isOrderLoading || (by === Role.USER && isItemsLoading)) {
    return (
      <div className='mt-3 flex justify-center items-center min-h-[120px]'>
        <Spin size='large' />
      </div>
    )
  }

  if (orderError || itemsError) {
    return (
      <div className='mt-3'>
        <Alert
          type='error'
          message={orderError?.message || itemsError?.message}
          showIcon
          className='mb-4'
        />
      </div>
    )
  }

  return (
    <div className='mt-3'>
      <div className='flex items-center gap-2 mb-2'>
        <Title level={4} className='!mb-0'>
          {t('orderDetail.id')} #{order._id?.slice(-8).toUpperCase()}
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
            {order.userName} {order.name}
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
      {by === Role.USER ? (
        <ListOrderItems
          orderId={orderId}
          storeId={storeId as string}
          by={by}
          status={order.status}
          items={items}
          isLoading={isItemsLoading}
        />
      ) : (
        <ListOrderItems
          orderId={orderId}
          storeId={storeId as string}
          by={by}
          status={order.status}
        />
      )}

      {by === Role.USER && getToken().role === Role.USER && (
        <div className='bg-gray-50 rounded p-3 mt-4'>
          <div className='flex justify-between border-b py-2'>
            <span>{t('cartDetail.subTotal')}</span>
            <span>
              {formatPrice(totalOrderSalePrice)}
              <sup>₫</sup>
            </span>
          </div>
          {saleFromPlatform !== 0 && (
            <div className='flex justify-between border-b py-2'>
              <span>{t('cartDetail.ShopBaseVoucherApplied')}</span>
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

      {by === Role.USER &&
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
                if (order.returnRequests) return
                return
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
          </div>
        )}
    </div>
  )
}

export default OrderDetailInfo
