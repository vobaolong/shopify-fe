import { useEffect } from 'react'
import { updateCommission } from '../../../apis/commission'
import { Form, Input, Button, notification, InputNumber, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { CommissionType } from '../../../@types/entity.types'

interface AdminEditCommissionFormProps {
  oldCommission?: CommissionType
  onRun?: () => void
}

const AdminEditCommissionForm = ({
  oldCommission,
  onRun = () => {}
}: AdminEditCommissionFormProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  useEffect(() => {
    if (oldCommission) {
      form.setFieldsValue({
        name: oldCommission.name || '',
        description: oldCommission.description || '',
        fee: oldCommission.fee?.$numberDecimal || ''
      })
    }
  }, [oldCommission, form])

  const updateCommissionMutation = useMutation({
    mutationFn: (values: {
      name: string
      description: string
      fee: number
    }) => {
      if (!oldCommission?._id) return Promise.reject()
      return updateCommission(oldCommission._id, values)
    },
    onSuccess: (res) => {
      if (res.data.error) notification.error({ message: res.data.error })
      else {
        notification.success({ message: t('toastSuccess.commission.edit') })
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
    Modal.confirm({
      title: t('commissionDetail.edit'),
      content: t('message.edit'),
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      onOk: () => updateCommissionMutation.mutate(values),
      okButtonProps: { loading: updateCommissionMutation.isPending }
    })
  }

  return (
    <div className='mt-3 w-full'>
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{ name: '', description: '', fee: 0 }}
      >
        <Form.Item
          name='name'
          label={t('commissionDetail.name')}
          rules={[{ required: true, message: t('commissionDetail.validName') }]}
        >
          <Input placeholder={t('commissionDetail.name')} />
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
          <Input.TextArea placeholder={t('commissionDetail.description')} />
        </Form.Item>
        <Form.Item
          name='fee'
          label={`${t('commissionDetail.fee')} (%)`}
          rules={[{ required: true, message: t('commissionDetail.feeValid') }]}
        >
          <InputNumber
            className='!w-full'
            type='number'
            placeholder={t('commissionDetail.fee')}
            min={0}
            max={100}
          />
        </Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          className='w-full'
          loading={updateCommissionMutation.isPending}
        >
          {t('button.save')}
        </Button>
      </Form>
    </div>
  )
}

export default AdminEditCommissionForm
