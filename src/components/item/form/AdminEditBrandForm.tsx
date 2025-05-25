/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../../apis/auth'
import { updateBrand, getBrandById } from '../../../apis/brand'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import Error from '../../ui/Error'
import ConfirmDialog from '../../ui/ConfirmDialog'
import MultiCategorySelector from '../../selector/MultiCategorySelector'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Form, Button, notification } from 'antd'
import { useMutation } from '@tanstack/react-query'

const AdminEditBrandForm = ({ brandId = '' }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [form] = Form.useForm()
  const [selectedCategories, setSelectedCategories] = useState<any[]>([])
  const { _id } = getToken()

  const updateBrandMutation = useMutation({
    mutationFn: (values: { name: string; categoryIds: string[] }) =>
      updateBrand(_id, brandId, values),
    onSuccess: (res) => {
      if (res.data.error) notification.error({ message: res.data.error })
      else {
        notification.success({ message: t('toastSuccess.brand.update') })
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  useEffect(() => {
    setIsLoading(true)
    getBrandById(_id, brandId)
      .then((res) => {
        const data = res.data
        if (data.error) {
          notification.error({ message: data.error })
        } else {
          form.setFieldsValue({
            name: data.brand.name,
            categoryIds: (data.brand.categoryIds as any[]).map(
              (cat: any) => cat._id
            )
          })
          setSelectedCategories(data.brand.categoryIds)
        }
        setIsLoading(false)
      })
      .catch(() => {
        notification.error({ message: 'Server Error' })
        setIsLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId])

  const handleFinish = (values: { name: string; categoryIds: string[] }) => {
    setIsConfirming(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    updateBrandMutation.mutate(values)
    setIsConfirming(false)
  }

  return (
    <div className='container-fluid position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('categoryDetail.edit')}
          onSubmit={handleConfirmSubmit}
          message={t('message.edit')}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{ name: '', categoryIds: [] }}
        className='border bg-body rounded-1 row mb-2'
      >
        <div className='col-12 bg-primary rounded-top-1 px-4 py-3'>
          <h1 className='text-white fs-5 m-0'>{t('brandDetail.edit')}</h1>
        </div>
        <div className='col-12 mt-4 px-4'>
          <Form.Item
            name='categoryIds'
            rules={[{ required: true, message: t('variantDetail.required') }]}
          >
            <MultiCategorySelector
              label={t('categoryDetail.chosenParentCategory')}
              isActive={false}
              isRequired={true}
              defaultValue={selectedCategories}
              onSet={(categories) => {
                const ids = categories ? categories.map((cat) => cat._id) : []
                setSelectedCategories(categories || [])
                form.setFieldsValue({ categoryIds: ids })
              }}
            />
          </Form.Item>
        </div>
        <div className='col-12 px-4 mt-2'>
          <Form.Item
            name='name'
            label={t('brandDetail.name')}
            rules={[{ required: true, message: t('categoryValid.validBrand') }]}
          >
            <Input placeholder={t('brandDetail.name')} />
          </Form.Item>
        </div>
        <div className='col-12 px-4 pb-3 d-flex justify-content-between align-items-center mt-4 res-flex-reverse-md'>
          <Link
            to='/admin/brands'
            className='text-decoration-none cus-link-hover res-w-100-md my-2'
          >
            <i className='fa-solid fa-angle-left'></i> {t('button.back')}
          </Link>
          <Button
            type='primary'
            htmlType='submit'
            className='btn btn-primary ripple res-w-100-md rounded-1'
            style={{ width: '300px', maxWidth: '100%' }}
          >
            {t('button.save')}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AdminEditBrandForm
