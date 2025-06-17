import { useState, useEffect } from 'react'
import { Button, Alert, Spin, Card, Typography } from 'antd'
import { ShoppingCartOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { addToCart } from '../../../apis/cart.api'
import VariantValueSelector from '../../selector/VariantValueSelector'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useAntdApp } from '../../../hooks/useAntdApp'

const { Text } = Typography

interface VariantValue {
  _id: string
  name: string
  variantId: { _id: string; name: string }
}

interface Product {
  _id: string
  storeId: { _id: string }
  variantValueIds?: VariantValue[]
}

interface CartItem {
  storeId?: string
  productId?: string
  variantValueIds?: string
  defaultVariantValues?: VariantValue[]
  count?: number
}

const AddToCartForm: React.FC<{ product: Product }> = ({ product }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [updateDispatch] = useUpdateDispatch()
  const [cartItem, setCartItem] = useState<CartItem>({})
  const { message } = useAntdApp()

  const addToCartMutation = useMutation({
    mutationFn: (cartData: CartItem) => {
      const { _id } = getToken()
      return addToCart(_id, cartData)
    },
    onSuccess: (data: any) => {
      if (data.error) {
        message.error(data.error)
      } else {
        updateDispatch('account', data.user)
        message.success(t('toastSuccess.cart.add'))
        queryClient.invalidateQueries({ queryKey: ['cart'] })
        setCartItem({})
      }
    },
    onError: (error: any) => {
      message.error(error.message)
    }
  })

  const buyNowMutation = useMutation({
    mutationFn: (cartData: CartItem) => {
      const { _id } = getToken()
      return addToCart(_id, cartData)
    },
    onSuccess: (data: any) => {
      if (data.error) {
        message.error(data.error)
      } else {
        updateDispatch('account', data.user)
        queryClient.invalidateQueries({ queryKey: ['cart'] })
        navigate('/cart')
      }
    },
    onError: (error: any) => {
      message.error(error.message)
    }
  })
  useEffect(() => {
    let defaultList: VariantValue[][] = []
    product.variantValueIds?.forEach((value: VariantValue) => {
      let flag = true
      defaultList.forEach((list: VariantValue[]) => {
        if (value.variantId._id === list[0].variantId._id) {
          list.push(value)
          flag = false
        }
        list.sort((a: VariantValue, b: VariantValue) => {
          const nameA = a.name.toUpperCase()
          const nameB = b.name.toUpperCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
      })
      if (flag) defaultList.push([value])
    })
    const defaultVariantValues = defaultList.map((list) => list[0])
    const defaultVariantValueIds = defaultVariantValues
      .map((value) => value._id)
      .join('|')
    setCartItem({
      storeId: product.storeId && product.storeId._id,
      productId: product._id,
      variantValueIds: defaultVariantValueIds,
      defaultVariantValues: defaultVariantValues,
      count: 1
    })
  }, [product])
  const handleSet = (values: VariantValue[]) => {
    setCartItem({
      ...cartItem,
      variantValueIds: values.map((value) => value._id).join('|')
    })
  }
  const handleAddToCart = () => {
    addToCartMutation.mutate({
      ...cartItem,
      count: 1
    })
  }

  const handleBuyNow = () => {
    buyNowMutation.mutate({
      ...cartItem,
      count: 1
    })
  }

  const isLoading = addToCartMutation.isPending || buyNowMutation.isPending

  return (
    <Spin spinning={isLoading}>
      <div className='space-y-4'>
        {product.variantValueIds && product.variantValueIds.length > 0 && (
          <div>
            <Text strong className='block mb-2 text-gray-700'>
              {t('productDetail.selectVariant')}
            </Text>
            <VariantValueSelector
              listValues={product.variantValueIds}
              isEditable={true}
              defaultValue={cartItem.defaultVariantValues}
              onSet={(values: VariantValue[]) => handleSet(values)}
            />
          </div>
        )}
        <div className='flex gap-3'>
          <Button
            type='primary'
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            loading={addToCartMutation.isPending}
            disabled={isLoading}
            className='flex-1 font-medium text-base'
          >
            {t('productDetail.addToCart')}
          </Button>
          <Button
            type='primary'
            danger
            icon={<ThunderboltOutlined />}
            onClick={handleBuyNow}
            loading={buyNowMutation.isPending}
            disabled={isLoading}
            className='flex-1 font-medium text-base'
          >
            {t('productDetail.buyNow')}
          </Button>
        </div>
      </div>
    </Spin>
  )
}

export default AddToCartForm
