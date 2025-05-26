import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { addToCart } from '../../../apis/cart.api'
import Loading from '../../ui/Loading'
import VariantValueSelector from '../../selector/VariantValueSelector'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Error from '../../ui/Error'

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
  const [isLoading, setIsLoading] = useState(false)
  const [updateDispatch] = useUpdateDispatch()
  const [error, setError] = useState('')
  const [cartItem, setCartItem] = useState<CartItem>({})

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
    onSubmit()
  }
  const onSubmit = () => {
    const { _id } = getToken()
    setError('')
    setIsLoading(true)
    addToCart(_id, cartItem)
      .then((data: any) => {
        if (data.error) {
          setError(data.error)
        } else {
          updateDispatch('account', data.user)
          toast.success(t('toastSuccess.cart.add'))
        }
        setTimeout(() => {
          setError('')
        }, 3000)
        setTimeout(() => {
          setCartItem({})
        }, 1000)
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setTimeout(() => {
          setError('')
        }, 3000)
        setIsLoading(false)
      })
  }

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      <form className='row'>
        <div className='col-12'>
          <VariantValueSelector
            listValues={product.variantValueIds}
            isEditable={true}
            defaultValue={cartItem.defaultVariantValues}
            onSet={(values: VariantValue[]) => handleSet(values)}
          />
        </div>
        {error && (
          <div className='col-12'>
            <Error msg={error} />
          </div>
        )}
        <div
          className='col-md-12 d-grid mt-2'
          style={{ maxWidth: 'fit-content' }}
        >
          <button
            type='submit'
            className='btn add-to-cart-btn rounded-1 ripple d-flex align-items-center justify-content-center'
            onClick={handleSubmit}
          >
            <i className='fa-solid fa-cart-plus'></i>
            <span className='ms-2 fs-6'>{t('productDetail.addToCart')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddToCartForm
