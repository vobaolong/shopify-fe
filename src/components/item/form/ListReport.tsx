import React from 'react'
import { useTranslation } from 'react-i18next'
import { reportByUser } from '../../../apis/report.api'
import { socketId } from '../../../socket'
import { Form, Radio, Input, Button, message } from 'antd'
import { useMutation } from '@tanstack/react-query'

interface Reason {
  value: string
  label: string
}

interface ListReportProps {
  reasons: Reason[]
  objectId: string
  reportBy: string
  isStore: boolean
  isProduct: boolean
  isReview: boolean
  showOtherReason?: boolean
}

const ListReport: React.FC<ListReportProps> = ({
  reasons,
  objectId,
  reportBy,
  isStore,
  isProduct,
  isReview,
  showOtherReason = false
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [api, contextHolder] = message.useMessage()

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const reasonToSubmit =
        values.reason === 'other' ? values.otherReason : values.reason
      await reportByUser({
        objectId,
        reportBy,
        reason: reasonToSubmit,
        isStore,
        isProduct,
        isReview
      })
      socketId.emit('notificationReport', {
        objectId: objectId,
        from: reportBy,
        to: import.meta.env.ADMIN_ID
      })
    },
    onSuccess: () => {
      api.success(t('toastSuccess.report'))
      form.resetFields()
    },
    onError: () => {
      api.error(t('toastError.report'))
    }
  })

  const onFinish = (values: any) => {
    if (!values.reason) {
      api.error(t('Please select a reason for reporting.'))
      return
    }
    if (values.reason === 'other' && !values.otherReason) {
      api.error(t('Please enter the other reason.'))
      return
    }
    mutation.mutate(values)
  }

  return (
    <div className='relative'>
      {contextHolder}
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        className='space-y-4'
      >
        <Form.Item
          label={t('Chọn lý do báo cáo')}
          name='reason'
          rules={[
            {
              required: true,
              message: t('Please select a reason for reporting.')
            }
          ]}
        >
          <Radio.Group className='flex flex-col gap-2'>
            {reasons.map((reason) => (
              <Radio key={reason.value} value={reason.value}>
                {reason.label}
              </Radio>
            ))}
            {showOtherReason && <Radio value='other'>{t('Khác')}</Radio>}
          </Radio.Group>
        </Form.Item>
        {showOtherReason && (
          <Form.Item
            shouldUpdate={(prev, curr) => prev.reason !== curr.reason}
            noStyle
          >
            {({ getFieldValue }) =>
              getFieldValue('reason') === 'other' ? (
                <Form.Item
                  name='otherReason'
                  rules={[
                    {
                      required: true,
                      message: t('Please enter the other reason.')
                    }
                  ]}
                  className='mt-2'
                >
                  <Input placeholder={t('Nhập lý do khác')} />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        )}
        <Form.Item className='flex justify-end'>
          <Button
            type='primary'
            htmlType='submit'
            loading={mutation.isPending}
            className='w-40'
          >
            {t('button.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ListReport
