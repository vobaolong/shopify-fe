import { useEffect } from 'react'
import { Form, Input, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useUpdateVariantValue } from '../../../hooks/useVariantValue'
import { useAntdApp } from '../../../hooks/useAntdApp'

interface VariantValueType {
  _id: string
  name: string
  variantId: string
}

interface ValueFormData {
  name: string
}

const AdminEditVariantValueForm = ({
  oldVariantValue,
  onRun
}: {
  oldVariantValue?: VariantValueType
  onRun?: () => void
}) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [form] = Form.useForm()
  const updateValueMutation = useUpdateVariantValue()

  useEffect(() => {
    if (oldVariantValue) {
      form.setFieldsValue({
        name: oldVariantValue.name
      })
    }
  }, [oldVariantValue, form])

  const handleSubmit = (values: ValueFormData) => {
    if (!oldVariantValue?._id) return

    updateValueMutation.mutate(
      {
        valueId: oldVariantValue._id,
        value: values
      },
      {
        onSuccess: (data) => {
          const response = data.data || data
          if (response.error) {
            notification.error({ message: response.error })
          } else {
            notification.success({
              message: t('toastSuccess.variantValue.update')
            })
            onRun?.()
          }
        },
        onError: () => {
          notification.error({ message: 'Server Error' })
        }
      }
    )
  }

  return (
    <div className='relative'>
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        className='space-y-4'
      >
        <Form.Item
          name='name'
          label={t('variantDetail.value.name')}
          rules={[
            {
              required: true,
              message: 'Please provide a valid value.'
            }
          ]}
        >
          <Input
            placeholder={t('variantDetail.value.name')}
            className='rounded-md'
          />
        </Form.Item>

        <Form.Item className='mb-0'>
          <Button
            type='primary'
            htmlType='submit'
            loading={updateValueMutation.isPending}
            className='w-full rounded-md'
          >
            {t('button.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AdminEditVariantValueForm
