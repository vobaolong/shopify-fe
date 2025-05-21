import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth'
import { updateStoreLevel } from '../../../apis/level'
import { Form, Input, Button, notification } from 'antd'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'

interface StoreLevelType {
  _id: string
  name: string
  minPoint: number
  discount: { $numberDecimal: number }
  color: string
}

const AdminEditStoreLevelForm = ({
  oldLevel,
  onRun = () => {}
}: {
  oldLevel?: StoreLevelType
  onRun?: () => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { _id } = getToken()

  useEffect(() => {
    if (oldLevel) {
      form.setFieldsValue({
        name: oldLevel.name || '',
        minPoint: oldLevel.minPoint || 0,
        discount: oldLevel.discount?.$numberDecimal || 0,
        color: oldLevel.color || ''
      })
    }
  }, [oldLevel, form])

  const updateStoreLevelMutation = useMutation({
    mutationFn: (values: {
      name: string
      minPoint: number
      discount: number
      color: string
    }) => {
      if (!oldLevel?._id) return Promise.reject()
      return updateStoreLevel(oldLevel._id, values)
    },
    onSuccess: (res) => {
      if (res.data.error) notification.error({ message: res.data.error })
      else {
        notification.success({ message: t('toastSuccess.level.edit') })
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
    updateStoreLevelMutation.mutate(values)
  }

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {updateStoreLevelMutation.isPending && <Loading />}
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
            label='Level name'
            rules={[
              { required: true, message: 'Please provide a valid level name.' }
            ]}
          >
            <Input placeholder='Level name' />
          </Form.Item>
        </div>
        <div className='col-12'>
          <Form.Item
            name='minPoint'
            label='Floor point'
            rules={[
              {
                required: true,
                message: 'Please provide a valid floor point (>=0).'
              }
            ]}
          >
            <Input type='number' placeholder='Floor point' />
          </Form.Item>
        </div>
        <div className='col-12'>
          <Form.Item
            name='discount'
            label='Discount (%)'
            rules={[
              {
                required: true,
                message: 'Please provide a valid floor point (0% - 100%).'
              }
            ]}
          >
            <Input type='number' placeholder='Discount (%)' />
          </Form.Item>
        </div>
        <div className='col-12'>
          <Form.Item
            name='color'
            label='Color'
            rules={[
              { required: true, message: 'Please provide a valid color.' }
            ]}
          >
            <Input placeholder='Color' />
          </Form.Item>
        </div>
        <div className='col-12 d-grid mt-4'>
          <Button type='primary' htmlType='submit' className='rounded-1'>
            Save
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AdminEditStoreLevelForm
