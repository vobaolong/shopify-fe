import React from 'react'
import { useTranslation } from 'react-i18next'
import { reportByUser } from '../../../apis/report.api'
import { socketId } from '../../../socket'
import { toast } from 'react-toastify'
import { Form, Radio, Button, Space } from 'antd'
import { useMutation } from '@tanstack/react-query'

interface Reason {
  value: string
  label: string
}

interface ListComplaintProps {
  reasons: Reason[]
  objectId: string
  reportBy: string
  isStore: boolean
}

const ListComplaint = ({
  reasons,
  objectId,
  reportBy,
  isStore
}: ListComplaintProps) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const reportMutation = useMutation({
    mutationFn: async (reason: string) => {
      await reportByUser({
        objectId: objectId,
        reportBy: reportBy,
        reason: reason,
        isStore: isStore
      })
      socketId.emit('notificationReport', {
        objectId: objectId,
        from: reportBy,
        to: import.meta.env.ADMIN_ID
      })
    },
    onSuccess: () => {
      toast.success('Gửi khiếu nại thành công')
      form.resetFields()
    },
    onError: (error) => {
      console.error('Error reporting:', error)
      toast.error('Error submitting report')
    }
  })

  const onFinish = (values: { reason: string }) => {
    if (values.reason) {
      reportMutation.mutate(values.reason)
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
          label='Chọn lý do báo cáo'
          rules={[{ required: true, message: 'Vui lòng chọn lý do báo cáo' }]}
        >
          <Radio.Group className='w-full'>
            <Space direction='vertical' className='w-full'>
              {reasons.map((reason) => (
                <Radio
                  key={reason.value}
                  value={reason.value}
                  className='w-full'
                >
                  {reason.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item className='mb-0 flex justify-end'>
          <Button
            type='primary'
            htmlType='submit'
            loading={reportMutation.isPending}
            className='w-1/2 min-w-[120px]'
          >
            {t('button.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ListComplaint
