import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../../../apis/auth'
import { createCategory } from '../../../apis/category'
import InputFile from '../../ui/InputFile'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import CategorySelector from '../../selector/CategorySelector'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, notification } from 'antd'
import { useMutation } from '@tanstack/react-query'

const AdminCreateCategoryForm = () => {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmingBack, setIsConfirmingBack] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [selectedParent, setSelectedParent] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)

  const createCategoryMutation = useMutation({
    mutationFn: (formData: FormData) => createCategory(formData),
    onSuccess: (res) => {
      if (res.data.error) notification.error({ message: res.data.error })
      else {
        notification.success({ message: t('toastSuccess.category.create') })
        navigate('/admin/category')
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

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

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsConfirmingBack(true)
  }

  const handleConfirmBack = () => {
    setIsConfirmingBack(false)
    navigate('/admin/category')
  }

  const handleFinish = (values: any) => {
    setIsConfirming(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    const formData = new FormData()
    formData.set('name', values.name)
    if (selectedParent && selectedParent._id)
      formData.set('categoryId', selectedParent._id)
    if (file) formData.set('image', file)
    createCategoryMutation.mutate(formData)
  }

  return (
    <div className='container-fluid position-relative'>
      {createCategoryMutation.isPending && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('categoryDetail.add')}
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
            <h1 className='text-white fs-5 m-0'>{t('categoryDetail.add')}</h1>
          </div>

          <div className='col-12 mt-4 px-4'>
            <p className=''>{t('categoryDetail.selectLargeCategory')}</p>
            <CategorySelector
              label={t('categoryDetail.selectLargeCategory')}
              selected='parent'
              isActive={false}
              onSet={(category: any) => {
                setSelectedParent(category)
              }}
            />
          </div>

          <div className='col-12 px-4 mt-2'>
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

          <div className='col-12 px-4 mt-2'>
            <Form.Item
              name='image'
              label={t('categoryDetail.img')}
              rules={[{ required: true, message: t('categoryValid.validImg') }]}
              valuePropName='fileList'
              getValueFromEvent={() => file}
            >
              <InputFile
                label={t('categoryDetail.img')}
                size='avatar'
                noRadius={true}
                onChange={(value) => {
                  if (value instanceof File) setFile(value)
                  else setFile(null)
                }}
              />
            </Form.Item>
          </div>
        </div>

        <div
          className={`bg-body ${
            isScrolled ? 'shadow' : 'box-shadow'
          } rounded-1 row px-4 my-3 p-3`}
          style={{ position: 'sticky', bottom: '0' }}
        >
          <div className='d-flex justify-content-end align-items-center'>
            <Link
              to='/admin/category'
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
              style={{ width: '200px', maxWidth: '100%' }}
            >
              {t('button.submit')}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default AdminCreateCategoryForm
