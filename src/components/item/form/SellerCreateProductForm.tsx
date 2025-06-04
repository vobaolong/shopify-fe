import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { createProduct } from '../../../apis/product.api'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation } from '@tanstack/react-query'
import { notification, Form, Input, Button, Collapse, Spin } from 'antd'
import CategorySelector from '../../selector/CategorySelector'
import VariantSelector from '../../selector/VariantSelector'
import DropDownMenu from '../../ui/DropDownMenu'
import InputFile from '../../ui/InputFile'
import TextArea from '../../ui/TextArea'
import { listBrandByCategory } from '../../../apis/brand.api'

interface SellerCreateProductFormProps {
  storeId?: string
}

interface FormValues {
  name: string
  categoryId: string
  brandId?: string
  image0: string | File
  image1?: string | File
  image2?: string | File
  image3?: string | File
  image4?: string | File
  image5?: string | File
  image6?: string | File
  description: string
  quantity: number
  price: number
  salePrice: number
  variantValueIds?: string
}

interface DropDownItem {
  value: string
  label: string
  icon?: React.ReactNode
}

const SellerCreateProductForm: React.FC<SellerCreateProductFormProps> = ({
  storeId = ''
}) => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const [form] = Form.useForm<FormValues>()

  // Brand list by category
  const categoryId = Form.useWatch('categoryId', form)
  const { data: brandsData, isLoading: isBrandsLoading } = useQuery({
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
      })) as DropDownItem[]
    },
    enabled: !!categoryId
  })
  const brands: DropDownItem[] = brandsData || []

  const createProductMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const formData = new FormData()
      formData.set('name', values.name)
      formData.set('description', values.description)
      formData.set('quantity', values.quantity.toString())
      formData.set('price', values.price.toString())
      formData.set('salePrice', values.salePrice.toString())
      formData.set('image0', values.image0)
      formData.set('categoryId', values.categoryId)
      if (values.brandId) formData.set('brandId', values.brandId)
      if (values.variantValueIds)
        formData.set('variantValueIds', values.variantValueIds)
      if (values.image1) formData.set('image1', values.image1)
      if (values.image2) formData.set('image2', values.image2)
      if (values.image3) formData.set('image3', values.image3)
      if (values.image4) formData.set('image4', values.image4)
      if (values.image5) formData.set('image5', values.image5)
      if (values.image6) formData.set('image6', values.image6)
      return createProduct(_id, formData, storeId)
    },
    onSuccess: (res) => {
      if (res.data.error) notification.error({ message: res.data.error })
      else {
        notification.success({ message: t('toastSuccess.product.create') })
        window.scrollTo({ top: 0, behavior: 'smooth' })
        form.resetFields()
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  useEffect(() => {
    const checkScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight
    }
    window.addEventListener('scroll', checkScroll)
    return () => {
      window.removeEventListener('scroll', checkScroll)
    }
  }, [])
  // Form submit
  const handleFinish = (values: FormValues) => {
    if (values.salePrice > values.price) {
      notification.error({
        message: t('productValid.salePriceCannotBeGreaterThan')
      })
      return
    }
    createProductMutation.mutate(values)
  }
  return (
    <div className='w-full'>
      <Spin spinning={createProductMutation.isPending}>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleFinish}
          initialValues={{
            name: '',
            categoryId: '',
            brandId: '',
            image0: '',
            image1: '',
            image2: '',
            image3: '',
            image4: '',
            image5: '',
            image6: '',
            description: '',
            quantity: 0,
            price: 0,
            salePrice: 0,
            variantValueIds: ''
          }}
        >
          <Collapse defaultActiveKey={['1', '2']} ghost>
            <Collapse.Panel
              header={<span>1. {t('productDetail.basicInfo')}</span>}
              key='1'
            >
              <div className='p-3'>
                <Form.Item
                  name='name'
                  label={t('productDetail.name')}
                  rules={[
                    { required: true, message: t('productValid.validName') }
                  ]}
                >
                  <Input placeholder={t('productDetail.name')} />
                </Form.Item>
                <div className='mt-3'>
                  <Form.Item
                    name='categoryId'
                    label={t('productDetail.chooseCategory')}
                    rules={[
                      {
                        required: true,
                        message: t('productValid.chooseCategory')
                      }
                    ]}
                  >
                    <CategorySelector
                      label={t('productDetail.selectedCategory')}
                      isActive={true}
                      isRequired={true}
                      onChange={(category: any) => {
                        form.setFieldsValue({ categoryId: category._id })
                      }}
                    />
                  </Form.Item>
                </div>
                <div className='mt-3'>
                  <Form.Item
                    name='brandId'
                    label={t('productDetail.chooseBrand')}
                  >
                    <DropDownMenu
                      listItem={brands}
                      value={form.getFieldValue('brandId')}
                      setValue={(brandId: string) =>
                        form.setFieldsValue({ brandId })
                      }
                      label={t('productDetail.chooseBrand')}
                      size='lg'
                    />
                  </Form.Item>
                </div>{' '}
                <div className='mt-3'>
                  <p>{t('productDetail.productImg')}</p>
                  <div className='flex flex-wrap gap-4 items-center'>
                    <Form.Item
                      name='image0'
                      label={t('productDetail.thumbImg')}
                      rules={[
                        {
                          required: true,
                          message: t('productValid.avatarValid')
                        }
                      ]}
                    >
                      <InputFile
                        label={t('productDetail.thumbImg')}
                        size='avatar'
                        required={true}
                        noRadius={false}
                        onChange={(value) =>
                          form.setFieldsValue({ image0: value })
                        }
                      />
                    </Form.Item>
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                      <Form.Item
                        key={idx}
                        name={`image${idx}`}
                        label={t(`productDetail.img${idx}`)}
                      >
                        <InputFile
                          label={t(`productDetail.img${idx}`)}
                          size='avatar'
                          noRadius={false}
                          onChange={(value) =>
                            form.setFieldsValue({ [`image${idx}`]: value })
                          }
                        />
                      </Form.Item>
                    ))}
                  </div>
                </div>
                <Form.Item
                  name='description'
                  label={t('productDetail.description')}
                  rules={[
                    {
                      required: true,
                      message: t('productValid.validDescription')
                    }
                  ]}
                >
                  <TextArea placeholder={t('productDetail.description')} />
                </Form.Item>
              </div>
            </Collapse.Panel>
            <Collapse.Panel
              header={<span>2. {t('productDetail.detailInfo')}</span>}
              key='2'
            >
              {' '}
              <div className='p-3'>
                <div className='md:w-1/2 w-full px-2'>
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
                <div className='md:w-1/2 w-full px-2'>
                  <Form.Item
                    name='salePrice'
                    label={`${t('productDetail.salePrice')} (₫)`}
                    rules={[
                      {
                        required: true,
                        message: t('productValid.salePriceValid')
                      }
                    ]}
                  >
                    <Input type='number' />
                  </Form.Item>
                </div>
                <div className='w-full px-2'>
                  <Form.Item
                    name='quantity'
                    label={t('productDetail.quantity')}
                    rules={[
                      {
                        required: true,
                        message: t('productValid.quantityValid')
                      }
                    ]}
                  >
                    <Input type='number' />
                  </Form.Item>
                </div>{' '}
                <div className='w-full mt-3 px-2'>
                  <span>
                    {t('productDetail.chooseStyles')}{' '}
                    <small className='text-gray-500'>
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
            </Collapse.Panel>
          </Collapse>{' '}
          <div
            className='bg-white rounded-md shadow-sm p-4 my-3'
            style={{ position: 'sticky', bottom: 0 }}
          >
            <div className='flex justify-end gap-4 items-center'>
              <Link to={`/seller/products/${storeId}`}>
                <Button type='default'>{t('button.cancel')}</Button>
              </Link>
              <Button
                type='primary'
                htmlType='submit'
                style={{ width: '200px', maxWidth: '100%' }}
                loading={createProductMutation.isPending}
              >
                {t('button.save')}
              </Button>
            </div>
          </div>
        </Form>
      </Spin>
    </div>
  )
}

export default SellerCreateProductForm
