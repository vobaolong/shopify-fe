/* eslint-disable react-hooks/exhaustive-deps */
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
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
    []
  )
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
        const categoryIds = (brand.categoryIds || []).map((cat: any) => {
          if (typeof cat === 'object' && cat._id) {
            return cat._id
          }
          return cat
        })
        form.setFieldsValue({
          name: brand.name || '',
          categoryIds: categoryIds
        })

        const categories = (brand.categoryIds || []).filter(
          (cat: any) => typeof cat === 'object' && cat._id
        )
        setSelectedCategories(categories)
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
    onMutate: async (formData: FormData) => {
      await queryClient.cancelQueries({ queryKey: ['brand', brandId] })
      const previousBrand = queryClient.getQueryData(['brand', brandId])
      const name = formData.get('name') as string
      const categoryIds = JSON.parse(
        (formData.get('categoryIds') as string) || '[]'
      )

      queryClient.setQueryData(['brand', brandId], (old: any) => {
        if (!old) return old
        return {
          ...old,
          name,
          categoryIds: categoryIds.map(
            (id: string) =>
              selectedCategories.find((cat) => cat._id === id) || id
          )
        }
      })
      return { previousBrand }
    },
    onError: (error: any, formData, context) => {
      if (context?.previousBrand) {
        queryClient.setQueryData(['brand', brandId], context.previousBrand)
      }
      const errorMessage =
        error?.response?.data?.error || error?.message || 'Server Error'
      notification.error({ message: errorMessage })
    },
    onSuccess: (res: any) => {
      if (res.error) {
        notification.error({ message: res.error })
      } else {
        notification.success({ message: t('toastSuccess.brand.update') })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['brand', brandId] })
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    }
  })
  const handleFinish = (values: { name: string; categoryIds: string[] }) => {
    Modal.confirm({
      title: t('brandDetail.edit'),
      content: t('message.edit'),
      okText: t('button.save'),
      cancelText: t('button.cancel'),
      onOk: () => handleConfirmSubmit()
    })
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('categoryIds', JSON.stringify(values.categoryIds))
    updateBrandMutation.mutate(formData)
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
          categoryIds: []
        }}
        className='row g-0 flex gap-2 px-2'
      >
        <div className='col-12'>
          <div style={{ marginBottom: '24px' }}>
            {' '}
            <MultiCategorySelector
              label={t('categoryDetail.chosenParentCategory')}
              isActive={false}
              isRequired={true}
              value={selectedCategories}
              onSet={(categories) => {
                console.log(
                  'Categories selected in AdminEditBrandForm:',
                  categories
                )
                console.log(
                  'Current selectedCategories state:',
                  selectedCategories
                )
                const ids = categories.map((cat) => cat._id)
                console.log('Extracted IDs:', ids)
                setSelectedCategories(categories)
                form.setFieldsValue({ categoryIds: ids })
                console.log('Form updated with categoryIds:', ids)
              }}
            />
          </div>
          <Form.Item
            name='categoryIds'
            hidden
            rules={[{ required: true, message: t('variantDetail.required') }]}
          >
            <input type='hidden' />
          </Form.Item>
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
          >
            {t('button.save')}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AdminEditBrandForm
