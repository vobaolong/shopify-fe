import { useEffect } from 'react'
import { getToken } from '../../../apis/auth'
import { updateProduct } from '../../../apis/product'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from '@tanstack/react-query'
import { notification, Form, Input, Button } from 'antd'
import Loading from '../../ui/Loading'
import CategorySelector from '../../selector/CategorySelector'
import VariantSelector from '../../selector/VariantSelector'
import DropDownMenu from '../../ui/DropDownMenu'
import TextArea from '../../ui/TextArea'
import { listBrandByCategory } from '../../../apis/brand'
import { useNavigate } from 'react-router-dom'

interface SellerEditProductProfileFormProps {
  product?: any
  storeId?: string
  onRun?: () => void
}

interface BrandItem {
  value: string
  label: string
}

interface FormValues {
  name: string
  description: string
  quantity: number
  price: string
  salePrice: string
  categoryId: string
  brandId: string
  variantValueIds?: string
}

const SellerEditProductProfileForm = ({
  product = {},
  storeId = '',
  onRun
}: SellerEditProductProfileFormProps) => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const [form] = Form.useForm<FormValues>()
  const navigate = useNavigate()

  // Brand list by category
  const categoryId = Form.useWatch('categoryId', form)
  const { data: brandsData } = useQuery({
    queryKey: ['brands', categoryId],
    queryFn: async () => {
      if (!categoryId) return []
      const res = await listBrandByCategory(categoryId)
      const data = res.data
      if (data.error) {
        notification.error({ message: data.error })
        return []
      }
      return (data.brands || []).map((brand: any) => ({
        value: brand._id,
        label: brand.name
      })) as BrandItem[]
    },
    enabled: !!categoryId
  })
  const brands: BrandItem[] = brandsData || []

  // Mutation for update product
  const updateProductMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const formData = new FormData()
      formData.set('name', values.name)
      formData.set('description', values.description)
      formData.set('quantity', values.quantity.toString())
      formData.set('price', values.price)
      formData.set('salePrice', values.salePrice)
      formData.set('categoryId', values.categoryId)
      formData.set('brandId', values.brandId)
      if (values.variantValueIds)
        formData.set('variantValueIds', values.variantValueIds)
      return updateProduct(_id, formData, product._id, storeId)
    },
    onSuccess: (res) => {
      if (res.data.error) notification.error({ message: res.data.error })
      else {
        notification.success({ message: t('toastSuccess.product.edit') })
        if (onRun) onRun()
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  useEffect(() => {
    if (product && product._id) {
      form.setFieldsValue({
        name: product.name || '',
        description: product.description || '',
        quantity: product.quantity || 0,
        price: product.price?.$numberDecimal || '',
        salePrice: product.salePrice?.$numberDecimal || '',
        categoryId: product.categoryId?._id || '',
        brandId: product.brandId?._id || '',
        variantValueIds: (product.variantValueIds || [])
          .map((v: any) => v._id)
          .join('|')
      })
    }
    // eslint-disable-next-line
  }, [product])

  const handleFinish = (values: FormValues) => {
    if (parseFloat(values.salePrice) > parseFloat(values.price)) {
      notification.error({
        message: t('productValid.salePriceCannotBeGreaterThan')
      })
      return
    }
    updateProductMutation.mutate(values)
  }

  return (
    <div className='position-relative'>
      {updateProductMutation.isPending && <Loading />}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{
          name: '',
          description: '',
          quantity: 0,
          price: '',
          salePrice: '',
          categoryId: '',
          brandId: '',
          variantValueIds: ''
        }}
        className='mb-2'
      >
        <div className='bg-body box-shadow rounded-2 p-3 row'>
          <div className='col-12'>
            <h5 className='fw-bold'>{t('productDetail.editProInfo')}</h5>
          </div>
          <div className='col-12'>
            <Form.Item
              name='name'
              label={t('productDetail.name')}
              rules={[{ required: true, message: t('productValid.validName') }]}
            >
              <Input placeholder={t('productDetail.name')} />
            </Form.Item>
          </div>
          <div className='col-12 mt-3'>
            <Form.Item
              name='categoryId'
              label={t('productDetail.chooseCategory')}
              rules={[
                { required: true, message: t('productValid.chooseCategory') }
              ]}
            >
              <CategorySelector
                label={t('productDetail.selectedCategory')}
                isActive={true}
                isRequired={true}
                onSet={(category: any) => {
                  form.setFieldsValue({ categoryId: category._id })
                }}
              />
            </Form.Item>
          </div>
          <div className='col-12 mt-3'>
            <Form.Item name='brandId' label={t('productDetail.chooseBrand')}>
              <DropDownMenu
                listItem={brands}
                value={form.getFieldValue('brandId')}
                setValue={(brandId: string) => form.setFieldsValue({ brandId })}
                label={t('productDetail.chooseBrand')}
                size='lg'
              />
            </Form.Item>
          </div>
          <div className='col-12 mt-3'>
            <Form.Item
              name='description'
              label={t('productDetail.description')}
              rules={[
                { required: true, message: t('productValid.validDescription') }
              ]}
            >
              <TextArea placeholder={t('productDetail.description')} />
            </Form.Item>
          </div>
          <div className='col-md-6 col-sm-12 mt-3'>
            <Form.Item
              name='price'
              label={`${t('productDetail.price')} (₫)`}
              rules={[
                { required: true, message: t('productValid.priceValid') }
              ]}
            >
              <Input type='number' />
            </Form.Item>
          </div>
          <div className='col-md-6 col-sm-12 mt-3'>
            <Form.Item
              name='salePrice'
              label={`${t('productDetail.salePrice')} (₫)`}
              rules={[
                { required: true, message: t('productValid.salePriceValid') }
              ]}
            >
              <Input type='number' />
            </Form.Item>
          </div>
          <div className='col-12 mt-3'>
            <Form.Item
              name='quantity'
              label={t('productDetail.quantity')}
              rules={[
                { required: true, message: t('productValid.quantityValid') }
              ]}
            >
              <Input type='number' />
            </Form.Item>
          </div>
          <div className='col-12 mt-3 px-4'>
            <span className='px-2'>
              {t('productDetail.chooseStyles')}{' '}
              <small className='text-muted'>
                {t('productDetail.chooseCateFirst')}
              </small>
            </span>
            <Form.Item name='variantValueIds'>
              <VariantSelector
                categoryId={form.getFieldValue('categoryId')}
                onSet={(variantValues: any[]) => {
                  form.setFieldsValue({
                    variantValueIds: (
                      variantValues.map((v) => v._id) as string[]
                    ).join('|')
                  })
                }}
              />
            </Form.Item>
          </div>
        </div>
        <div
          className={`bg-body ${false ? 'shadow' : 'box-shadow'} rounded-1 row px-4 my-3 p-3`}
          style={{ position: 'sticky', bottom: '0' }}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <Button
              type='default'
              className='text-decoration-none cus-link-hover'
              onClick={() => navigate(`/seller/products/${storeId}`)}
              style={{ maxWidth: '200px', width: '100%' }}
            >
              <i className='fa-solid fa-angle-left'></i> {t('button.back')}
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              className='btn btn-primary ripple res-w-100-md rounded-1'
              style={{ maxWidth: '200px', width: '100%' }}
              loading={updateProductMutation.isPending}
            >
              {t('button.save')}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default SellerEditProductProfileForm
