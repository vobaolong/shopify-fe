import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth'
import { updateCommission } from '../../../apis/commission'
import { Form, Input, Button, notification } from 'antd'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { CommissionType } from '../../../@types/entity.types'

interface CommissionTableType extends CommissionType {
  isDeleted?: boolean
  fee?: { $numberDecimal: number }
}

interface AdminEditCommissionFormProps {
  oldCommission?: CommissionTableType
  onRun?: () => void
}

const AdminEditCommissionForm = ({
  oldCommission,
  onRun = () => {}
}: AdminEditCommissionFormProps) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [form] = Form.useForm()
  const { _id } = getToken()

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
    setIsConfirming(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    updateCommissionMutation.mutate(values)
    setIsConfirming(false)
  }

  return (
    <div className='position-relative'>
      {updateCommissionMutation.isPending && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('commissionDetail.edit')}
          onSubmit={handleConfirmSubmit}
          message={t('message.edit')}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{ name: '', description: '', fee: '' }}
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
        <div className='col-12 d-grid mt-4'>
          <Button type='primary' htmlType='submit' className='rounded-1'>
            {t('button.save')}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AdminEditCommissionForm
