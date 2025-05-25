/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { updateCategory, getCategoryById } from '../../../apis/category'
import InputFile from '../../ui/InputFile'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import CategorySelector from '../../selector/CategorySelector'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, notification } from 'antd'
import { useMutation } from '@tanstack/react-query'

const AdminEditCategoryForm = ({ categoryId = '' }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmingBack, setIsConfirmingBack] = useState(false)
  const [isConfirmingUpdate, setIsConfirmingUpdate] = useState(false)
  const [form] = Form.useForm()
  const [selectedParent, setSelectedParent] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [defaultSrc, setDefaultSrc] = useState('')

  const updateCategoryMutation = useMutation({
    mutationFn: (formData: FormData) => updateCategory(categoryId, formData),
    onSuccess: (res) => {
      if (res.data.error) notification.error({ message: res.data.error })
      else {
        notification.success({ message: t('toastSuccess.category.update') })
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  useEffect(() => {
    setIsLoading(true)
    getCategoryById(categoryId)
      .then((res) => {
        const data = res.data
        if (data.error) notification.error({ message: data.error })
        else {
          form.setFieldsValue({
            name: data.category.name
          })
          setSelectedParent(
            data.category.categoryId ? data.category.categoryId : null
          )
          setDefaultSrc(data.category.image)
        }
        setIsLoading(false)
      })
      .catch(() => {
        notification.error({ message: 'Server Error' })
        setIsLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  const handleConfirmBack = () => {
    setIsConfirmingBack(false)
    window.history.back()
  }

  const handleFinish = (values: any) => {
    setIsConfirmingUpdate(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    const formData = new FormData()
    formData.set('name', values.name)
    if (selectedParent && selectedParent._id)
      formData.set('categoryId', selectedParent._id)
    if (file) formData.set('image', file)
    updateCategoryMutation.mutate(formData)
    setIsConfirmingUpdate(false)
  }

  return (
    <div className='container-fluid position-relative'>
      {isLoading && <Loading />}
      {isConfirmingUpdate && (
        <ConfirmDialog
          title={t('dialog.updateCategory')}
          onSubmit={handleConfirmSubmit}
          message={t('message.edit')}
          onClose={() => setIsConfirmingUpdate(false)}
        />
      )}
      {isConfirmingBack && (
        <ConfirmDialog
          title={t('dialog.cancelUpdate')}
          onSubmit={handleConfirmBack}
          message={t('confirmDialog')}
          onClose={() => setIsConfirmingBack(false)}
        />
      )}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{ name: '' }}
      >
        <div className='row box-shadow bg-body rounded-1'>
          <div className='col-12 bg-primary p-3 rounded-top-2'>
            <span className='text-white fs-5 m-0'>
              {t('categoryDetail.edit')}
            </span>
          </div>

          <div className='col-12 px-4 mt-4'>
            <Form.Item name='categoryId'>
              <CategorySelector
                label={t('categoryDetail.chosenParentCategory')}
                selected='parent'
                isActive={false}
                defaultValue={selectedParent}
                onSet={(category) => setSelectedParent(category)}
              />
            </Form.Item>
          </div>

          <div className='col-12 px-4 mt-4'>
            <Form.Item
              name='name'
              label={t('categoryDetail.name')}
              rules={[
                { required: true, message: t('categoryValid.validName') }
              ]}
            >
              <Input placeholder={t('categoryDetail.name')} />
            </Form.Item>
          </div>

          <span className='col-12 px-4 mt-4 fs-9'>
            Ảnh bìa ngành hàng <sup className='text-danger'>*</sup>
          </span>
          <div className='col-12 px-4 mb-3'>
            <Form.Item name='image'>
              <InputFile
                label={t('categoryDetail.img')}
                size='avatar'
                noRadius={true}
                defaultSrc={defaultSrc}
                onChange={(value) => {
                  if (value instanceof File) setFile(value)
                  else setFile(null)
                }}
              />
            </Form.Item>
          </div>
        </div>
        <div
          className={`bg-body shadow rounded-1 row px-4 my-3 p-3`}
          style={{ position: 'sticky', bottom: '0' }}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <Link
              to='/admin/categories'
              className='text-decoration-none cus-link-hover res-w-100-md my-2'
            >
              <i className='fa-solid fa-angle-left'></i> {t('button.back')}
            </Link>
            <Button
              type='primary'
              htmlType='submit'
              className='btn btn-primary ripple res-w-100-md rounded-1'
              style={{ width: '200px', maxWidth: '100%' }}
            >
              {t('button.save')}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default AdminEditCategoryForm
