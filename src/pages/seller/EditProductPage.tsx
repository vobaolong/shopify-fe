import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import SellerLayout from '../../components/layout/SellerLayout'
import SellerEditProductForm from '../../components/item/form/SellerEditProductForm'
import { useTranslation } from 'react-i18next'
import { selectAccountUser } from '../../store/slices/accountSlice'
import { selectSellerStore } from '../../store/slices/sellerSlice'

const EditProductPage = () => {
  const user = useSelector(selectAccountUser)
  const store = useSelector(selectSellerStore)
  const { productId } = useParams()
  const { t } = useTranslation()

  const paths = [
    { name: t('breadcrumbs.home'), url: `/seller/${store._id}` },
    {
      name: t('breadcrumbs.listProduct'),
      url: `/seller/products/${store._id}`
    },
    {
      name: t('breadcrumbs.updateProduct'),
      url: `/seller/products/edit/${productId}/${store._id}`
    }
  ]
  return (
    <SellerLayout user={user as any} store={store as any} paths={paths}>
      <SellerEditProductForm storeId={store._id} productId={productId} />
    </SellerLayout>
  )
}

export default EditProductPage
