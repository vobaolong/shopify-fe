/* eslint-disable react-hooks/exhaustive-deps */
import { getToken } from '../../../apis/auth.api'
import { getProductByIdForManager } from '../../../apis/product.api'
import { Spin, Alert } from 'antd'
import SellerEditProductProfileForm from './SellerEditProductProfileForm'
import SellerEditProductImagesForm from './SellerEditProductImagesForm'
import { useQuery } from '@tanstack/react-query'

interface SellerEditProductFormProps {
  storeId?: string
  productId?: string
}

const SellerEditProductForm = ({
  storeId = '',
  productId = ''
}: SellerEditProductFormProps) => {
  const { _id } = getToken()
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['product', productId, storeId],
    queryFn: async () => {
      const res = await getProductByIdForManager(_id, productId, storeId)
      return res.data
    },
    enabled: !!productId && !!storeId
  })
  const product = data?.product || {}
  const errorMsg = error
    ? (error as any).message || 'Server Error'
    : data?.error || ''
  return (
    <div className='container-fluid position-relative'>
      {isLoading && <Spin size='large' />}
      {errorMsg && <Alert message={errorMsg} type='error' />}
      <div className='row bg-body box-shadow rounded-2 p-3 mb-3'>
        <SellerEditProductImagesForm
          product={product}
          storeId={storeId}
          onRun={() => refetch()}
        />
      </div>
      <div className='row mb-3'>
        <SellerEditProductProfileForm
          product={product}
          storeId={storeId}
          onRun={() => refetch()}
        />
      </div>
    </div>
  )
}

export default SellerEditProductForm
