import { useState, useEffect } from 'react'
import { createUserLevel, updateUserLevel } from '../../../apis/level.api'
import {
  Form,
  Input,
  Button,
  notification,
  ColorPicker,
  Spin,
  Alert
} from 'antd'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'

interface UserLevelType {
  _id: string
  name: string
  minPoint: number
  discount: { $numberDecimal: number }
  color: string
}

interface AdminUserLevelFormProps {
  mode: 'create' | 'edit'
  oldLevel?: UserLevelType
  onRun?: () => void
}

const AdminUserLevelForm = ({
  mode = 'create',
  oldLevel,
  onRun = () => {}
}: AdminUserLevelFormProps) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [form] = Form.useForm()
  const isEditMode = mode === 'edit'

  // Create mutation
  const createUserLevelMutation = useMutation({
    mutationFn: (values: {
      name: string
      minPoint: number
      discount: number
      color: string
    }) => createUserLevel(values),
    onSuccess: (res) => {
      if (res.data.error) {
        notification.error({ message: res.data.error })
      } else {
        notification.success({ message: t('toastSuccess.level.create') })
        form.resetFields()
        onRun()
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  // Update mutation
  const updateUserLevelMutation = useMutation({
    mutationFn: (values: {
      name: string
      minPoint: number
      discount: number
      color: string
    }) => {
      if (!oldLevel?._id) return Promise.reject('No ID provided')
      return updateUserLevel(oldLevel._id, values)
    },
    onSuccess: () => {
      notification.success({ message: t('toastSuccess.level.edit') })
      onRun()
    },
    onError: () => {
      notification.error({ message: t('toastError.level.edit') })
    }
  })

  // Set initial values for edit mode
  useEffect(() => {
    if (isEditMode && oldLevel) {
      form.setFieldsValue({
        name: oldLevel.name || '',
        minPoint: oldLevel.minPoint || 0,
        discount: oldLevel.discount?.$numberDecimal || 0,
        color: oldLevel.color || ''
      })
    }
  }, [oldLevel, form, isEditMode])

  const handleFinish = (values: {
    name: string
    minPoint: number
    discount: number
    color: string
  }) => {
    if (isEditMode) {
      // Direct update for edit mode
      updateUserLevelMutation.mutate({
        name: values.name,
        minPoint: Number(values.minPoint),
        discount: Number(values.discount),
        color: values.color
      })
    } else {
      // Show confirmation dialog for create mode
      setIsConfirming(true)
    }
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    createUserLevelMutation.mutate(values)
    setIsConfirming(false)
  }

  const isLoading =
    createUserLevelMutation.isPending || updateUserLevelMutation.isPending
  return (
    <div className={isEditMode ? 'p-4' : 'position-relative'}>
      {isLoading && (
        <div className='d-flex justify-content-center p-4'>
          <Spin size='large' />
        </div>
      )}

      {/* Confirmation dialog only for create mode */}
      {!isEditMode && isConfirming && (
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
        className={isEditMode ? '' : 'row mb-2'}
      >
        <div className={isEditMode ? '' : 'col-12'}>
          <Form.Item
            name='name'
            label={t('levelDetail.name')}
            rules={[{ required: true, message: t('levelDetail.validName') }]}
          >
            <Input placeholder={t('levelDetail.name')} />
          </Form.Item>
        </div>

        <div className={isEditMode ? '' : 'col-12'}>
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

        <div className={isEditMode ? '' : 'col-12'}>
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

        <div className={isEditMode ? '' : 'col-12'}>
          <Form.Item
            name='color'
            label={t('levelDetail.color')}
            rules={[{ required: true, message: t('levelDetail.validColor') }]}
          >
            <ColorPicker
              showText
              format='hex'
              presets={[
                {
                  label: 'Recommended',
                  colors: [
                    '#F5222D',
                    '#FA8C16',
                    '#FADB14',
                    '#8BBB11',
                    '#52C41A',
                    '#13A8A8',
                    '#1677FF',
                    '#2F54EB',
                    '#722ED1',
                    '#EB2F96'
                  ]
                }
              ]}
            />
          </Form.Item>
        </div>

        <div className={isEditMode ? '' : 'col-12 d-grid mt-4'}>
          <Form.Item className={isEditMode ? 'mb-0' : ''}>
            <Button
              type='primary'
              htmlType='submit'
              loading={isLoading}
              className={isEditMode ? 'w-full' : 'rounded-1'}
            >
              {isEditMode ? t('button.save') : t('button.submit')}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default AdminUserLevelForm
