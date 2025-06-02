import { useState, useEffect } from 'react'
import { Form, Input, Button, Modal, Spin, notification } from 'antd'
import { getToken } from '../../../apis/auth.api'
import { createValue } from '../../../apis/variant.api'
import { regexTest } from '../../../helper/test'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import useInvalidate from '../../../hooks/useInvalidate'

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
  const invalidate = useInvalidate()
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [newValue, setNewValue] = useState({
    name: '',
    variantId,
    variantName
  })

  const { _id } = getToken()

  useEffect(() => {
    setNewValue((prev) => ({
      ...prev,
      variantId,
      variantName
    }))
  }, [variantId, variantName])

  const createValueMutation = useMutation({
    mutationFn: () => createValue(_id, newValue),
    onSuccess: (res) => {
      const data = res.data
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        form.resetFields()
        setNewValue((prev) => ({ ...prev, name: '' }))
        if (onRun) onRun()
        notification.success({ message: t('toastSuccess.variantValue.add') })
        invalidate({ queryKey: ['variants'] })
      }
      setIsConfirming(false)
    },
    onError: () => {
      notification.error({ message: 'Server error' })
      setIsConfirming(false)
    }
  })

  const handleSubmit = (values: { name: string }) => {
    setNewValue((prev) => ({ ...prev, name: values.name }))
    setIsConfirming(true)
  }

  const handleConfirm = () => {
    createValueMutation.mutate()
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
              { required: true, message: 'Please provide a valid value.' },
              {
                validator: (_, value) => {
                  if (!value || regexTest('anything', value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error('Please provide a valid value.')
                  )
                }
              }
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
