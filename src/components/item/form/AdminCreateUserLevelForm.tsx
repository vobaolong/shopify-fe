import { useState } from 'react'
import { createUserLevel } from '../../../apis/level'
import { Form, Input, Button, notification } from 'antd'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import ColorPickerInput from '../../ui/ColorPickerInput'
import { useMutation } from '@tanstack/react-query'

const AdminCreateUserLevelForm = ({ onRun = () => {} }) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [form] = Form.useForm()

  const createUserLevelMutation = useMutation({
    mutationFn: (values: {
      name: string
      minPoint: number
      discount: number
      color: string
    }) => createUserLevel(values),
    onSuccess: (res) => {
      if (res.data.error) notification.error({ message: res.data.error })
      else {
        notification.success({ message: t('toastSuccess.level.create') })
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
    minPoint: number
    discount: number
    color: string
  }) => {
    setIsConfirming(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    createUserLevelMutation.mutate(values)
    setIsConfirming(false)
  }

  return (
    <div className='position-relative'>
      {createUserLevelMutation.isPending && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('dialog.createUserLevel')}
          onSubmit={handleConfirmSubmit}
          message={t('confirmDialog')}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{ name: '', minPoint: 0, discount: 0, color: '' }}
        className='row mb-2'
      >
        <div className='col-12'>
          <Form.Item
            name='name'
            label={t('levelDetail.name')}
            rules={[{ required: true, message: t('levelDetail.validName') }]}
          >
            <Input placeholder={t('levelDetail.name')} />
          </Form.Item>
        </div>
        <div className='col-12'>
          <Form.Item
            name='minPoint'
            label={t('levelDetail.floorPoint')}
            rules={[
              { required: true, message: t('levelDetail.validFloorPoint') }
            ]}
          >
            <Input type='number' placeholder={t('levelDetail.floorPoint')} />
          </Form.Item>
        </div>
        <div className='col-12'>
          <Form.Item
            name='discount'
            label={`${t('levelDetail.discount')} (%)`}
            rules={[
              { required: true, message: t('levelDetail.validDiscount') }
            ]}
          >
            <Input type='number' placeholder={t('levelDetail.discount')} />
          </Form.Item>
        </div>
        <div className='col-12'>
          <Form.Item
            name='color'
            label={t('levelDetail.color')}
            rules={[{ required: true, message: t('levelDetail.validColor') }]}
          >
            <ColorPickerInput
              label={t('levelDetail.color')}
              color={form.getFieldValue('color')}
              onChange={(selectedColor) =>
                form.setFieldsValue({ color: selectedColor })
              }
            />
          </Form.Item>
        </div>
        <div className='col-12 d-grid mt-4'>
          <Button type='primary' htmlType='submit' className='rounded-1'>
            {t('button.submit')}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AdminCreateUserLevelForm
