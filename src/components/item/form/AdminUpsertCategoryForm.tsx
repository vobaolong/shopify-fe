import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  createCategory,
  updateCategory,
  getCategoryById
} from '../../../apis/category'
import InputFile from '../../ui/InputFile'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import CategorySelector from '../../selector/CategorySelector'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, notification } from 'antd'
import { useMutation } from '@tanstack/react-query'

interface Props {
  categoryId?: string
  onSuccess?: () => void
}

const AdminUpsertCategoryForm = ({ categoryId, onSuccess }: Props) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmingBack, setIsConfirmingBack] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [defaultSrc, setDefaultSrc] = useState('')
  const isEdit = !!categoryId

  // Mutation
  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      isEdit && categoryId
        ? updateCategory(categoryId, formData)
        : createCategory(formData),
    onSuccess: (res) => {
      notification.success({
        message: t(
          isEdit
            ? 'toastSuccess.category.update'
            : 'toastSuccess.category.create'
        )
      })
      if (onSuccess) onSuccess()
      else navigate('/admin/categories')
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  // Fetch data for edit
  useEffect(() => {
    if (!isEdit) return
    setIsLoading(true)
    getCategoryById(categoryId!)
      .then((res) => {
        const category = (res as any).category
        if (category) {
          form.setFieldsValue({
            name: category.name,
            categoryId: category.categoryId || null,
            image: category.image
          })
          setDefaultSrc(category.image)
          console.log('categoryId:', category.categoryId)
        }
        setIsLoading(false)
      })
      .catch(() => {
        notification.error({ message: 'Server Error' })
        setIsLoading(false)
      })
  }, [categoryId, form])

  const handleBackClick = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) e.preventDefault()
    setIsConfirmingBack(true)
  }

  const handleConfirmBack = () => {
    setIsConfirmingBack(false)
    navigate('/admin/categories')
  }

  const handleFinish = () => {
    setIsConfirming(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    const formData = new FormData()
    formData.set('name', values.name)
    if (values.categoryId && values.categoryId._id)
      formData.set('categoryId', values.categoryId._id)
    if (file) formData.set('image', file)
    mutation.mutate(formData)
    setIsConfirming(false)
  }

  return (
    <div className='container-fluid position-relative'>
      {(isLoading || mutation.isPending) && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t(isEdit ? 'dialog.updateCategory' : 'categoryDetail.add')}
          onSubmit={handleConfirmSubmit}
          onClose={() => setIsConfirming(false)}
          message={t(isEdit ? 'message.edit' : 'confirmDialog')}
        />
      )}
      {isConfirmingBack && (
        <ConfirmDialog
          title={t(isEdit ? 'dialog.cancelUpdate' : 'dialog.cancelCreate')}
          onSubmit={handleConfirmBack}
          onClose={() => setIsConfirmingBack(false)}
          message={t('confirmDialog')}
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
              {t(isEdit ? 'categoryDetail.edit' : 'categoryDetail.add')}
            </span>
          </div>

          <div className='col-12 px-4 mt-4'>
            <Form.Item name='categoryId'>
              <CategorySelector
                label={t('categoryDetail.chosenParentCategory')}
                selected='parent'
                isActive={false}
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
            {t('categoryDetail.img')} <sup className='text-danger'>*</sup>
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
              onClick={handleBackClick}
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

export default AdminUpsertCategoryForm
