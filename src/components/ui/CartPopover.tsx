import React from 'react'
import {
  Popover,
  Badge,
  Button,
  Empty,
  Image,
  Divider,
  Spin,
  message
} from 'antd'
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listCarts, updateCartItem, deleteFromCart } from '../../apis/cart.api'
import { useCurrencyFormat } from '../../hooks/useCurrencyFormat'
import { useAntdApp } from '../../hooks/useAntdApp'

interface CartPopoverProps {
  userId: string
  cartCount: number
  className?: string
}

interface CartItem {
  _id: string
  productId: {
    _id: string
    name: string
    images: string[]
    price: number
  }
  variantValueId?: {
    _id: string
    name: string
  }
  count: number
  total: number
}

const CartPopover: React.FC<CartPopoverProps> = ({
  userId,
  cartCount,
  className = ''
}) => {
  const { t } = useTranslation()
  const { formatPrice } = useCurrencyFormat()
  const queryClient = useQueryClient()
  const { message } = useAntdApp()
  const {
    data: cartData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => listCarts(userId, {}),
    enabled: !!userId,
    refetchOnWindowFocus: false
  })

  const updateCartMutation = useMutation({
    mutationFn: ({
      count,
      cartItemId
    }: {
      count: number
      cartItemId: string
    }) => updateCartItem(userId, count, cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] })
      message.success(t('cartUpdated'))
    },
    onError: () => {
      message.error(t('updateCartFailed'))
    }
  })

  const deleteCartMutation = useMutation({
    mutationFn: (cartItemId: string) => deleteFromCart(userId, cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] })
      message.success(t('itemRemoved'))
    },
    onError: () => {
      message.error(t('removeItemFailed'))
    }
  })

  const cartItems: CartItem[] = cartData?.cartItems || []
  const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0)

  // Handle quantity changes
  const handleUpdateQuantity = (cartItemId: string, newCount: number) => {
    if (newCount < 1) return
    updateCartMutation.mutate({ count: newCount, cartItemId })
  }

  // Handle item removal
  const handleRemoveItem = (cartItemId: string) => {
    deleteCartMutation.mutate(cartItemId)
  }

  const cartPopoverContent = (
    <div className='w-80 max-w-sm'>
      <div className='flex items-center justify-between mb-3'>
        <h4 className='font-semibold text-gray-800'>{t('cart')}</h4>
        <span className='text-sm text-gray-500'>
          ({cartCount} {cartCount === 1 ? t('product') : t('products')})
        </span>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Spin size='default' />
        </div>
      ) : error ? (
        <div className='text-center py-4 text-red-500'>
          {t('errorLoadingCart')}
        </div>
      ) : (
        <div className='max-h-64 overflow-y-auto'>
          {cartItems.length === 0 ? (
            <Empty
              description={t('cartEmpty')}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className='py-4'
            />
          ) : (
            <div className='space-y-3'>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className='flex items-center gap-3 p-2 hover:bg-gray-50 rounded'
                >
                  <Image
                    src={item.productId.images?.[0] || '/default-product.jpg'}
                    alt={item.productId.name}
                    width={50}
                    height={50}
                    className='rounded object-cover'
                    preview={false}
                    fallback='/default-product.jpg'
                  />
                  <div className='flex-1'>
                    <h5 className='text-sm font-medium text-gray-900 truncate'>
                      {item.productId.name}
                    </h5>
                    {item.variantValueId && (
                      <p className='text-xs text-gray-500'>
                        {item.variantValueId.name}
                      </p>
                    )}{' '}
                    <div className='flex items-center justify-between mt-1'>
                      <div className='flex items-center gap-1'>
                        <Button
                          type='text'
                          size='small'
                          icon={<MinusOutlined />}
                          className='w-5 h-5 p-0 text-xs'
                          disabled={
                            item.count <= 1 || updateCartMutation.isPending
                          }
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.count - 1)
                          }
                        />
                        <span className='text-xs px-2'>{item.count}</span>
                        <Button
                          type='text'
                          size='small'
                          icon={<PlusOutlined />}
                          className='w-5 h-5 p-0 text-xs'
                          disabled={updateCartMutation.isPending}
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.count + 1)
                          }
                        />
                      </div>
                      <span className='text-sm font-semibold text-blue-600'>
                        {formatPrice(item.total)}
                      </span>
                    </div>
                  </div>{' '}
                  <Button
                    type='text'
                    size='small'
                    icon={<DeleteOutlined />}
                    className='text-red-500 hover:text-red-700'
                    disabled={deleteCartMutation.isPending}
                    onClick={() => handleRemoveItem(item._id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {cartItems.length > 0 && !isLoading && (
        <>
          <Divider className='my-3' />
          <div className='flex items-center justify-between mb-3'>
            <span className='font-semibold text-gray-800'>{t('total')}:</span>
            <span className='font-bold text-lg text-blue-600'>
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className='flex gap-2'>
            <Link to='/cart' className='flex-1'>
              <Button type='default' className='w-full'>
                {t('viewCart')}
              </Button>
            </Link>
            <Link to='/checkout' className='flex-1'>
              <Button type='primary' className='w-full'>
                {t('checkout')}
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )

  return (
    <Popover
      content={cartPopoverContent}
      title={null}
      trigger='hover'
      placement='bottomRight'
      arrow={false}
    >
      <Link to='/cart'>
        <Badge count={cartCount > 99 ? '99+' : cartCount} size='small'>
          <Button
            type='text'
            icon={<ShoppingCartOutlined />}
            className={`text-white hover:bg-white hover:text-blue-600 ${className}`}
          />
        </Badge>
      </Link>
    </Popover>
  )
}

export default CartPopover
