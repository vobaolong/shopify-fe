import { useEffect } from 'react'
import { Form, Input, Button, notification } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getToken } from '../../../apis/auth.api'
import { updateValue } from '../../../apis/variant.api'
import { useTranslation } from 'react-i18next'

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
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { _id } = getToken()

  const updateValueMutation = useMutation({
    mutationFn: (values: ValueFormData) =>
      updateValue(_id, oldVariantValue?._id || '', {
        ...oldVariantValue,
        ...values
      }),
    onSuccess: (res) => {
      if (res.data.error) {
        notification.error({
          message: res.data.error
        })
      } else {
        notification.success({
          message: t('toastSuccess.updateValue')
        })
        queryClient.invalidateQueries({ queryKey: ['variants'] })
        onRun?.()
      }
    },
    onError: () => {
      notification.error({
        message: 'Server Error'
      })
    }
  })

  useEffect(() => {
    if (oldVariantValue) {
      form.setFieldsValue({
        name: oldVariantValue.name
      })
    }
  }, [oldVariantValue, form])

  const handleSubmit = (values: ValueFormData) => {
    updateValueMutation.mutate(values)
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
