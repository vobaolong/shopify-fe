import { useState, useEffect } from 'react'
import { updateBrand, getBrandById } from '../../../apis/brand.api'
import MultiCategorySelector from '../../selector/MultiCategorySelector'
import { useTranslation } from 'react-i18next'
import { Form, Button, Spin, Modal, Input } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CategoryType } from '../../../@types/entity.types'
import { useAntdApp } from '../../../hooks/useAntdApp'

interface AdminEditBrandFormProps {
  brandId: string
}

const AdminEditBrandForm = ({ brandId }: AdminEditBrandFormProps) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const {
    data: brandData,
    isLoading,
    isError,
    error: fetchError
  } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: () => {
      return getBrandById(brandId)
    },
    enabled: !!brandId,
    retry: 2,
    staleTime: 5 * 60 * 1000
  })

  useEffect(() => {
    if (brandData && brandData.brand) {
      try {
        const brand = brandData.brand
        const categoryIds = brand.categoryIds || []
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
          name: brand.name || '',
          categorySelector
        })
      } catch (error) {
        notification.error({ message: 'Error processing brand data' })
      }
    }
  }, [brandData, form])

  useEffect(() => {
    if (isError && fetchError) {
      const errorMessage =
        (fetchError as any)?.response?.data?.error ||
        (fetchError as any)?.message ||
        'Failed to load brand data'
      notification.error({ message: errorMessage })
    }
  }, [isError, fetchError])

  const updateBrandMutation = useMutation({
    mutationFn: (formData: FormData) => updateBrand(brandId, formData),
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || error?.message || 'Server Error'
      notification.error({ message: errorMessage })
    },
    onSuccess: (res: any) => {
      if (res.error) {
        notification.error({ message: res.error })
      } else {
        notification.success({ message: t('toastSuccess.brand.update') })
        queryClient.invalidateQueries({ queryKey: ['brand', brandId] })
        queryClient.invalidateQueries({ queryKey: ['brands'] })
      }
    }
  })

  const handleFinish = (values: { name: string; categorySelector: any[] }) => {
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
      title: t('brandDetail.edit'),
      content: t('message.edit'),
      okText: t('button.save'),
      cancelText: t('button.cancel'),
      onOk: () => {
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('categoryIds', JSON.stringify(categoryIds))
        updateBrandMutation.mutate(formData)
      }
    })
  }

  return (
    <div className='relative'>
      {(isLoading || updateBrandMutation.isPending) && <Spin />}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{
          name: '',
          categorySelector: []
        }}
        className='row g-0 flex gap-2 px-2'
      >
        <div className='col-12'>
          <div style={{ marginBottom: '24px' }}>
            <Form.Item
              name='categorySelector'
              label={t('categoryDetail.chosenParentCategory')}
              rules={[{ required: true, message: t('variantDetail.required') }]}
            >
              <MultiCategorySelector
                label={t('categoryDetail.chosenParentCategory')}
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
          </div>
        </div>
        <div className='col-12'>
          <Form.Item
            name='name'
            label={t('brandDetail.name')}
            rules={[{ required: true, message: t('categoryValid.validBrand') }]}
          >
            <Input placeholder={t('brandDetail.name')} />
          </Form.Item>
        </div>

        <div className='flex justify-end'>
          <Button
            type='primary'
            htmlType='submit'
            className='flex-col-reverse !min-w-[150px] '
            loading={updateBrandMutation.isPending}
          >
            {t('button.save')}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AdminEditBrandForm
