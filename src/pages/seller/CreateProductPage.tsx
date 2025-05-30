import { useSelector } from 'react-redux'
import SellerLayout from '../../components/layout/SellerLayout'
import SellerCreateProductForm from '../../components/item/form/SellerCreateProductForm'
import { useTranslation } from 'react-i18next'
import { selectAccountUser } from '../../store/slices/accountSlice'
import { selectSellerStore } from '../../store/slices/sellerSlice'

const CreateProductPage = () => {
  const user = useSelector(selectAccountUser)
  const store = useSelector(selectSellerStore)
  const { t } = useTranslation()

  const paths = [
    { name: t('breadcrumbs.home'), url: `/seller/${store._id}` },
    {
      name: t('breadcrumbs.listProduct'),
      url: `/seller/products/${store._id}`
    },
    {
      name: t('breadcrumbs.addProduct'),
      url: `/seller/products/addNew/${store._id}`
    }
  ]
  return (
    <SellerLayout user={user} store={store} paths={paths}>
      <SellerCreateProductForm storeId={store._id} />
    </SellerLayout>
  )
}

export default CreateProductPage
