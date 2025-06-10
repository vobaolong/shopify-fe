import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CategoryType } from '../../@types/entity.types'
import { getToken } from '../../apis/auth.api'
import {
  getVariantById,
  updateVariant,
  createVariant
} from '../../apis/variant.api'
import { regexTest } from '../../constants/regex.constant'
import { Spin, Alert, Input, Modal, Form, Button } from 'antd'
import MultiCategorySelector from './MultiCategorySelector'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAntdApp } from '../../hooks/useAntdApp'
import useInvalidate from '../../hooks/useInvalidate'

interface AdminVariantFormProps {
  mode: 'CREATE' | 'UPDATE'
  variantId?: string | null
  onSuccess?: () => void
  onClose?: () => void
}

const AdminVariantForm = ({
  mode,
  variantId,
  onSuccess
}: AdminVariantFormProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const invalidate = useInvalidate()
  const { notification } = useAntdApp()

  const {
    data: variantData,
    isLoading,
    error: queryError
  } = useQuery({
    queryKey: ['variant', variantId],
    queryFn: async () => {
      return await getVariantById(variantId!)
    },
    enabled: mode === 'UPDATE' && !!variantId
  })

  useEffect(() => {
    if (mode === 'UPDATE' && variantData) {
      console.log('DEBUG: variantData received:', variantData)
      const data = variantData.data || variantData
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        const categoryIds = data.variant.categoryIds || []
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
          name: data.variant.name,
          categorySelector
        })
      }
    } else if (mode === 'CREATE') {
      form.resetFields()
    }
  }, [variantData, queryError, mode, variantId])

  const mutation = useMutation({
    mutationFn: (values: any) => {
      if (mode === 'UPDATE' && variantId) {
        return updateVariant(variantId, {
          name: values.name,
          categoryIds: values.categoryIds
        })
      } else {
        return createVariant({
          name: values.name,
          categoryIds: values.categoryIds
        })
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
              ? t('toastSuccess.variant.update')
              : t('toastSuccess.variant.create')
        })
        invalidate({ queryKey: ['variants'] })
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
              mode === 'UPDATE'
                ? t('categoryDetail.edit')
                : t('categoryDetail.add'),
            content: mode === 'UPDATE' ? t('message.edit') : t('message.add'),
            onOk: () => mutation.mutate({ ...values, categoryIds }),
            okText: t('button.save'),
            cancelText: t('button.cancel')
          })
        }}
        initialValues={{ name: '', categorySelector: [] }}
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
          label={t('variantDetail.name')}
          rules={[{ required: true, message: t('categoryValid.requiredName') }]}
        >
          <Input placeholder={t('variantDetail.name')} />
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

export default AdminVariantForm
