import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { createBrand, checkBrandNameExist } from '../../../apis/brand.api'
import { Spin, Alert } from 'antd'
import ConfirmDialog from '../../ui/ConfirmDialog'
import MultiCategorySelector from '../../selector/MultiCategorySelector'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, Button, Upload, Input } from 'antd'
import { CategoryType } from '../../../@types/entity.types'
import { UploadOutlined } from '@ant-design/icons'
import { useAntdApp } from '../../../hooks/useAntdApp'

const AdminCreateBrandForm = ({
  onSuccessCreate
}: {
  onSuccessCreate?: () => void
}) => {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isConfirmingBack, setIsConfirmingBack] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { notification } = useAntdApp()
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
        if (onSuccessCreate) onSuccessCreate()
      }
    },
    onError: () => {
      notification.error({ message: 'Sever Error' })
    }
  })

  const handleFinish = (values: { name: string; categorySelector: any[] }) => {
    setIsConfirming(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    const selectors = Array.isArray(values.categorySelector)
      ? (values.categorySelector as {
          lv1?: string
          lv2?: string
          lv3?: string
          categoryObj?: CategoryType
        }[])
      : []
    const categoryIds = selectors.map((c) => c.lv3).filter(Boolean)

    const formData = new FormData()
    formData.append('name', values.name)
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
    <div>
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
        className='space-y-4 flex'
        initialValues={{ name: '', categorySelector: [] }}
      >
        <Form.Item
          name='categorySelector'
          label={t('productDetail.chooseCategory')}
          rules={[{ required: true, message: t('variantDetail.required') }]}
        >
          <MultiCategorySelector
            label={t('chosenCategory')}
            isActive={false}
            isRequired={true}
            value={form.getFieldValue('categorySelector') || []}
            onSet={(categories) =>
              form.setFieldsValue({
                categorySelector: categories
              })
            }
          />
        </Form.Item>

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

        <Form.Item
          name='logo'
          label={t('brandDetail.logo')}
          valuePropName='fileList'
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
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

        <Button
          type='primary'
          htmlType='submit'
          className='res-w-100-md rounded-1'
          style={{ width: '300px', maxWidth: '100%' }}
        >
          {t('button.submit')}
        </Button>
      </Form>
    </div>
  )
}

export default AdminCreateBrandForm
