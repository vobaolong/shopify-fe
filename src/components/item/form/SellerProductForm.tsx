import { useEffect, useState } from 'react'
import { getToken } from '../../../apis/auth.api'
import {
  createProduct,
  getProductByIdForManager,
  updateProduct
} from '../../../apis/product.api'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  notification,
  Form,
  Input,
  Button,
  Collapse,
  Spin,
  Drawer,
  Upload,
  Modal
} from 'antd'
import CategorySelector from '../../selector/CategorySelector'
import VariantSelector from '../../selector/VariantSelector'
import DropDownMenu from '../../ui/DropDownMenu'
import InputFile from '../../ui/InputFile'
import TextArea from '../../ui/TextArea'
import { listBrandByCategory } from '../../../apis/brand.api'
import { PlusOutlined } from '@ant-design/icons'

interface SellerProductFormProps {
  storeId: string
  productId?: string
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormValues {
  name: string
  categoryId: string
  brandId?: string
  images?: (string | File)[]
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

// Image upload component using antd Upload
const ImageUploadAntd: React.FC<{
  value?: (string | File)[]
  onChange?: (value: (string | File)[]) => void
  maxCount?: number
  required?: boolean
}> = ({ value = [], onChange, maxCount = 7, required }) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  // Convert value to fileList for antd Upload
  const fileList = (value || []).map((item, idx) => {
    if (typeof item === 'string') {
      return {
        uid: `img-${idx}`,
        name: `image${idx}`,
        status: 'done',
        url: item
      }
    } else {
      return {
        uid: `img-${idx}`,
        name: (item as File).name || `image${idx}`,
        status: 'done',
        originFileObj: item
      }
    }
  })

  const handleChange = ({ fileList }: any) => {
    // Convert fileList back to (string | File)[]
    const files = fileList.map((file: any) => {
      if (file.originFileObj) return file.originFileObj
      if (file.url) return file.url
      return file
    })
    onChange && onChange(files)
  }

  const handlePreview = async (file: any) => {
    let src = file.url
    if (!src && file.originFileObj) {
      src = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    setPreviewImage(src || '')
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url?.substring(file.url.lastIndexOf('/') + 1)
    )
  }

  return (
    <>
      <Upload
        listType='picture-card'
        fileList={fileList}
        onChange={handleChange}
        onPreview={handlePreview}
        beforeUpload={() => false} // prevent auto upload
        maxCount={maxCount}
        multiple
      >
        {fileList.length >= maxCount ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt='preview' style={{ width: '100%' }} src={previewImage} />
      </Modal>
      {required && fileList.length === 0 && (
        <div className='text-red-500 text-xs mt-1'>* Required</div>
      )}
    </>
  )
}

const SellerProductForm: React.FC<SellerProductFormProps> = ({
  storeId,
  productId,
  open,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const [form] = Form.useForm<FormValues>()

  const { data: productData, isLoading: isProductLoading } = useQuery({
    queryKey: ['product', productId, storeId],
    queryFn: async () => {
      if (!productId) return null
      const res = await getProductByIdForManager(_id, productId, storeId)
      return res.data?.product || null
    },
    enabled: !!productId && !!storeId && open
  })

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

  // Mutation: create or update
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const formData = new FormData()
      formData.set('name', values.name)
      formData.set('description', values.description)
      formData.set('quantity', values.quantity.toString())
      formData.set('price', values.price.toString())
      formData.set('salePrice', values.salePrice.toString())
      formData.set('categoryId', values.categoryId)
      if (values.brandId) formData.set('brandId', values.brandId)
      if (values.variantValueIds)
        formData.set('variantValueIds', values.variantValueIds)
      if (values.images) {
        values.images.forEach((img, idx) => {
          formData.append(`image${idx}`, img as File)
        })
      }
      if (productId) {
        // update
        return updateProduct(_id, formData, storeId, productId)
      } else {
        // create
        return createProduct(_id, formData, storeId)
      }
    },
    onSuccess: (res) => {
      if (res.data?.error) notification.error({ message: res.data.error })
      else {
        notification.success({
          message: productId
            ? t('toastSuccess.product.edit')
            : t('toastSuccess.product.create')
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
        form.resetFields()
        if (onSuccess) onSuccess()
        onClose()
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  // Fill form when editing
  useEffect(() => {
    if (productId && productData && open) {
      const {
        name,
        categoryId,
        brandId,
        description,
        quantity,
        price,
        salePrice,
        variantValueIds,
        images = []
      } = productData
      form.setFieldsValue({
        name,
        categoryId,
        brandId,
        description,
        quantity,
        price,
        salePrice,
        variantValueIds: Array.isArray(variantValueIds)
          ? variantValueIds.join('|')
          : variantValueIds,
        images
      })
    } else if (!productId && open) {
      form.resetFields()
    }
  }, [productId, productData, open, form])

  // Form submit
  const handleFinish = (values: FormValues) => {
    if (values.salePrice > values.price) {
      notification.error({
        message: t('productValid.salePriceCannotBeGreaterThan')
      })
      return
    }
    // Convert images array to image0..image6 fields for backend
    const images = values.images || []
    const newValues = { ...values }
    images.forEach((img, idx) => {
      newValues[`image${idx}`] = img
    })
    mutation.mutate(newValues)
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={800}
      title={
        productId
          ? t('productDetail.editProduct')
          : t('productDetail.createProduct')
      }
      destroyOnHidden
      maskClosable={false}
      className='custom-drawer'
    >
      <Spin spinning={mutation.isPending || isProductLoading}>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleFinish}
          initialValues={{
            name: '',
            categoryId: '',
            brandId: '',
            images: [],
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
                  <Form.Item
                    name='images'
                    label={t('productDetail.images')}
                    rules={[
                      {
                        required: true,
                        message: t('productValid.avatarValid')
                      }
                    ]}
                  >
                    <ImageUploadAntd maxCount={7} required />
                  </Form.Item>
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
              <Button onClick={onClose} type='default'>
                {t('button.cancel')}
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                style={{ width: '200px', maxWidth: '100%' }}
                loading={mutation.isPending}
              >
                {t('button.save')}
              </Button>
            </div>
          </div>
        </Form>
      </Spin>
    </Drawer>
  )
}

export default SellerProductForm
