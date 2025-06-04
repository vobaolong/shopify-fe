import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { updateVariant, getVariantById } from '../../../apis/variant.api'
import MultiCategorySelector from '../../selector/MultiCategorySelector'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, Card, Typography, Spin, Alert, Modal } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAntdApp } from '../../../hooks/useAntdApp'

const { Title } = Typography

interface VariantType {
  _id: string
  name: string
  categoryIds: { _id: string }[]
}

const AdminEditVariantForm = ({ variantId = '' }: { variantId?: string }) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<any[]>([])
  const queryClient = useQueryClient()
  const { _id } = getToken()

  // Load variant data
  useEffect(() => {
    setError('')
    setLoading(true)
    getVariantById(_id, variantId)
      .then((res: { data: { error?: string; variant?: VariantType } }) => {
        if (res.data.error) {
          setError(res.data.error)
        } else if (res.data.variant) {
          form.setFieldsValue({
            name: res.data.variant.name
          })
          setSelectedCategories(res.data.variant.categoryIds || [])
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setLoading(false)
      })
  }, [variantId])

  // Mutation for updating variant
  const updateVariantMutation = useMutation({
    mutationFn: (values: { name: string; categoryIds: string[] }) =>
      updateVariant(_id, variantId, values),
    onSuccess: (res) => {
      if (res.data.error) {
        notification.error({ message: res.data.error })
      } else {
        notification.success({ message: t('toastSuccess.variant.update') })
        queryClient.invalidateQueries({ queryKey: ['variant', variantId] })
      }
    },
    onError: () => {
      notification.error({ message: 'Server error' })
    }
  })

  // Form handlers
  const handleFinish = (values: { name: string }) => {
    setIsConfirming(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    const categoryIds = selectedCategories.map((cat) => cat._id)
    updateVariantMutation.mutate({
      ...values,
      categoryIds
    })
    setIsConfirming(false)
  }

  return (
    <div className='w-full'>
      <Spin spinning={loading || updateVariantMutation.isPending}>
        {error && (
          <Alert message={error} type='error' showIcon className='mb-4' />
        )}

        {isConfirming && (
          <Modal
            title={t('variantDetail.edit')}
            open={isConfirming}
            onOk={handleConfirmSubmit}
            onCancel={() => setIsConfirming(false)}
            okText={t('button.save')}
            cancelText={t('button.cancel')}
          >
            <p>{t('confirmDialog')}</p>
          </Modal>
        )}

        <Form form={form} layout='vertical' onFinish={handleFinish}>
          <Card className='mb-4'>
            <div className='bg-primary p-3 mb-3 rounded'>
              <Title level={5} className='text-white m-0'>
                {t('variantDetail.edit')}
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
                    setSelectedCategories(categories)
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
            style={{ position: 'sticky', bottom: '0', zIndex: 1 }}
            className='shadow-sm'
          >
            <div className='flex justify-between items-center'>
              <Link to='/admin/variant'>
                <Button type='default'>
                  <i className='fa-solid fa-angle-left mr-1' />{' '}
                  {t('button.back')}
                </Button>
              </Link>
              <Button
                type='primary'
                htmlType='submit'
                style={{ width: '200px', maxWidth: '100%' }}
                loading={updateVariantMutation.isPending}
              >
                {t('button.save')}
              </Button>
            </div>
          </Card>
        </Form>
      </Spin>
    </div>
  )
}

export default AdminEditVariantForm
