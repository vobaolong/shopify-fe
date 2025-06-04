import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { createVariant } from '../../../apis/variant.api'
import ConfirmDialog from '../../ui/ConfirmDialog'
import MultiCategorySelector from '../../selector/MultiCategorySelector'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, notification, Spin, Card, Typography } from 'antd'
import { useMutation } from '@tanstack/react-query'

const { Title } = Typography

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
      <Spin spinning={createVariantMutation.isPending}>
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
          <Card className='mb-4'>
            <div className='bg-primary p-3 mb-3 rounded'>
              <Title level={5} className='text-white m-0'>
                {t('variantDetail.add')}
              </Title>
            </div>

            <div className='mt-3 px-4'>
              <span>{t('productDetail.chooseCategory')}</span>
              <Form.Item
                name='categoryIds'
                rules={[
                  { required: true, message: t('variantDetail.required') }
                ]}
              >
                <MultiCategorySelector
                  label={t('chosenCategory')}
                  isActive={false}
                  isRequired={true}
                  defaultValue={selectedCategories}
                  onSet={(categories) => {
                    const ids = categories.map((cat) => cat._id)
                    setSelectedCategories(categories)
                    form.setFieldsValue({ categoryIds: ids })
                  }}
                />
              </Form.Item>
            </div>

            <div className='px-4 my-3'>
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
          </Card>

          <Card
            className={isScrolled ? 'shadow-sm' : ''}
            style={{ position: 'sticky', bottom: '0', zIndex: 1 }}
          >
            <div className='flex justify-end items-center gap-3'>
              <Link
                to='/admin/variant'
                className='mr-3'
                onClick={handleBackClick}
              >
                <Button type='default' style={{ width: '120px' }}>
                  {t('button.cancel')}
                </Button>
              </Link>
              <Button
                type='primary'
                htmlType='submit'
                style={{ width: '200px' }}
                loading={createVariantMutation.isPending}
              >
                {t('button.submit')}
              </Button>
            </div>
          </Card>
        </Form>
      </Spin>
    </div>
  )
}

export default AdminCreateVariantForm
