import { useState } from 'react'
import { getToken } from '../../../apis/auth.api'
import { createCommission } from '../../../apis/commission.api'
import { Form, Input, Button, Spin } from 'antd'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { useAntdApp } from '../../../hooks/useAntdApp'

const AdminCreateCommissionForm = ({ onRun = () => {} }) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [form] = Form.useForm()
  const { notification } = useAntdApp()
  const createCommissionMutation = useMutation({
    mutationFn: (values: { name: string; description: string; fee: number }) =>
      createCommission(values),
    onSuccess: (res) => {
      if (res.data.error) notification.error({ message: res.data.error })
      else {
        notification.success({ message: t('toastSuccess.commission.create') })
        form.resetFields()
        if (onRun) onRun()
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  const handleFinish = (values: {
    name: string
    description: string
    fee: number
  }) => {
    setIsConfirming(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    createCommissionMutation.mutate(values)
    setIsConfirming(false)
  }
  return (
    <div className='relative'>
      <Spin spinning={createCommissionMutation.isPending}>
        {isConfirming && (
          <ConfirmDialog
            title={t('dialog.createCommission')}
            onSubmit={handleConfirmSubmit}
            onClose={() => setIsConfirming(false)}
            message={t('confirmDialog')}
          />
        )}
        <Form
          form={form}
          layout='vertical'
          onFinish={handleFinish}
          initialValues={{ name: '', description: '', fee: 0 }}
          className='w-full'
        >
          <Form.Item
            name='name'
            label={t('commissionDetail.name')}
            rules={[
              { required: true, message: t('commissionDetail.validName') }
            ]}
          >
            <Input placeholder={t('commissionDetail.name')} />
          </Form.Item>

          <Form.Item
            name='fee'
            label={`${t('commissionDetail.fee')} (%)`}
            rules={[
              { required: true, message: t('commissionDetail.feeValid') }
            ]}
          >
            <Input type='number' placeholder={t('commissionDetail.fee')} />
          </Form.Item>

          <Form.Item
            name='description'
            label={t('commissionDetail.description')}
            rules={[
              {
                required: true,
                message: t('commissionDetail.validDescription')
              }
            ]}
          >
            <Input.TextArea
              placeholder={t('commissionDetail.description')}
              rows={4}
            />
          </Form.Item>

          <Form.Item className='flex justify-end mt-6'>
            <Button type='primary' htmlType='submit' className='w-1/2'>
              {t('button.submit')}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  )
}

export default AdminCreateCommissionForm
