import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { addToCart } from '../../../apis/cart.api'
import VariantValueSelector from '../../selector/VariantValueSelector'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button, Alert, Spin } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'

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
  const [updateDispatch] = useUpdateDispatch()
  const [error, setError] = useState('')
  const [cartItem, setCartItem] = useState<CartItem>({})

  const addToCartMutation = useMutation({
    mutationFn: (cartData: CartItem) => {
      const { _id } = getToken()
      return addToCart(_id, cartData)
    },
    onSuccess: (data: any) => {
      if (data.error) {
        setError(data.error)
        setTimeout(() => setError(''), 3000)
      } else {
        updateDispatch('account', data.user)
        toast.success(t('toastSuccess.cart.add'))
        setCartItem({})
      }
    },
    onError: () => {
      setError('Server Error')
      setTimeout(() => setError(''), 3000)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    addToCartMutation.mutate(cartItem)
  }
  return (
    <div className='relative'>
      <Spin spinning={addToCartMutation.isPending}>
        <form className='space-y-4'>
          <div>
            <VariantValueSelector
              listValues={product.variantValueIds}
              isEditable={true}
              defaultValue={cartItem.defaultVariantValues}
              onSet={(values: VariantValue[]) => handleSet(values)}
            />
          </div>

          {error && (
            <Alert message={error} type='error' showIcon className='mb-4' />
          )}

          <div className='flex justify-start'>
            <Button
              type='primary'
              icon={<ShoppingCartOutlined />}
              onClick={handleSubmit}
              loading={addToCartMutation.isPending}
              className='flex items-center gap-2 h-10 px-6 bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600'
            >
              <span className='text-base'>{t('productDetail.addToCart')}</span>
            </Button>
          </div>
        </form>
      </Spin>
    </div>
  )
}

export default AddToCartForm
