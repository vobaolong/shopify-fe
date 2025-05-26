import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { createVariant } from '../../../apis/variant.api'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import MultiCategorySelector from '../../selector/MultiCategorySelector'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, notification } from 'antd'
import { useMutation } from '@tanstack/react-query'

const AdminCreateVariantForm = () => {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isConfirmingBack, setIsConfirmingBack] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [form] = Form.useForm()
  const [selectedCategories, setSelectedCategories] = useState<any[]>([])
  const navigate = useNavigate()
  const { _id } = getToken()

  const createVariantMutation = useMutation({
    mutationFn: (values: { name: string; categoryIds: string[] }) =>
      createVariant(_id, values),
    onSuccess: (res) => {
      if (res.data.error) notification.error({ message: res.data.error })
      else {
        notification.success({ message: t('toastSuccess.variant.create') })
        form.resetFields()
        setSelectedCategories([])
        navigate('/admin/variant')
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
    navigate('/admin/variant')
    setIsConfirmingBack(false)
  }

  const handleFinish = (values: { name: string; categoryIds: string[] }) => {
    setIsConfirming(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    createVariantMutation.mutate(values)
    setIsConfirming(false)
  }

  return (
    <div className='container-fluid position-relative'>
      {createVariantMutation.isPending && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('variantDetail.add')}
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
            <span className='text-white fs-5 m-0'>
              {t('variantDetail.add')}
            </span>
          </div>

          <div className='col-12 mt-3 px-4'>
            <span className=''>{t('productDetail.chooseCategory')}</span>
            <Form.Item
              name='categoryIds'
              rules={[{ required: true, message: t('variantDetail.required') }]}
            >
              <MultiCategorySelector
                label={t('chosenCategory')}
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

          <div className='col-12 px-4 my-3'>
            <Form.Item
              name='name'
              label={t('variantDetail.name')}
              rules={[
                { required: true, message: t('variantDetail.validName') }
              ]}
            >
              <Input placeholder={t('variantDetail.name')} />
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
              to='/admin/variant'
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

export default AdminCreateVariantForm
