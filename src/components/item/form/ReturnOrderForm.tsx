import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { socketId } from '../../../socket'
import { toast } from 'react-toastify'
import { createReturnRequest } from '../../../apis/order.api'
import { getToken } from '../../../apis/auth.api'
import { Form, Radio, Button, Space, Divider } from 'antd'
import { useMutation } from '@tanstack/react-query'

interface Reason {
  value: string
  label: string
}

interface ReturnOrderFormProps {
  reasons: Reason[]
  orderId: string
  userId: string
  storeId: string
}

const ReturnOrderForm: React.FC<ReturnOrderFormProps> = ({
  reasons,
  orderId,
  userId,
  storeId
}) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { _id } = getToken()

  const returnMutation = useMutation({
    mutationFn: async (reason: string) => {
      await createReturnRequest(_id, orderId, reason)
      socketId.emit('createNotificationReturn', {
        objectId: orderId,
        from: userId,
        to: storeId
      })
    },
    onSuccess: () => {
      toast.success('Gửi yêu cầu thành công')
      form.resetFields()
    },
    onError: (error) => {
      console.error('Error reporting:', error)
      toast.error('Error submitting report')
    }
  })

  const onFinish = (values: { reason: string }) => {
    if (values.reason) {
      returnMutation.mutate(values.reason)
    } else {
      toast.error('Please select a reason for reporting.')
    }
  }
  return (
    <div className='relative'>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        className='space-y-4'
      >
        <Form.Item
          name='reason'
          label='Chọn lý do'
          rules={[{ required: true, message: 'Vui lòng chọn lý do trả hàng' }]}
        >
          <Radio.Group className='w-full'>
            <Space direction='vertical' className='w-full'>
              {reasons.map((reason: Reason) => (
                <div key={reason.value} className='w-full'>
                  <Radio value={reason.value} className='w-full'>
                    {reason.label}
                  </Radio>
                  <Divider className='my-2' />
                </div>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item className='mb-0 flex justify-end'>
          <Button
            type='primary'
            htmlType='submit'
            loading={returnMutation.isPending}
            className='w-1/2 min-w-[120px]'
          >
            {t('button.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ReturnOrderForm
