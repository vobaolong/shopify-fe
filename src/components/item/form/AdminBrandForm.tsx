import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CategoryType } from '../../../@types/entity.types'
import { getToken } from '../../../apis/auth.api'
import {
  getBrandById,
  updateBrand,
  createBrand,
  checkBrandNameExist
} from '../../../apis/brand.api'
import { Spin, Alert, Input, Modal, Form, Button, Upload } from 'antd'
import MultiCategorySelector from '../../selector/MultiCategorySelector'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAntdApp } from '../../../hooks/useAntdApp'
import useInvalidate from '../../../hooks/useInvalidate'
import { UploadOutlined } from '@ant-design/icons'

interface AdminBrandFormProps {
  mode: 'CREATE' | 'UPDATE'
  brandId?: string | null
  onSuccess?: () => void
  onClose?: () => void
}

const AdminBrandForm = ({ mode, brandId, onSuccess }: AdminBrandFormProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const invalidate = useInvalidate()
  const { notification } = useAntdApp()
  const queryClient = useQueryClient()

  const {
    data: brandData,
    isLoading,
    error: queryError
  } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: async () => {
      return await getBrandById(brandId!)
    },
    enabled: mode === 'UPDATE' && !!brandId
  })

  useEffect(() => {
    if (mode === 'UPDATE' && brandData) {
      console.log('DEBUG: brandData received:', brandData)
      const data = brandData.data || brandData
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        const categoryIds = data.brand.categoryIds || []
        const categorySelector = categoryIds.map((cat: CategoryType) => {
          let lv2, lv1
          if (cat.categoryId && typeof cat.categoryId === 'object') {
            lv2 = cat.categoryId._id
            if (
              cat.categoryId.categoryId &&
              typeof cat.categoryId.categoryId === 'object'
            ) {
              lv1 = cat.categoryId.categoryId._id
            }
          }
          return {
            lv1,
            lv2,
            lv3: cat._id,
            categoryObj: cat
          }
        })
        form.setFieldsValue({
          name: data.brand.name,
          categorySelector
        })
      }
    } else if (mode === 'CREATE') {
      form.resetFields()
    }
  }, [brandData, queryError, mode, brandId])

  const mutation = useMutation({
    mutationFn: (values: any) => {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('categoryIds', JSON.stringify(values.categoryIds))
      if (values.logo && values.logo[0]?.originFileObj) {
        formData.append('logo', values.logo[0].originFileObj)
      }

      if (mode === 'UPDATE' && brandId) {
        return updateBrand(brandId, formData)
      } else {
        return createBrand(formData)
      }
    },
    onSuccess: (res) => {
      const data = res.data || res
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        notification.success({
          message:
            mode === 'UPDATE'
              ? t('toastSuccess.brand.update')
              : t('toastSuccess.brand.create')
        })
        invalidate({ queryKey: ['brands'] })
        queryClient.invalidateQueries({ queryKey: ['brands'] })
        if (mode === 'UPDATE' && brandId) {
          queryClient.invalidateQueries({ queryKey: ['brand', brandId] })
        }
        if (onSuccess) onSuccess()
      }
    },
    onError: () => {
      notification.error({ message: 'Server error' })
    }
  })

  return (
    <div>
      {isLoading && <Spin size='large' />}
      {queryError && (
        <Alert
          message={String(queryError)}
          type='error'
          showIcon
          className='mb-2'
        />
      )}
      <Form
        form={form}
        layout='vertical'
        onFinish={(values) => {
          const selectors = Array.isArray(values.categorySelector)
            ? (values.categorySelector as {
                lv1?: string
                lv2?: string
                lv3?: string
                categoryObj?: CategoryType
              }[])
            : []
          const categoryIds = selectors.map((c) => c.lv3).filter(Boolean)
          Modal.confirm({
            title:
              mode === 'UPDATE' ? t('brandDetail.edit') : t('brandDetail.add'),
            content: mode === 'UPDATE' ? t('message.edit') : t('message.add'),
            onOk: () => mutation.mutate({ ...values, categoryIds }),
            okText: t('button.save'),
            cancelText: t('button.cancel')
          })
        }}
        initialValues={{ name: '', categorySelector: [], logo: [] }}
      >
        <Form.Item
          name='categorySelector'
          label={t('categoryDetail.chosenParentCategory')}
          rules={[
            { required: true, message: t('categoryValid.requiredCategory') }
          ]}
        >
          <MultiCategorySelector
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
                if (!value || mode === 'UPDATE') return Promise.resolve()
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
          className='ripple res-w-100-md rounded-1'
          style={{ width: '300px', maxWidth: '100%' }}
          loading={mutation.isPending}
        >
          {t('button.save')}
        </Button>
      </Form>
    </div>
  )
}

export default AdminBrandForm
