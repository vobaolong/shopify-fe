import { useState, useEffect } from 'react'
import { Form, Input, Button, Modal, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCreateVariantValue } from '../../../hooks/useVariantValue'
import { useAntdApp } from '../../../hooks/useAntdApp'

interface AddVariantValueFormProps {
  variantId: string
  variantName: string
  onRun?: () => void
}

const AddVariantValueForm = ({
  variantId,
  variantName,
  onRun
}: AddVariantValueFormProps) => {
  const [form] = Form.useForm()
  const { notification } = useAntdApp()
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [newValue, setNewValue] = useState({
    name: '',
    variantId,
    variantName
  })

  const createValueMutation = useCreateVariantValue()

  useEffect(() => {
    setNewValue((prev) => ({
      ...prev,
      variantId,
      variantName
    }))
  }, [variantId, variantName])

  const handleSubmit = (values: { name: string }) => {
    setNewValue((prev) => ({ ...prev, name: values.name }))
    setIsConfirming(true)
  }

  const handleConfirm = () => {
    createValueMutation.mutate(
      { ...newValue },
      {
        onSuccess: (data) => {
          const response = data.data || data
          if (response.error) {
            notification.error({ message: response.error })
          } else {
            form.resetFields()
            setNewValue((prev) => ({ ...prev, name: '' }))
            if (onRun) onRun()
            notification.success({
              message: t('toastSuccess.variantValue.add')
            })
          }
          setIsConfirming(false)
        },
        onError: () => {
          notification.error({ message: 'Server error' })
          setIsConfirming(false)
        }
      }
    )
  }

  return (
    <div className='relative'>
      <Spin spinning={createValueMutation.isPending}>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          className='mb-2'
        >
          <Form.Item
            label='Value'
            name='name'
            rules={[
              { required: true, message: 'Please provide a valid value.' }
            ]}
          >
            <Input placeholder='Enter value name' className='rounded-md' />
          </Form.Item>

          <Form.Item className='mb-0 mt-4'>
            <Button
              type='primary'
              htmlType='submit'
              block
              className='rounded-md h-10'
            >
              {t('button.submit')}
            </Button>
          </Form.Item>
        </Form>
      </Spin>

      <Modal
        title={`${t('addValue')} ${variantName}`}
        open={isConfirming}
        onOk={handleConfirm}
        onCancel={() => setIsConfirming(false)}
        confirmLoading={createValueMutation.isPending}
        okText='Confirm'
        cancelText='Cancel'
        className='rounded-lg'
      >
        <p>{t('confirmDialog')}</p>
      </Modal>
    </div>
  )
}

export default AddVariantValueForm
