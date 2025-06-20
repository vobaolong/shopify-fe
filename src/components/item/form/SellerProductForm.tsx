import { useEffect, useState, Suspense, lazy } from 'react'
import { getToken } from '../../../apis/auth.api'
import {
  createProduct,
  getProductByIdForManager,
  updateProduct
} from '../../../apis/product.api'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Form, Input, Button, Spin, Drawer, Upload, Modal } from 'antd'
import CategorySelector from '../../selector/CategorySelector'
import VariantSelector from '../../selector/VariantSelector'
import DropDownMenu from '../../ui/DropDownMenu'
import { listBrandByCategory } from '../../../apis/brand.api'
import { PlusOutlined } from '@ant-design/icons'
import { useAntdApp } from '../../../hooks/useAntdApp'

const ReactQuill = lazy(() => import('react-quill-new'))
import 'react-quill-new/dist/quill.snow.css'

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

const ImageUploadAntd: React.FC<{
  value?: (string | File)[]
  onChange?: (value: (string | File)[]) => void
  maxCount?: number
  required?: boolean
}> = ({ value = [], onChange, maxCount = 7, required }) => {
  const [previewState, setPreviewState] = useState({
    open: false,
    image: '',
    title: ''
  })

  const fileList = (value || []).map((item, idx) => {
    if (typeof item === 'string') {
      return {
        uid: `img-${idx}`,
        name: `image${idx}`,
        status: 'done' as const,
        url: item
      }
    } else {
      return {
        uid: `img-${idx}`,
        name: (item as File).name || `image${idx}`,
        status: 'done' as const,
        originFileObj: item
      }
    }
  })

  const handleChange = ({ fileList }: any) => {
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
    setPreviewState({
      open: true,
      image: src || '',
      title: file.name || file.url?.substring(file.url.lastIndexOf('/') + 1)
    })
  }

  return (
    <>
      <Upload
        listType='picture-card'
        fileList={fileList as any}
        onChange={handleChange}
        onPreview={handlePreview}
        beforeUpload={() => false}
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
        open={previewState.open}
        title={previewState.title}
        footer={null}
        onCancel={() => setPreviewState((prev) => ({ ...prev, open: false }))}
      >
        <img alt='preview' style={{ width: '100%' }} src={previewState.image} />
      </Modal>
      {required && fileList.length === 0 && (
        <div className='text-red-500 text-xs mt-1'>* Required</div>
      )}
    </>
  )
}

const Editor: React.FC<{
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}> = ({ value, onChange, placeholder }) => {
  return (
    <div className='!min-h-[300px]'>
      <Suspense fallback={<Spin />}>
        <ReactQuill
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          theme='snow'
          className='!h-[250px] mb-2'
        />
      </Suspense>
    </div>
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
  const { message } = useAntdApp()

  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError
  } = useQuery({
    queryKey: ['product', productId, storeId],
    queryFn: async () => {
      if (!productId || !storeId || !_id) {
        console.log('Missing required params:', {
          productId,
          storeId,
          userId: _id
        })
        return null
      }
      try {
        console.log('Fetching product:', { productId, storeId, userId: _id })
        const res = await getProductByIdForManager(_id, productId, storeId)
        console.log('Product response:', res)

        if (res?.product || res?.data?.product) {
          return res.product || res.data.product
        } else {
          console.warn('No product in response:', res)
          return null
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        return null
      }
    },
    enabled: !!productId && !!storeId && !!_id,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    throwOnError: false
  })

  const categoryId = Form.useWatch('categoryId', form)
  const { data: brandsData, isLoading: isBrandsLoading } = useQuery({
    queryKey: ['brands', categoryId],
    queryFn: async () => {
      if (!categoryId) return []
      const res = await listBrandByCategory(categoryId)
      const data = res.data
      if (data.error) {
        message.error('Error loading brands')
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
      if (values.images && values.images.length > 0) {
        values.images.slice(0, 7).forEach((img) => {
          formData.append('images', img as File)
        })
      }
      if (productId) {
        return updateProduct(_id, formData, storeId, productId)
      } else {
        return createProduct(_id, formData, storeId)
      }
    },
    onSuccess: (res) => {
      if (res.data?.error) message.error('Server Error')
      else {
        message.success(
          productId
            ? t('toastSuccess.product.edit')
            : t('toastSuccess.product.create')
        )
        window.scrollTo({ top: 0, behavior: 'smooth' })
        form.resetFields()
        if (onSuccess) onSuccess()
        onClose()
      }
    },
    onError: () => {
      message.error('Server Error')
    }
  })
  const [formState, setFormState] = useState({
    selectedCategory: null as any,
    isLoading: false,
    initialData: null as any
  })
  useEffect(() => {
    if (productId && productData && open) {
      try {
        if (typeof productData === 'object' && productData !== null) {
          const {
            name = '',
            categoryId = '',
            brandId = '',
            description = '',
            quantity = 0,
            price = 0,
            salePrice = 0,
            variantValueIds = '',
            listImages = [],
            images = []
          } = productData as any

          const formattedPrice =
            typeof price === 'object' && price?.$numberDecimal
              ? price.$numberDecimal
              : price

          const formattedSalePrice =
            typeof salePrice === 'object' && salePrice?.$numberDecimal
              ? salePrice.$numberDecimal
              : salePrice

          const imageList = listImages.length > 0 ? listImages : images

          const selectedCategory =
            categoryId && typeof categoryId === 'object' ? categoryId : null

          const formValues = {
            name,
            categoryId: categoryId?._id || categoryId,
            brandId: brandId?._id || brandId,
            description,
            quantity,
            price: formattedPrice,
            salePrice: formattedSalePrice,
            variantValueIds: Array.isArray(variantValueIds)
              ? variantValueIds.join('|')
              : variantValueIds,
            images: imageList
          }

          setFormState((prev) => ({
            ...prev,
            selectedCategory,
            initialData: formValues
          }))

          setTimeout(() => {
            form.setFieldsValue(formValues)
            form.validateFields().catch((err) => {})
          }, 100)
        }
      } catch (error) {
        message.error('Error processing product data')
      }
    } else if (!productId && open) {
      setFormState((prev) => ({
        ...prev,
        selectedCategory: null,
        initialData: null
      }))
      form.resetFields()
    }
  }, [productId, productData, open, form, productError, message])

  const handleFinish = (values: FormValues) => {
    if (values.salePrice > values.price) {
      message.error(t('productValid.salePriceCannotBeGreaterThan'))
      return
    }
    mutation.mutate(values)
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={600}
      title={
        productId
          ? t('productDetail.editProduct')
          : t('productDetail.createProduct')
      }
      destroyOnHidden
      maskClosable={false}
    >
      <Spin
        spinning={mutation.isPending || isProductLoading || formState.isLoading}
      >
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
          <Form.Item
            name='name'
            label={t('productDetail.name')}
            rules={[{ required: true, message: t('productValid.validName') }]}
          >
            <Input
              showCount
              maxLength={120}
              placeholder={t('productDetail.name')}
            />
          </Form.Item>
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
              value={formState.selectedCategory}
              onChange={(category: any) => {
                setFormState((prev) => ({
                  ...prev,
                  selectedCategory: category
                }))
                form.setFieldsValue({ categoryId: category?._id || '' })
                form.validateFields(['categoryId']).catch(() => {})
              }}
            />
          </Form.Item>
          <Form.Item name='brandId' label={t('productDetail.chooseBrand')}>
            <DropDownMenu
              listItem={brands}
              value={form.getFieldValue('brandId')}
              setValue={(brandId: string) => form.setFieldsValue({ brandId })}
              size='lg'
            />
          </Form.Item>
          <Form.Item
            name='images'
            label={t('productDetail.productImg')}
            rules={[
              {
                required: true,
                message: t('productValid.avatarValid')
              }
            ]}
          >
            <ImageUploadAntd maxCount={7} required />
          </Form.Item>
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
            <Editor placeholder={t('productDetail.description')} />
          </Form.Item>
          <Form.Item
            name='price'
            label={`${t('productDetail.price')} (₫)`}
            rules={[
              {
                required: true,
                message: t('productValid.priceValid')
              }
            ]}
          >
            <Input type='number' />
          </Form.Item>
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
          <span>
            {t('productDetail.chooseStyles')}{' '}
            <small className='text-gray-500'>
              {t('productDetail.chooseCateFirst')}
            </small>{' '}
          </span>
          <Form.Item name='variantValueIds'>
            <VariantSelector
              key={categoryId || 'no-category'}
              categoryId={categoryId}
              onSet={(variantValues: any[]) => {
                form.setFieldsValue({
                  variantValueIds: (
                    variantValues.map((v) => v._id) as string[]
                  ).join('|')
                })
              }}
            />
          </Form.Item>
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
        </Form>
      </Spin>
    </Drawer>
  )
}

export default SellerProductForm
