import { useState } from 'react'
import { getToken } from '../../../apis/auth.api'
import { createCommission } from '../../../apis/commission.api'
import { Form, Input, Button, notification } from 'antd'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'

const AdminCreateCommissionForm = ({ onRun = () => {} }) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [form] = Form.useForm()

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
    <div className='position-relative'>
      {createCommissionMutation.isPending && <Loading />}
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
        className='row mb-2'
      >
        <div className='col-12'>
          <Form.Item
            name='name'
            label={t('commissionDetail.name')}
            rules={[
              { required: true, message: t('commissionDetail.validName') }
            ]}
          >
            <Input placeholder={t('commissionDetail.name')} />
          </Form.Item>
        </div>
        <div className='col-12'>
          <Form.Item
            name='fee'
            label={`${t('commissionDetail.fee')} (%)`}
            rules={[
              { required: true, message: t('commissionDetail.feeValid') }
            ]}
          >
            <Input type='number' placeholder={t('commissionDetail.fee')} />
          </Form.Item>
        </div>
        <div className='col-12'>
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
            <Input.TextArea placeholder={t('commissionDetail.description')} />
          </Form.Item>
        </div>
        <div className='col-12 d-flex justify-content-end mt-4'>
          <Button type='primary' htmlType='submit' className='w-50'>
            {t('button.submit')}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AdminCreateCommissionForm
