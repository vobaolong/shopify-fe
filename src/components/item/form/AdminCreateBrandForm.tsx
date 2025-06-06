import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { createBrand, checkBrandNameExist } from '../../../apis/brand.api'
import { Spin, Alert } from 'antd'
import ConfirmDialog from '../../ui/ConfirmDialog'
import MultiCategorySelector from '../../selector/MultiCategorySelector'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, Button, notification, Upload, Input } from 'antd'
import { CategoryType } from '../../../@types/entity.types'
import { UploadOutlined } from '@ant-design/icons'

const AdminCreateBrandForm = ({
  onSuccessCreate
}: {
  onSuccessCreate?: () => void
}) => {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isConfirmingBack, setIsConfirmingBack] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
    []
  )
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    const checkScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      setIsScrolled(!isBottom)
    }
    window.addEventListener('scroll', checkScroll)
    return () => {
      window.removeEventListener('scroll', checkScroll)
    }
  }, [])

  const { _id } = getToken()

  const createBrandMutation = useMutation({
    mutationFn: (formData: FormData) => createBrand(formData),
    onSuccess: (res) => {
      const data = res.data
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        notification.success({ message: t('toastSuccess.brand.create') })
        queryClient.invalidateQueries({ queryKey: ['brands'] })
        setIsConfirming(false)
        form.resetFields()
        setCategoryIds([])
        if (onSuccessCreate) onSuccessCreate()
      }
    },
    onError: () => {
      notification.error({ message: 'Sever Error' })
    }
  })

  const handleFinish = (values: { name: string; categoryIds: string[] }) => {
    setIsConfirming(true)
  }
  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    const formData = new FormData()
    formData.append('name', values.name)
    // categoryIds đã là array, chỉ cần stringify một lần
    formData.append('categoryIds', JSON.stringify(categoryIds))
    if (values.logo && values.logo[0]?.originFileObj) {
      formData.append('logo', values.logo[0].originFileObj)
    }
    createBrandMutation.mutate(formData)
  }

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsConfirmingBack(true)
  }

  const handleConfirmBack = () => {
    navigate('/admin/brands')
    setIsConfirmingBack(false)
  }
  return (
    <div className='container-fluid position-relative'>
      {createBrandMutation.isPending && <Spin size='large' />}
      {isConfirming && (
        <ConfirmDialog
          title={t('brandDetail.add')}
          onSubmit={handleConfirmSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}
      {isConfirmingBack && (
        <ConfirmDialog
          title={t('dialog.cancelCreate')}
          onSubmit={handleConfirmBack}
          onClose={() => setIsConfirmingBack(false)}
          message={t('confirmDialog')}
        />
      )}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{ name: '', categoryIds: [] }}
      >
        <div className='row box-shadow bg-body rounded-1'>
          <div className='col-12 bg-primary p-3 rounded-top-2'>
            <span className='text-white fs-5 m-0'>{t('brandDetail.add')}</span>
          </div>

          <div className='col-12 mt-3 px-4'>
            <span className=''>{t('productDetail.chooseCategory')}</span>
            <Form.Item
              name='categoryIds'
              rules={[{ required: true, message: t('variantDetail.required') }]}
            >
              {' '}
              <MultiCategorySelector
                label={t('chosenCategory')}
                isActive={false}
                isRequired={true}
                defaultValue={selectedCategories}
                onSet={(categories) => {
                  const ids = categories.map((cat) => cat._id)
                  setCategoryIds(ids)
                  setSelectedCategories(categories)
                  form.setFieldsValue({ categoryIds: ids })
                }}
              />
            </Form.Item>
          </div>

          <div className='col-12 px-4 my-3'>
            <Form.Item
              name='name'
              label={t('brandDetail.name')}
              rules={[
                { required: true, message: t('brandDetail.validName') },
                {
                  validator: async (_, value) => {
                    if (!value) return Promise.resolve()
                    const res = await checkBrandNameExist(value)
                    if (res.data?.exists) {
                      return Promise.reject(
                        new Error(t('brandDetail.duplicateName'))
                      )
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <Input placeholder={t('brandDetail.name')} />
            </Form.Item>
          </div>

          <div className='col-12 px-4 my-3'>
            <Form.Item
              name='logo'
              label={t('brandDetail.logo')}
              valuePropName='fileList'
              getValueFromEvent={(e) =>
                Array.isArray(e) ? e : e && e.fileList
              }
            >
              <Upload
                name='logo'
                listType='picture'
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>
                  {t('brandDetail.uploadLogo')}
                </Button>
              </Upload>
            </Form.Item>
          </div>
        </div>

        <div
          className={`bg-body ${
            isScrolled ? 'shadow' : 'box-shadow'
          } rounded-1 row px-4 my-3 p-3`}
          style={{ position: 'sticky', bottom: '0' }}
        >
          <div className='flex justify-end items-center'>
            <Link
              to='/admin/brands'
              className='btn btn-outline-primary ripple res-w-100-md rounded-1 me-3'
              style={{ width: '200px', maxWidth: '100%' }}
              onClick={handleBackClick}
            >
              {t('button.cancel')}
            </Link>
            <Button
              type='primary'
              htmlType='submit'
              className='res-w-100-md rounded-1'
              style={{ width: '300px', maxWidth: '100%' }}
            >
              {t('button.submit')}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default AdminCreateBrandForm
