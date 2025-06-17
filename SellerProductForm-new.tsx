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
  Spin,
  Drawer,
  Upload,
  Modal
} from 'antd'
import CategorySelector from '../../selector/CategorySelector'
import VariantSelector from '../../selector/VariantSelector'
import DropDownMenu from '../../ui/DropDownMenu'
import TextArea from '../../ui/TextArea'
import { listBrandByCategory } from '../../../apis/brand.api'
import { RcFile, UploadFile } from 'antd/lib/upload'
import { PlusOutlined } from '@ant-design/icons'

interface SellerProductFormProps {
  storeId?: string
  productId?: string
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormValues {
  name: string
  categoryId: string
  brandId?: string
  images: any[]
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

type ImageUploadAntdProps = {
  value?: any
  onChange?: (fileList: any) => void
  maxCount?: number
  required?: boolean
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

// Custom upload component
function ImageUploadAntd({
  value,
  onChange,
  maxCount = 1,
  required = false
}: ImageUploadAntdProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>(value || [])

  useEffect(() => {
    if (value) {
      setFileList(value)
    }
  }, [value])

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    )
  }

  const handleChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList)
    if (onChange) {
      onChange(newFileList)
    }
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <>
      <Upload
        listType='picture-card'
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false}
      >
        {fileList.length >= maxCount ? null : uploadButton}
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
    enabled: !!categoryId && open
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

      if (values.images && values.images.length > 0) {
        values.images.forEach((file, i) => {
          // Check if it's a URL or File object
          if (file.originFileObj) {
            formData.set(`image${i}`, file.originFileObj)
          } else if (file.url) {
            // If it's a URL, we don't need to upload it again
            formData.set(`image${i}`, file.url)
          }
        })
      }

      formData.set('categoryId', values.categoryId)
      if (values.brandId) formData.set('brandId', values.brandId)
      if (values.variantValueIds)
        formData.set('variantValueIds', values.variantValueIds)

      if (productId) {
        return updateProduct(_id, formData, storeId, productId)
      }
      return createProduct(_id, formData, storeId)
    },
    onSuccess: (res) => {
      if (res.data.error) notification.error({ message: res.data.error })
      else {
        notification.success({
          message: productId
            ? t('toastSuccess.product.update')
            : t('toastSuccess.product.create')
        })
        if (onSuccess) onSuccess()
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  const handleFinish = (values: FormValues) => {
    if (values.salePrice > values.price) {
      notification.error({
        message: t('productValid.salePriceCannotBeGreaterThan')
      })
      return
    }
    mutation.mutate(values)
  }

  useEffect(() => {
    if (productData) {
      // Format fileList for antd upload component
      const fileList =
        productData.images?.map((image: string, index: number) => ({
          uid: `-${index}`,
          name: `image-${index}.jpg`,
          status: 'done',
          url: image
        })) || []

      form.setFieldsValue({
        name: productData.name,
        categoryId: productData.categoryId?._id,
        brandId: productData.brandId?._id,
        images: fileList,
        description: productData.description,
        quantity: productData.quantity,
        price: productData.price?.$numberDecimal,
        salePrice: productData.salePrice?.$numberDecimal,
        variantValueIds: productData.variantValueIds
          ?.map((value: any) => value._id)
          .join('|')
      })
    }
  }, [productData, form])

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
          <div className='bg-white rounded-md shadow-sm p-4 mb-4'>
            <h3 className='text-lg font-medium mb-3'>
              1. {t('productDetail.basicInfo')}
            </h3>
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
          </div>

          <div className='bg-white rounded-md shadow-sm p-4 mb-4'>
            <h3 className='text-lg font-medium mb-3'>
              2. {t('productDetail.detailInfo')}
            </h3>
            <div className='p-3'>
              <div className='md:w-1/2 w-full px-2'>
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
          </div>

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
