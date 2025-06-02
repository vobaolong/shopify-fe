import { useState, useEffect } from 'react'
import { createStoreLevel, updateStoreLevel } from '../../../apis/level.api'
import { Form, Input, Button, notification, ColorPicker } from 'antd'
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

interface AdminStoreLevelFormProps {
  mode: 'create' | 'edit'
  oldLevel?: StoreLevelType
  onRun?: () => void
}

const AdminStoreLevelForm = ({
  mode = 'create',
  oldLevel,
  onRun = () => {}
}: AdminStoreLevelFormProps) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [form] = Form.useForm()
  const isEditMode = mode === 'edit'

  // Create mutation
  const createStoreLevelMutation = useMutation({
    mutationFn: (values: {
      name: string
      minPoint: number
      discount: number
      color: string
    }) => createStoreLevel(values),
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
      if (res.data.error) {
        notification.error({ message: res.data.error })
      } else {
        notification.success({ message: t('toastSuccess.level.edit') })
        onRun()
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

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
      updateStoreLevelMutation.mutate(values)
    } else {
      setIsConfirming(true)
    }
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    createStoreLevelMutation.mutate(values)
    setIsConfirming(false)
  }

  const isLoading =
    createStoreLevelMutation.isPending || updateStoreLevelMutation.isPending

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('dialog.createStoreLevel')}
          onSubmit={handleConfirmSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
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
            label={isEditMode ? 'Level name' : t('levelDetail.name')}
            rules={[
              {
                required: true,
                message: isEditMode
                  ? 'Please provide a valid level name.'
                  : t('levelDetail.validName')
              }
            ]}
          >
            <Input
              placeholder={isEditMode ? 'Level name' : t('levelDetail.name')}
            />
          </Form.Item>
        </div>
        <div className='col-12'>
          <Form.Item
            name='minPoint'
            label={isEditMode ? 'Floor point' : t('levelDetail.floorPoint')}
            rules={[
              {
                required: true,
                message: isEditMode
                  ? 'Please provide a valid floor point (>=0).'
                  : t('levelDetail.validFloorPoint')
              }
            ]}
          >
            <Input
              type='number'
              placeholder={
                isEditMode ? 'Floor point' : t('levelDetail.floorPoint')
              }
            />
          </Form.Item>
        </div>
        <div className='col-12'>
          <Form.Item
            name='discount'
            label={
              isEditMode ? 'Discount (%)' : `${t('levelDetail.discount')} (%)`
            }
            rules={[
              {
                required: true,
                message: isEditMode
                  ? 'Please provide a valid floor point (0% - 100%).'
                  : t('levelDetail.validDiscount')
              }
            ]}
          >
            <Input
              type='number'
              placeholder={
                isEditMode ? 'Discount (%)' : t('levelDetail.discount')
              }
            />
          </Form.Item>
        </div>
        <div className='col-12'>
          <Form.Item
            name='color'
            label={isEditMode ? 'Color' : t('levelDetail.color')}
            rules={[
              {
                required: true,
                message: isEditMode
                  ? 'Please provide a valid color.'
                  : t('levelDetail.validColor')
              }
            ]}
          >
            <ColorPicker
              showText
              format='hex'
              presets={[
                {
                  label: 'Recommended',
                  colors: isEditMode
                    ? [
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
                    : ['#F5222D', '#FA8C16', '#FADB14', '#8BBB11', '#52C41A']
                }
              ]}
            />
          </Form.Item>
        </div>
        <div className='col-12 d-grid mt-4'>
          <Button type='primary' htmlType='submit' className='rounded-1'>
            {isEditMode ? 'Save' : t('button.submit')}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AdminStoreLevelForm
