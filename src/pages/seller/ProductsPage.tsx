import { useSelector } from 'react-redux'
import SellerLayout from '../../components/layout/SellerLayout'
import StoreProductsTable from '../../components/table/StoreProductsTable'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { selectAccountUser } from '../../store/slices/accountSlice'
import { selectSellerStore } from '../../store/slices/sellerSlice'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import SellerProductForm from '../../components/item/form/SellerProductForm'

const ProductsPage = () => {
  const { t } = useTranslation()
  const user = useSelector(selectAccountUser)
  const store = useSelector(selectSellerStore)
  const paths = [
    { name: t('breadcrumbs.home'), url: `/seller/${store._id}` },
    {
      name: t('breadcrumbs.listProduct'),
      url: `/seller/products/${store._id}`
    }
  ]
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [run, setRun] = useState(false)

  return (
    <SellerLayout user={user as any} store={store as any} paths={paths}>
      <div className='flex align-items-start justify-content-between mb-3'>
        <h4>Danh sách sản phẩm</h4>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => setDrawerOpen(true)}
        >
          {t('productDetail.createProduct')}
        </Button>
      </div>

      <StoreProductsTable storeId={store._id} run={run} />
      <SellerProductForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        storeId={store._id}
        onSuccess={() => {
          setDrawerOpen(false)
          setRun((prev) => !prev)
        }}
      />
    </SellerLayout>
  )
}

export default ProductsPage
